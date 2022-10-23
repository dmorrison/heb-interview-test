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
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
  },
});

export async function createUserSession(
  userId,
  redirectTo
) {
  const session = await cookieSessionStorage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
      headers: {
          "Set-Cookie": await cookieSessionStorage.commitSession(session),
      },
  });
}

export async function login({
  username,
  password,
}) {
  // const user = await db.user.findUnique({
  //   where: { username },
  // });
  // if (!user) return null;
  // const isCorrectPassword = await bcrypt.compare(
  //   password,
  //   user.passwordHash
  // );
  // if (!isCorrectPassword) return null;

  // return { id: user.id, username };

  return { id: 1234, username };
}

export async function logout(request) {
  const session = await cookieSessionStorage.getSession(request.headers.get("cookie"));
  return redirect("/login", {
    headers: {
      "Set-Cookie": await cookieSessionStorage.destroySession(session),
    },
  });
}

export async function requireUserSession(
  request,
  redirectTo = new URL(request.url).pathname
) {
  const session = await cookieSessionStorage.getSession(request.headers.get("cookie"));
  const userId = session.get("userId");

  if (!userId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }

  return { userId };
}
