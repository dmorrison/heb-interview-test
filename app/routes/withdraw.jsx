import { json, redirect } from "@remix-run/node";
import { Link, useActionData, useLoaderData } from "@remix-run/react";
import { commitSession, getSession, requireUserSession } from "~/sessions";
import { withdraw } from "~/db";

export const loader = async ({ request }) => {
  const user = await requireUserSession(request);

  return json(user);
};

export const action = async ({ request }) => {
  const sessionUser = await requireUserSession(request);

  const form = await request.formData();
  const amount = Number(form.get("amount")); // TODO: Validate this.

  let newBalance, newDailyWithdrawalAmountRemaining;
  try {
    const results = withdraw(sessionUser.accountNumber, amount);
    newBalance = results.newBalance;
    newDailyWithdrawalAmountRemaining = results.newDailyWithdrawalAmountRemaining;
  } catch (error) {
    return json(
      {
        fields: { amount },
        formError: error.message,
      },
      {
        status: 400,
      }
    );
  }

  const session = await getSession(request.headers.get("cookie"));
  session.set("balance", newBalance);
  session.set("dailyWithdrawalAmountRemaining", newDailyWithdrawalAmountRemaining);

  session.flash(
    "globalMessage",
    `Withdrawal of \$${amount} successfully completed.`
  );

  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export default function Withdraw() {
  const user = useLoaderData();
  const actionData = useActionData();

  return (
    <div>
      <h2>Current Balance: ${user.balance}</h2>
      <h2>Daily Withdrawal Limit: ${user.dailyWithdrawalLimit}</h2>
      <h2>Amount Available to Withdraw Today: ${user.dailyWithdrawalAmountRemaining}</h2>

      <form method="post">
        <h1 className="text-center text-2xl text-white">Make a Withdrawal</h1>

        <label className="text-lg leading-7 text-white">
          Withdrawal Amount:
          <input
            type="text"
            name="amount"
            required
            defaultValue={actionData?.fields?.amount}
          />
        </label>

        <div id="form-error-message">
          {actionData?.formError ? (
            <p className="text-red-500" role="alert">
              {actionData.formError}
            </p>
          ) : null}
        </div>

        <button type="submit" className="button">
          Withdraw Money
        </button>
      </form>

      <br />
      <Link className="text-white text-3xl font-bold" to={"/"}>Back to Main Screen</Link>
    </div>
  );
}
