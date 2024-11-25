import { Google } from "arctic";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "$env/static/private";
import { PUBLIC_GOOGLE_CALLBACK_URL } from '$env/static/public';

const googleCallbackUrl = PUBLIC_GOOGLE_CALLBACK_URL;

export const google = new Google(
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	googleCallbackUrl
);
