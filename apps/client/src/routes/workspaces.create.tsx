import toast from "react-hot-toast";
import { Form, Link, redirect, useNavigation } from "react-router";
import { http, type IHttpResponse } from "~/helpers/http";

export async function clientAction({ request }: { request: Request }) {
  // NOTE: remove later
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  try {
    const formData = await request.formData();
    const body = Object.fromEntries(formData);
    await http("/workspaces", { body });
    toast.success("Create workspace successfully");
    return redirect("/workspaces");
  } catch (error) {
    toast.error((error as IHttpResponse).message);
  }
}

export default function CreateWorkspacePage() {
  const navigation = useNavigation();

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-orange-100 to-white">
      <div className="max-w-md w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tighter text-gray-900">
            <span className="bg-gradient-to-r from-orange-800 to-orange-600 bg-clip-text text-transparent">
              Create Workspace
            </span>
          </h1>
          <p className="mt-2 text-gray-500">
            Set up a new workspace for your team
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm shadow-sm rounded-lg px-8 py-6 border border-orange-200">
          <Form className="space-y-6" method="post">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Workspace Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                placeholder="Enter workspace name"
                className="mt-1 block w-full px-3 py-2 border border-orange-200 rounded-md shadow-sm focus:ring-orange-800 focus:border-orange-800 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="logoUrl"
                className="block text-sm font-medium text-gray-700"
              >
                Logo URL (Optional)
              </label>
              <input
                type="url"
                name="logoUrl"
                id="logoUrl"
                placeholder="https://example.com/logo.png"
                className="mt-1 block w-full px-3 py-2 border border-orange-200 rounded-md shadow-sm focus:ring-orange-800 focus:border-orange-800 sm:text-sm"
              />
            </div>

            <div className="flex gap-3">
              <Link
                to="/workspaces"
                className="flex-1 text-center py-2 px-4 border border-orange-200 rounded-md shadow-sm text-sm font-medium text-orange-800 bg-white hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-800"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-800 hover:bg-orange-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-800"
              >
                {navigation.state === "submitting" ? "Creating..." : "Create"}
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
