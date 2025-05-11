import { HiBuildingOffice } from 'react-icons/hi2';
import useSWR from 'swr';
import { Loading } from '~/components';
import type { Route } from './+types/conversations-welcome.page';

export default function ConversationsWelcomePage({
  params,
}: Route.ComponentProps) {
  const { data: workspace, isLoading } = useSWR(
    `/workspaces/${params.workspaceId}`,
  );

  let content = (
    <div className="text-center text-gray-500 py-8 px-4">
      <div className="w-12 h-12 rounded-full bg-orange-100 mx-auto mb-3 flex items-center justify-center">
        <HiBuildingOffice className="text-3xl text-orange-900" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">
        Welcome to {workspace?.name}
      </h3>
      <p>This is the start of the {workspace?.name} channel</p>
    </div>
  );

  if (isLoading) {
    content = <Loading />;
  }

  return (
    <div className="w-full h-screen flex justify-center items-center overflow-y-auto">
      {content}
    </div>
  );
}
