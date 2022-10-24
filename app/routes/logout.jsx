import { redirect } from "@remix-run/node";
import { getSession, destroySession } from "~/sessions";

export const loader = async () => {
  // Guard against GET requests by redirecting to home.
  return redirect("/");
};

export const action = async ({ request }) => {
  const session = await getSession(request.headers.get("cookie"));

  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};
