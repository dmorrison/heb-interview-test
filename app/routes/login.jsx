import { json, redirect } from "@remix-run/node";
import { useActionData, useSearchParams } from "@remix-run/react";
import { getSession, commitSession } from "~/sessions";
import { getUserByAccountNumber } from "~/db";

const badRequest = (data) => json(data, { status: 400 });

// TODO: Improve field validation.
function validateAccountNumber(accountNumber) {
  if (typeof accountNumber !== "string" || accountNumber.length === 0) {
    return `Account Number is required.`;
  }
}

// TODO: Improve field validation.
function validatePin(pin) {
  if (typeof pin !== "string" || pin.length === 0) {
    return `PIN is required.`;
  }
}

function validateCredentials({ accountNumber, pin }) {
  const user = getUserByAccountNumber(accountNumber);
  if (!user) return null;

  // TODO: Improve security of this to hash the password and compare using that.
  if (user.pin !== pin) return null;

  return user;
}

export async function loader({ request }) {
  const session = await getSession(
    request.headers.get("cookie")
  );

  if (session.has("accountNumber")) {
    // Redirect to the home page if they are already signed in.
    return redirect("/");
  }

  return json({});
}

export async function action({ request }) {
  const form = await request.formData();
  const accountNumber = form.get("accountNumber");
  const pin = form.get("pin");

  // TODO: Validate this to protect against hidden field tampering.
  let redirectTo = form.get("redirectTo");
  if (redirectTo === null || redirectTo.trim() === "") {
    redirectTo = "/";
  }

  const fields = { accountNumber };
  const fieldErrors = {
    accountNumber: validateAccountNumber(accountNumber),
    pin: validatePin(pin),
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fields, fieldErrors });
  }

  const user = validateCredentials({ accountNumber, pin });
  if (!user) {
    return badRequest({
      fields,
      formError: `Account Number/PIN combination is incorrect.`,
    });
  }

  // TODO: I'm caching balance and withdrawal info in the session. This could
  // cause problems since the session cookie and the db need to be kept in sync.
  // I'd need to think this through.
  
  // TODO: Even though the session is encrypted, I'm not sure you'd want to
  // store potentially sensitive user info like this (and instead you might
  // want to look it up again from the db or cache more securely).
  
  const session = await getSession();
  session.set("accountNumber", user.accountNumber);
  session.set("balance", user.balance);
  session.set("dailyWithdrawalLimit", user.dailyWithdrawalLimit);
  session.set("dailyWithdrawalAmountRemaining", user.dailyWithdrawalAmountRemaining);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg text-green-900 outline-green-300 `;
export default function Login() {
  const actionData = useActionData();
  const [searchParams] = useSearchParams();
  return (
    <div className="flex justify-center items-center content-center text-white">
      <div className="lg:m-10 my-10 md:w-2/3 lg:w-1/2 bg-gradient-to-br from-green-500 via-green-400 to-green-300 font-bold px-5 py-6 rounded-md">
        <form method="post">
          <h1 className="text-center text-2xl text-white">Login</h1>
          <input
            type="hidden"
            name="redirectTo"
            value={searchParams.get("redirectTo") ?? undefined}
          />
          <label className="text-lg leading-7 text-white">
            Account Number:
            <input
              type="text"
              className={inputClassName}
              name="accountNumber"
              required
              minLength={4}
              defaultValue={actionData?.fields?.accountNumber}
            />
            {actionData?.fieldErrors?.accountNumber ? (
              <p
                className="text-red-500"
                role="alert"
                id="account-number-error"
              >
                {actionData.fieldErrors.accountNumber}
              </p>
            ) : null}
          </label>
          <label className="text-lg leading-7 text-white">
            PIN
            <input
              name="pin"
              className={inputClassName}
              required
              type="password"
            />
            {actionData?.fieldErrors?.pin ? (
              <p className="text-red-500" role="alert" id="pin-error">
                {actionData.fieldErrors.pin}
              </p>
            ) : null}
          </label>
          <div id="form-error-message">
            {actionData?.formError ? (
              <p className="text-red-500" role="alert">
                {actionData.formError}
              </p>
            ) : null}
          </div>
          <button
            className="my-4 py-2 px-7 text-green-500 font-bold border-2 hover:scale-105 border-green-500 rounded-lg bg-white"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
