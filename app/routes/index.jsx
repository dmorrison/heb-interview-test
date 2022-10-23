import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { requireUserSession } from "~/utils/session.server";

export const loader = async ({ request }) => {
  const { userId } = await requireUserSession(request);

  return json({
    userId,
  });
};

export default function Index() {
  const data = useLoaderData();

  return (
    <div>
      <h1>Welcome to Remix</h1>
      <h2>User Id: {data.userId}</h2>

      <form action="/logout" method="post">
        <button type="submit" className="button">
          Logout
        </button>
      </form>
    </div>
  );
}
