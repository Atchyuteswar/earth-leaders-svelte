import { fail, redirect } from "@sveltejs/kit";
import * as auth from "$lib/server/auth";
import type { Actions, PageServerLoad } from "./$types";
import { invalidateAll } from "$app/navigation";

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

		// Try to validate the email and password
		let userId: string;
		try {
			userId = await auth.validateEmailPassword(email, password);
		} catch (error) {
			console.error('Login error:', error);
			return fail(400, {
				error: 'Invalid email or password',
				email
			});
		}

		// If we get here, the credentials are valid
		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, userId);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		
		return redirect(302, '/');
	}
};
