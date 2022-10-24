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
      maxAge: 60 * 60 * 24, // TODO: Decrease this timeout as appropriate.
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

  if (!session?.get("accountNumber")) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }

  return {
    accountNumber: session.get("accountNumber"),
    balance: session.get("balance"),
    dailyWithdrawalLimit: session.get("dailyWithdrawalLimit"),
    dailyWithdrawalsMade: session.get("dailyWithdrawalsMade"),
  };
}
