import { Link, useNavigate } from "react-router";
import useSWR from "swr";
import { Button } from "~/components";

import type { IUser } from "~/users";
import type { IWorkspace } from "~/workspaces/types/workspaces.interface";

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
  const { data: me, isValidating } = useSWR<IUser>("/auth/me");
  const { data: workspaces } = useSWR<IWorkspace[]>("/workspaces");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-orange-100 to-white">
      <div className="max-w-xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tighter text-gray-900">
            <span className="bg-gradient-to-r from-orange-800 to-orange-600 bg-clip-text text-transparent">
              Welcome Back
            </span>
          </h1>
          <p className="mt-2 text-gray-500">Choose a workspace to continue</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm shadow-sm rounded-lg px-8 py-6 border border-orange-200">
          <h2 className="text-gray-700 mb-4 font-medium">
            Workspaces for {isValidating ? "..." : me && me.email}
          </h2>

          {workspaces?.map((workspace, idx) => (
            <div
              key={workspace.id}
              className={`flex items-center justify-between border-orange-100 ${
                idx === workspaces?.length - 1
                  ? "border-b-0 pb-0 mb-0"
                  : "border-b pb-4 mb-4"
              }`}
            >
              <div className="flex items-center">
                <div className="bg-orange-100 h-14 w-14 rounded flex items-center justify-center text-2xl mr-4">
                  {workspace.logoUrl ? (
                    <img
                      src={workspace.logoUrl}
                      alt={workspace.name}
                      className="h-14 w-14"
                    />
                  ) : (
                    workspace.name[0]
                  )}
                </div>
                <div>
                  <h3 className="font-bold">{workspace.name}</h3>
                  <div className="text-sm text-gray-500 flex items-center">
                    <span>{workspace.memberCount} members</span>
                  </div>
                </div>
              </div>
              <Button to={`/workspaces/${workspace.id}`}>Launch Selek</Button>
            </div>
          ))}
        </div>

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

        <div className="mt-4 text-center text-sm text-gray-500">
          Not seeing your workspace?{" "}
          <button
            onClick={() => {
              console.log("TODO: Implement");
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
      </div>
    </div>
  );
}
