import toast from "react-hot-toast";
import { Link, redirect, Form, useNavigation } from "react-router";

import type { Route } from "./+types/auth-register.page";
import { Button } from "~/components";
import { http, type IHttpResponse } from "~/shared";

export function meta() {
  return [
    { title: "Register - Selek" },
    {
      name: "description",
      content: "Join Selek and start collaborating with your team today.",
    },
  ];
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  try {
    const formData = await request.formData();
    const body = Object.fromEntries(formData);
    const response = await http("/auth/register", { body });

    toast.success(response.message);
    return redirect("/login");
  } catch (error) {
    toast.error((error as IHttpResponse).message);
  }
}

export default function RegisterPage() {
  const navigation = useNavigation();

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-orange-100 to-white">
      <div className="max-w-md w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tighter text-gray-900">
            <span className="bg-gradient-to-r from-orange-800 to-orange-600 bg-clip-text text-transparent">
              Join Selek
            </span>
          </h1>
          <p className="mt-2 text-gray-500">
            Create your account and start collaborating
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm shadow-sm rounded-lg px-8 py-6 border border-orange-200">
          <Form className="space-y-6" method="post">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                id="fullName"
                required
                className="mt-1 block w-full px-3 py-2 border border-orange-200 rounded-md shadow-sm focus:ring-orange-800 focus:border-orange-800 sm:text-sm"
                defaultValue={"Fachri"}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-orange-200 rounded-md shadow-sm focus:ring-orange-800 focus:border-orange-800 sm:text-sm"
                defaultValue={"fachri@mail.com"}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-orange-200 rounded-md shadow-sm focus:ring-orange-800 focus:border-orange-800 sm:text-sm"
                defaultValue={"qweqwe"}
              />
            </div>

            <div>
              <Button fullWidth type="submit">
                {navigation.state === "submitting"
                  ? "Registering..."
                  : "Register"}
              </Button>
            </div>
          </Form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-500">Already have an account?</span>{" "}
            <Link
              to="/login"
              className="text-orange-800 hover:text-orange-900 font-medium"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
