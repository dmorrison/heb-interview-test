import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <>
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
