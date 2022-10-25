import { json } from "@remix-run/node";
import {
  useLoaderData,
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { commitSession, getSession } from "~/sessions";
import styles from "~/styles/app.css"

export const meta = () => ({
  charset: "utf-8",
  title: "NiceBank ATM",
  viewport: "width=device-width,initial-scale=1",
});

export const links = () => ([
  { rel: "stylesheet", href: styles }
]);

export async function loader({ request }) {
  const session = await getSession(
    request.headers.get("cookie")
  );

  const globalMessage = session.get("globalMessage");
  const isLoggedIn = session.has("accountNumber");

  return json(
    { globalMessage, isLoggedIn },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}

export default function App() {
  const { globalMessage, isLoggedIn } = useLoaderData();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-green-100 relative px-5">
        <div className="mt-20 w-full max-w-screen-sm mx-auto">
          <nav className="bg-gradient-to-br from-green-400 via-green-500 to-green-500 w-full fixed top-0 left-0 px-5">
            <div className="w-full max-w-screen-lg mx-auto flex justify-between content-center py-3">
              <Link className="text-white text-3xl font-bold" to={"/"}>NiceBank ATM</Link>
              
              {isLoggedIn &&
                <div className="flex flex-col md:flex-row items-center justify-between gap-x-4">
                  <form action="/logout" method="post">
                    <button type="submit" className="button">
                      Logout
                    </button>
                  </form>
                </div>
              }
            </div>
          </nav>

          <Outlet />

          {globalMessage &&
            <div className="text-2xl font-bold">{globalMessage}</div>
          }
        </div>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
