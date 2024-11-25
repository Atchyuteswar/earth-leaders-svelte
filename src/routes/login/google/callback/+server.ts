import { google } from "$lib/server/oauth";
import { decodeIdToken } from "arctic";
import * as auth from "$lib/server/auth";
import { fail } from "@sveltejs/kit";

import type { RequestEvent } from "@sveltejs/kit";
import type { OAuth2Tokens } from "arctic";

type GoogleClaims = {
	sub: string;
	email: string;
	name: string;
};

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get("code");
	const state = event.url.searchParams.get("state");
	const storedState = event.cookies.get("google_oauth_state") ?? null;
	const codeVerifier = event.cookies.get("google_code_verifier") ?? null;

	if (!code || !state || !storedState || !codeVerifier) {
		return new Response("Missing parameters", { status: 400 });
	}

	if (state !== storedState) {
		return new Response("Invalid state", { status: 400 });
	}

	return google.validateAuthorizationCode(code, codeVerifier)
		.then((tokens: OAuth2Tokens) => {
			const decodedToken: GoogleClaims = decodeIdToken(tokens.idToken());
			console.info("Google OAuth token decoded", {
				sub: decodedToken.sub,
				email: decodedToken.email
			});

			const claims: GoogleClaims = {
				sub: decodedToken.sub ?? '',
				email: decodedToken.email ?? '',
				name: decodedToken.name ?? '',
			} as GoogleClaims;
			return claims;
		})
		.then(async (claims) => {
			const googleUserId = claims.sub;
			const email = claims.email;
			const username = claims.name;

			console.info("Checking if user exists", { googleUserId, email });
			let userId = await auth.getUserByGoogleId(googleUserId);

			if (!userId) {
				console.info("Creating new user", { email });
				userId = await auth.createUser({
					googleId: googleUserId,
					email,
					username
				});
			}

			console.info("Creating session for user", { userId });
			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, userId);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

			return new Response(null, {
				status: 302,
				headers: {
					Location: "/"
				}
			});
		})
		.catch((error) => {
			console.error("Google OAuth error", {
				error: error.message,
				stack: error.stack
			});
			return new Response("Authentication failed", { status: 400 });
		});
}
