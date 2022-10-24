import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { requireUserSession } from "~/sessions";
import { getUserByAccountNumber } from "~/db";

export const loader = async ({ request }) => {
  const user = await requireUserSession(request);

  const dbUser = getUserByAccountNumber(user.accountNumber);
  user.dbBalance = dbUser.balance;

  return json(user);
};

export default function Index() {
  const user = useLoaderData();

  return (
    <div>
      <h1>Welcome to our ATM!</h1>
      <h2>Account Number: {user.accountNumber}</h2>
      <h2>Current Balance (session): ${user.balance}</h2>
      <h2>Current Balance (db): ${user.dbBalance}</h2>
      <h2>Daily Withdrawal Limit: ${user.dailyWithdrawalLimit}</h2>
      <h2>Withdrawals Made Today: ${user.dailyWithdrawalsMade}</h2>

      <form action="/logout" method="post">
        <button type="submit" className="button">
          Logout
        </button>
      </form>

      <br />
      <Link className="text-white text-3xl font-bold" to={"/deposit"}>Make a Deposit</Link>
    </div>
  );
}
