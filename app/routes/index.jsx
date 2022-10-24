import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { requireUserSession } from "~/sessions";

export const loader = async ({ request }) => {
  const user = await requireUserSession(request);

  return json(user);
};

export default function Index() {
  const user = useLoaderData();

  return (
    <div>
      <h1>Welcome to our ATM!</h1>
      <h2>Account Number: {user.accountNumber}</h2>
      <h2>Current Balance: ${user.balance}</h2>
      <h2>Daily Withdrawal Limit: ${user.dailyWithdrawalLimit}</h2>
      <h2>Withdrawals Made Today: ${user.dailyWithdrawalsMade}</h2>

      <form action="/logout" method="post">
        <button type="submit" className="button">
          Logout
        </button>
      </form>
    </div>
  );
}
