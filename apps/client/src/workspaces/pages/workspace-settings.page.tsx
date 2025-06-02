import { Form, useNavigate, useParams, useNavigation, redirect } from "react-router";
import { toast } from "react-hot-toast";
import { mutate } from "swr";
import useSWR from "swr";
import { HiArrowLeft } from "react-icons/hi2";

import { http, type IHttpResponse } from "~/shared";
import { Button, Loading, AlertError } from "~/components";
import type { IWorkspace } from "~/workspaces";

export function meta() {
  return [
    { title: "Workspace Settings - Selek" },
    {
      name: "description",
      content: "Manage your workspace settings",
    },
  ];
}



export async function clientAction({ request, params }: { request: Request; params: any }) {
  try {
    const formData = await request.formData();
    const body = Object.fromEntries(formData);
    const updatedWorkspace = await http<IWorkspace>(`/workspaces/${params.workspaceId}`, {
      method: "PATCH",
      body,
    });

    // Update the cache
    mutate<IWorkspace[]>(
      "/workspaces",
      (currentData) =>
        currentData?.map(workspace =>
          workspace.id === params.workspaceId
            ? { ...workspace, ...updatedWorkspace }
            : workspace
        ),
      { revalidate: false }
    );

    // Update individual workspace cache
    mutate(`/workspaces/${params.workspaceId}`, updatedWorkspace, { revalidate: false });

    toast.success("Workspace settings updated successfully");

    return redirect('/' + params.workspaceId);
  } catch (error) {
    toast.error((error as IHttpResponse).message);
  }
}

export default function WorkspaceSettingsPage() {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const navigation = useNavigation();

  // Check if we're currently submitting this form
  const isSubmitting = navigation.state === "submitting";

  const { data: workspace, error, isLoading } = useSWR<IWorkspace>(
    workspaceId ? `/workspaces/${workspaceId}` : null
  );

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <AlertError message={error.message} />;
  }

  if (!workspace) {
    return <AlertError message="Workspace not found" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Workspace Settings</h1>
          <p className="mt-2 text-gray-600">
            Manage your workspace information and preferences
          </p>
        </div>

        {/* Settings Form */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Basic Information
            </h2>
            <p className="text-sm text-gray-500">
              Update your workspace name and logo
            </p>
          </div>

          <Form method="patch" className="px-6 py-6 space-y-6">
            {/* Workspace Logo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Workspace Logo
              </label>
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  {workspace.logoUrl ? (
                    <img
                      src={workspace.logoUrl}
                      alt={workspace.name}
                      className="h-16 w-16 rounded-lg object-cover border border-gray-300"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-lg bg-orange-100 flex items-center justify-center border border-gray-300">
                      <span className="text-2xl font-semibold text-orange-800">
                        {workspace.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="url"
                    name="logoUrl"
                    defaultValue={workspace.logoUrl}
                    placeholder="https://example.com/logo.png"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Enter a URL for your workspace logo
                  </p>
                </div>
              </div>
            </div>

            {/* Workspace Name */}
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
                defaultValue={workspace.name}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                This is the name that will be displayed to all workspace members
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(`/${workspaceId}`)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-orange-600 hover:bg-orange-700 focus:ring-orange-500"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
