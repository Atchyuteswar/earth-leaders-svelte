import { fail, redirect } from "@sveltejs/kit";
import * as auth from "$lib/server/auth";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
	// Redirect to home if user is already logged in
	if (locals.user) {
		throw redirect(302, "/");
	}
};

export const actions: Actions = {
	default: async (event) => {
		const data = await event.request.formData();
		const username = data.get("name");
		const email = data.get("email");
		const password = data.get("password");

		if (
			typeof username !== "string" ||
			typeof email !== "string" ||
			typeof password !== "string" ||
			!username ||
			!email ||
			!password
		) {
			return fail(400, {
				error: "Invalid form data"
			});
		}

		return auth.createUser({ username, email, password })
			.then(userId => {
				const sessionToken = auth.generateSessionToken();
				return auth.createSession(sessionToken, userId)
					.then(session => {
						auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
						return redirect(302, "/");
					});
			})
			.catch(() => {
				return fail(400, {
					error: "Failed to create account"
				});
			});
	}
};
