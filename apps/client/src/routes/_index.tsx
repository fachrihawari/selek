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

const features = [
  {
    title: "Real-time Chat",
    description:
      "Instant messaging with your team members, organized by channels or direct messages.",
    icon: (
      <svg
        className="w-6 h-6 text-orange-800"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
  },
  {
    title: "File Sharing",
    description:
      "Share and collaborate on files directly within your conversations.",
    icon: (
      <svg
        className="w-6 h-6 text-orange-800"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
      </svg>
    ),
  },
  {
    title: "Search Everything",
    description:
      "Find any message, file, or conversation with powerful search capabilities.",
    icon: (
      <svg
        className="w-6 h-6 text-orange-800"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    ),
  },
];
