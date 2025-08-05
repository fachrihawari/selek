import useSWR from 'swr';

import { AlertError, Button, Loading } from '~/components';
import { type IHttpResponse, useLogout } from '~/shared';
import type { IUser } from '~/users';
import WorkspaceCard from '~/workspaces/components/workspace-card.component';
import type { IWorkspace } from '~/workspaces/workspaces.interface';

export function meta() {
  return [
    { title: 'Workspace - Selek' },
    {
      name: 'description',
      content: 'Choose a workspace to get started',
    },
  ];
}

export default function WorkspacesPage() {
  const { data: me } = useSWR<IUser>('/auth/me');
  const { data: workspaces } = useSWR<IWorkspace[]>('/workspaces');

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

        {Boolean(workspaces?.length) && <WorkspacesCreate />}

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
    '/workspaces',
  );

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <AlertError message={error.message} />;
  }

  if (!data?.length) {
    return (
      <div className="text-center py-8">
        <div className="mb-4 text-orange-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            role="img"
            aria-label="No workspaces icon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          No workspaces yet
        </h3>
        <p className="text-gray-500 mb-4">
          Create your first workspace to start collaborating
        </p>
        <Button to="/workspaces/create" className="inline-flex items-center">
          <span className="mr-2">+</span> Create workspace
        </Button>
      </div>
    );
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
  const logout = useLogout();

  return (
    <div className="mt-4 text-center text-sm text-gray-500">
      Not seeing your workspace?{' '}
      <button
        type="button"
        onClick={logout}
        className="text-orange-600 hover:text-orange-700"
      >
        Try using a different email
      </button>
    </div>
  );
}
