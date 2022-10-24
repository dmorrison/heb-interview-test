import { json, redirect } from "@remix-run/node";
import { Link, useActionData, useLoaderData } from "@remix-run/react";
import { commitSession, getSession, requireUserSession } from "~/sessions";
import { deposit } from "~/db";

export const loader = async ({ request }) => {
  const user = await requireUserSession(request);

  return json(user);
};

export const action = async ({ request }) => {
  const sessionUser = await requireUserSession(request);

  const form = await request.formData();
  const newBalance = deposit(sessionUser.accountNumber, Number(form.get("amount")));

  const session = await getSession(request.headers.get("cookie"));
  session.set("balance", newBalance);

  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export default function Deposit() {
  const user = useLoaderData();
  const actionData = useActionData();

  return (
    <div>
      <h2>Current Balance: ${user.balance}</h2>
      <h2>Daily Withdrawal Limit: ${user.dailyWithdrawalLimit}</h2>
      <h2>Withdrawals Made Today: ${user.dailyWithdrawalsMade}</h2>

      <form method="post">
        <h1 className="text-center text-2xl text-white">Make a Deposit</h1>
        <h3>Please insert cash.</h3>

        <label className="text-lg leading-7 text-white">
            Deposit Amount:
            <input
              type="text"
              name="amount"
              required
              defaultValue={actionData?.fields?.amount}
            />
          </label>

        <button type="submit" className="button">
          Deposit Money
        </button>
      </form>

      <br />
      <Link className="text-white text-3xl font-bold" to={"/"}>Back to Main Screen</Link>
    </div>
  );
}
