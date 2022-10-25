import { json, redirect } from "@remix-run/node";
import { Link, useActionData, useLoaderData } from "@remix-run/react";
import { commitSession, getSession, requireUserSession } from "~/sessions";
import { withdraw } from "~/db";
import AccountInfo from "~/components/accountInfo";

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
    `Successfully withdraw \$${amount}. Please take your money.`
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
      <AccountInfo user={user} />

      <form method="post">
        <h1 className="text-2xl text-black mt-5 mb-2">Make a Withdrawal</h1>

        <label className="text-lg text-black">
          Withdrawal Amount:
          <input
            type="text"
            name="amount"
            required
            defaultValue={actionData?.fields?.amount}
            className="ml-3 rounded border border-gray-500 px-2 py-1 text-lg text-green-900 outline-green-300"
          />
        </label>

        <button
          type="submit"
          className="ml-3 my-4 py-2 px-7 text-green-500 font-bold border-2 hover:scale-105 border-green-500 rounded-lg bg-white"
        >
          Withdraw Money
        </button>

        {actionData?.formError ? (
          <div id="form-error-message" className="mb-5">
              <p className="text-red-500" role="alert">
                {actionData.formError}
              </p>
          </div>
          ) : null}
      </form>

      <div className="mt-4">
        <Link
          to={"/"}
          className="my-4 py-2 px-7 text-green-500 font-bold border-2 hover:scale-105 border-green-500 rounded-lg bg-white"
        >
          Back to Main Screen
        </Link>
      </div>
    </div>
  );
}
