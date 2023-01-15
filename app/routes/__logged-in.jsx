import { json } from "@remix-run/node";
import { useLoaderData, Outlet } from "@remix-run/react";
import { requireUserSession } from "~/sessions";

export const loader = async ({ request }) => {
  const user = await requireUserSession(request);

  return json(user);
};

export default function Component() {
  const user = useLoaderData();

  return (
    <>
      <div className="grid grid-cols-2">
        <div>Account Number: {user.accountNumber}</div>
        <div>Daily Withdrawal Limit: ${user.dailyWithdrawalLimit}</div>
        <div>Current Balance: ${user.balance}</div>
        <div>
          Amount Available to Withdraw Today: $
          {user.dailyWithdrawalAmountRemaining}
        </div>
      </div>

      <Outlet />
    </>
  );
}
