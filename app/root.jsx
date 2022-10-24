import { json } from "@remix-run/node";
import {
  useLoaderData,
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
  const message = session.get("globalMessage") || null;

  return json(
    { message },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}

export default function App() {
  const { message } = useLoaderData();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-green-100 relative px-5">
        <div className="mt-20 w-full max-w-screen-lg mx-auto">
          <Outlet />
        </div>

        {message ? (
          <div className="flash">{message}</div>
        ) : null}

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
