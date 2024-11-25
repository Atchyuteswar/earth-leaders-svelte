import type { RequestEvent } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const sessionCookieName = 'auth-session';

export function generateSessionToken() {
	const bytes = crypto.getRandomValues(new Uint8Array(18));
	const token = encodeBase64url(bytes);
	return token;
}

export async function createSession(token: string, userId: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: table.Session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + DAY_IN_MS * 30),
		createdAt: new Date()
	};
	await db.insert(table.session).values(session);
	return session;
}

export async function validateSessionToken(token: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const [result] = await db
		.select({
			user: { id: table.user.id, username: table.user.username, email: table.user.email },
			session: table.session
		})
		.from(table.session)
		.innerJoin(table.user, eq(table.session.userId, table.user.id))
		.where(eq(table.session.id, sessionId));

	if (!result) {
		return { session: null, user: null };
	}
	const { session, user } = result;

	const sessionExpired = Date.now() >= session.expiresAt.getTime();
	if (sessionExpired) {
		await db.delete(table.session).where(eq(table.session.id, session.id));
		return { session: null, user: null };
	}

	const renewSession = Date.now() >= session.expiresAt.getTime() - DAY_IN_MS * 15;
	if (renewSession) {
		session.expiresAt = new Date(Date.now() + DAY_IN_MS * 30);
		await db
			.update(table.session)
			.set({ expiresAt: session.expiresAt })
			.where(eq(table.session.id, session.id));
	}

	return { session, user };
}

export type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>;

export async function invalidateSession(sessionId: string) {
	await db.delete(table.session).where(eq(table.session.id, sessionId));
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date) {
	event.cookies.set(sessionCookieName, token, {
		expires: expiresAt,
		path: '/',
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax'
	});
}

export function deleteSessionTokenCookie(event: RequestEvent) {
	event.cookies.delete(sessionCookieName, {
		path: '/'
	});
}

export async function validateEmailPassword(email: string, password: string) {
	const [user] = await db
		.select()
		.from(table.user)
		.where(eq(table.user.email, email));

	if (!user || !user.passwordHash) {
		throw new Error('Invalid email or password');
	}

	const hashedPassword = encodeHexLowerCase(sha256(new TextEncoder().encode(password)));
	if (hashedPassword !== user.passwordHash) {
		throw new Error('Invalid email or password');
	}

	return user.id;
}

export async function createUser(data: {
	email: string;
	username: string;
	password?: string;
	googleId?: string;
}) {
	const userId = encodeBase64url(crypto.getRandomValues(new Uint8Array(18)));
	const user = {
		id: userId,
		email: data.email,
		username: data.username,
		googleId: data.googleId,
		passwordHash: data.password
			? encodeHexLowerCase(sha256(new TextEncoder().encode(data.password)))
			: null,
		createdAt: new Date(),
		updatedAt: new Date()
	};

	await db.insert(table.user).values(user);
	return userId;
}

export async function getUserByGoogleId(googleId: string) {
	const [user] = await db
		.select()
		.from(table.user)
		.where(eq(table.user.googleId, googleId));

	return user?.id || null;
}