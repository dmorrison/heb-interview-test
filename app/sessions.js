import {
  createCookieSessionStorage,
  redirect,
} from "@remix-run/node";

const cookieSessionStorage = createCookieSessionStorage({
  cookie: {
      name: "atm_session",
      secrets: ["s3cret1"],
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 5, // TODO: Verify this is 5 minutes.
      httpOnly: true,
  },
});
const { getSession, commitSession, destroySession } = cookieSessionStorage;
export { getSession, commitSession, destroySession };

export async function requireUserSession(
  request,
  redirectTo = new URL(request.url).pathname
) {
  const session = await getSession(request.headers.get("cookie"));
  const accountNumber = session?.get("accountNumber");

  if (!accountNumber) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }

  return { accountNumber };
}
