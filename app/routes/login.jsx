import { json, redirect } from "@remix-run/node";
import { useActionData, useSearchParams } from "@remix-run/react";
import { getSession, commitSession } from "~/sessions";

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

const badRequest = (data) => json(data, { status: 400 });

async function validateCredentials({ accountNumber, pin }) {
  // const user = await db.user.findUnique({
  //   where: { accountNumber },
  // });
  // if (!user) return null;
  // const isCorrectPin = await bcrypt.compare(
  //   pin,
  //   user.pinHash
  // );
  // if (!isCorrectPin) return null;

  // return { accountNumber };

  return { accountNumber };
}

// async function createUserSession(accountNumber, redirectTo) {
//   const session = await getSession();
//   session.set("accountNumber", accountNumber);
//   return redirect(redirectTo, {
//     headers: {
//       "Set-Cookie": await commitSession(session),
//     },
//   });
// }

export async function action({ request }) {
  const form = await request.formData();
  const accountNumber = form.get("accountNumber");
  const pin = form.get("pin");

  // TODO: Validate this to protect against hidden field tampering.
  let redirectTo = form.get("redirectTo");
  if (redirectTo === null || redirectTo.trim() === "") {
    redirectTo = "/";
  }

  // if (
  //     typeof accountNumber !== "string" ||
  //     typeof pin !== "string" ||
  //     typeof redirectTo !== "string"
  // ) {
  //     return badRequest({
  //         formError: `Form not submitted correctly.`,
  //     });
  // }

  const fields = { accountNumber, pin };
  const fieldErrors = {
    accountNumber: validateAccountNumber(accountNumber),
    pin: validatePin(pin),
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  const user = await validateCredentials({ accountNumber, pin });
  if (!user) {
    return badRequest({
      fields,
      formError: `Account Number/PIN combination is incorrect.`,
    });
  }

  const session = await getSession();

  session.set("accountNumber", accountNumber);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg text-purple-900 outline-purple-300 `;
export default function Login() {
  const actionData = useActionData();
  const [searchParams] = useSearchParams();
  return (
    <div className="flex justify-center items-center content-center text-white">
      <div className="lg:m-10 my-10 md:w-2/3 lg:w-1/2 bg-gradient-to-br from-purple-500 via-purple-400 to-purple-300  font-bold px-5 py-6 rounded-md">
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
              defaultValue={actionData?.fields?.pin}
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
            className="my-4 py-2 px-7 text-purple-500 font-bold border-2 hover:scale-105 border-purple-500 rounded-lg bg-white"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
