import { json, redirect } from "@remix-run/node";
import { Link, useActionData, useLoaderData } from "@remix-run/react";
import { commitSession, getSession, requireUserSession } from "~/sessions";
import { deposit } from "~/db";

export const loader = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const depositMessage = session.get("depositMessage");

  return json(
    { depositMessage },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
};

export const action = async ({ request }) => {
  const sessionUser = await requireUserSession(request);

  const form = await request.formData();
  const amount = Number(form.get("amount")); // TODO: Validate this.
  const { newBalance } = deposit(sessionUser.accountNumber, amount);

  const session = await getSession(request.headers.get("Cookie"));
  session.set("balance", newBalance);

  session.flash("depositMessage", `Successfully deposited \$${amount}.`);

  return redirect("/deposit", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export default function Deposit() {
  const { depositMessage } = useLoaderData();
  const actionData = useActionData();

  return (
    <div>
      <form method="post">
        <h1 className="text-2xl text-black mt-5 mb-2">Make a Deposit</h1>

        <label className="text-lg text-black">
          Deposit Amount:
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
          Deposit
        </button>
      </form>

      {depositMessage && (
        <div className="text-2xl font-bold mb-8">{depositMessage}</div>
      )}

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
