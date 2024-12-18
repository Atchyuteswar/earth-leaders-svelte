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
			console.log('Form validation failed:', {
				username: typeof username,
				email: typeof email,
				password: typeof password
			});
			return fail(400, {
				error: "Invalid form data"
			});
		}

		let userId: string;
		try {
			userId = await auth.createUser({ username, email, password });
			console.log('User created successfully:', { userId });
		} catch (error) {
			console.error('Failed to create account:', error);
			return fail(400, {
				error: "Failed to create account"
			});
		}

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, userId);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		return redirect(302, "/");
	}
};
