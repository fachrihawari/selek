import { useNavigate } from "react-router";
import useSWR from "swr";

import type { IWorkspace } from "~/workspaces/workspaces.interface";
import WorkspaceCard from "~/workspaces/workspace-card.component";
import { AlertError, Button, Loading } from "~/components";
import type { IUser } from "~/users";
import type { IHttpResponse } from "~/shared";

export function meta() {
  return [
    { title: "Workspace - Selek" },
    {
      name: "description",
      content: "Choose a workspace to get started",
    },
  ];
}

export default function WorkspacesPage() {
  const { data: me } = useSWR<IUser>("/auth/me");

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-orange-100 to-white">
      <div className="max-w-xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <WorkspacesHeader />

        <div className="bg-white/80 backdrop-blur-sm shadow-sm rounded-lg px-8 py-6 border border-orange-200">
          {me && (
            <h2 className="text-gray-700 mb-4 font-medium">
              Workspaces for {me.email}
            </h2>
          )}

          <WorkspacesList />
        </div>

        <WorkspacesCreate />

        <WorkspacesHelp />
      </div>
    </div>
  );
}

function WorkspacesHeader() {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold tracking-tighter text-gray-900">
        <span className="bg-gradient-to-r from-orange-800 to-orange-600 bg-clip-text text-transparent">
          Welcome Back
        </span>
      </h1>
      <p className="mt-2 text-gray-500">Choose a workspace to continue</p>
    </div>
  );
}

function WorkspacesList() {
  const { isLoading, error, data } = useSWR<IWorkspace[], IHttpResponse>(
    "/workspaces"
  );

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <AlertError message={error.message} />;
  }

  return (data ?? []).map((workspace) => (
    <WorkspaceCard key={workspace.id} workspace={workspace} />
  ));
}

function WorkspacesCreate() {
  return (
    <div className="mt-8 bg-white/80 backdrop-blur-sm shadow-sm rounded-lg px-8 py-6 border border-orange-200">
      <div className="flex items-center">
        <div className="mr-4 hidden sm:block">
          <div className="bg-orange-100 h-16 w-16 rounded flex items-center justify-center text-2xl">
            👥
          </div>
        </div>
        <div>
          <h3 className="font-medium text-gray-900 mb-2">
            Want to use Selek with a different team?
          </h3>
          <Button to="/workspaces/create">Create a new workspace</Button>
        </div>
      </div>
    </div>
  );
}

function WorkspacesHelp() {
  const navigate = useNavigate();

  return (
    <div className="mt-4 text-center text-sm text-gray-500">
      Not seeing your workspace?{" "}
      <button
        onClick={() => {
          localStorage.clear();
          navigate("/login", {
            replace: true,
          });
        }}
        className="text-orange-600 hover:text-orange-700"
      >
        Try using a different email
      </button>
    </div>
  );
}
