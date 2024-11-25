import { fail, redirect } from "@sveltejs/kit";
import * as auth from "$lib/server/auth";
import type { Actions, PageServerLoad } from "./$types";

function validateEmail(email: unknown): email is string {
	return typeof email === 'string' && email.includes('@') && email.length > 0;
}

function validatePassword(password: unknown): password is string {
	return typeof password === 'string' && password.length >= 6;
}

export const load: PageServerLoad = async ({ locals }) => {
	// Redirect to home if user is already logged in
	if (locals.user) {
		throw redirect(302, "/");
	}
};

export const actions: Actions = {
	default: async (event) => {
		const data = await event.request.formData();
		const email = data.get('email');
		const password = data.get('password');

		if (!validateEmail(email)) {
			return fail(400, {
				error: 'Invalid email format',
				email: String(email)
			});
		}

		if (!validatePassword(password)) {
			return fail(400, {
				error: 'Password must be at least 6 characters',
				email: email
			});
		}

		return auth.validateEmailPassword(email, password)
			.then(async userId => {
				const sessionToken = auth.generateSessionToken();
				const session = await auth.createSession(sessionToken, userId);
				auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
				return redirect(302, '/');
			})
			.catch((error) => {
				console.error('Login error:', error);
				return fail(400, {
					error: 'Invalid email or password',
					email
				});
			});
	}
};
