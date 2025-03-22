import type { Route } from "./+types/_index";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div>
      <h1>Welcome to React Router!</h1>
      <p>
        This is a new React Router app. You can start building your app by
        creating new routes in the <code>app/routes</code> directory.
      </p>
    </div>
  )
}
