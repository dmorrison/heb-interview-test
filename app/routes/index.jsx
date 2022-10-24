import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { requireUserSession } from "~/sessions";

export const loader = async ({ request }) => {
  const user = await requireUserSession(request);

  return json(user);
};

export default function Index() {
  const user = useLoaderData();

  return (
    <>
      <nav className="bg-gradient-to-br from-green-400 via-green-500 to-green-500 w-full fixed top-0 left-0 px-5">
        <div className="w-full max-w-screen-lg mx-auto flex justify-between content-center py-3">
          <Link className="text-white text-3xl font-bold" to={"/"}>NiceBank ATM</Link>
          <div className="flex flex-col md:flex-row items-center justify-between gap-x-4 text-blue-50">
            <form action="/logout" method="post">
              <button type="submit" className="button">
                Logout
              </button>
            </form>
          </div>
        </div>
      </nav>
      <div className="grid grid-cols-2">
        <div>Account Number: {user.accountNumber}</div>
        <div>Daily Withdrawal Limit: ${user.dailyWithdrawalLimit}</div>
        <div>Current Balance: ${user.balance}</div>
        <div>Amount Available to Withdraw Today: ${user.dailyWithdrawalAmountRemaining}</div>
      </div>
      <div className="grid grid-cols-2">
        <div className="my-4 py-2 px-7">
          <Link
            className="my-4 py-2 px-7 text-green-500 font-bold border-2 hover:scale-105 border-green-500 rounded-lg bg-white"
            to={"/deposit"}
          >
            Deposit Money
          </Link>
        </div>
        <div className="my-4 py-2 px-7">
          <Link
            className="my-4 py-2 px-7 text-green-500 font-bold border-2 hover:scale-105 border-green-500 rounded-lg bg-white"
            to={"/withdraw"}
          >
            Withdraw Money
          </Link>
        </div>
      </div>
    </>
  );
}
