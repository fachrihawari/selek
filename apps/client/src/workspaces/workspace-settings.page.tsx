import { useParams } from "react-router";
import useSWR from "swr";

import { Loading, AlertError } from "~/components";
import { SettingsBasicInfo } from "./components/settings-basic-info.component";
import { SettingsMemberSection } from "./components/settings-member-section.component";
import type { IWorkspace } from "./workspaces.interface";
import { ConversationHeader } from "~/conversations/components/conversation-header.component";

export function meta() {
  return [
    { title: "Workspace Settings - Selek" },
    {
      name: "description",
      content: "Manage your workspace settings",
    },
  ];
}

export default function WorkspaceSettingsPage() {
  const { workspaceId } = useParams();

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
    <div className="min-h-screen overflow-auto bg-gray-50">
      <ConversationHeader title="" isLoading={false} />

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Workspace Settings</h1>
          <p className="mt-2 text-gray-600">
            Manage your workspace information and preferences
          </p>
        </div>

        {/* Settings Form */}
        <SettingsBasicInfo workspaceId={workspaceId!} />

        {/* Invite Member Section */}
        <SettingsMemberSection workspaceId={workspaceId!} />
      </div>
    </div>
  );
}
