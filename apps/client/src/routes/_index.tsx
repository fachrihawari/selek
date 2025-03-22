import { Link } from "react-router";
import type { Route } from "./+types/_index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Selek - Team Communication Made Simple" },
    {
      name: "description",
      content:
        "Connect, collaborate, and communicate with your team in real-time using Selek - the modern platform for team chat and collaboration.",
    },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-orange-100 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 items-center">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-gray-900 animate-fade-in">
            <span className="bg-gradient-to-r from-orange-800 to-orange-600 bg-clip-text text-transparent">
              Selek
            </span>
            <span className="block mt-2 text-4xl md:text-6xl">
              Where Teams Thrive Together
            </span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Selek brings all your team communication into one place, making it
            searchable and accessible anywhere.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                to="/register"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-800 hover:bg-orange-900 md:py-4 md:text-lg md:px-10 transform transition duration-300 ease-in-out hover:scale-105"
              >
                Get Started for Free
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Link
                to="/login"
                className="w-full flex items-center justify-center px-8 py-3 border border-orange-300 text-base font-medium rounded-md text-orange-800 bg-white hover:bg-orange-50 md:py-4 md:text-lg md:px-10 transform transition duration-300 ease-in-out hover:scale-105"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}