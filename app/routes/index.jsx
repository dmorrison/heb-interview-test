import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { requireUserSession } from "~/sessions";

export const loader = async ({ request }) => {
  const { accountNumber } = await requireUserSession(request);

  return json({
    accountNumber,
  });
};

export default function Index() {
  const data = useLoaderData();

  return (
    <div>
      <h1>Welcome to our ATM!</h1>
      <h2>Account Number: {data.accountNumber}</h2>

      <form action="/logout" method="post">
        <button type="submit" className="button">
          Logout
        </button>
      </form>
    </div>
  );
}
