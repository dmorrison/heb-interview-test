import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { requireUserSession } from "~/sessions";
import AccountInfo from "~/components/accountInfo";

export const loader = async ({ request }) => {
  const user = await requireUserSession(request);

  return json(user);
};

export default function Index() {
  const user = useLoaderData();

  return (
    <>
      <AccountInfo user={user} />
      
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
