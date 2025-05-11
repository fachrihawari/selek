import { Button } from '~/components';
import type { IWorkspace } from '~/workspaces';

interface WorkspaceCardProps {
  workspace: IWorkspace;
}

export default function WorkspaceCard(props: WorkspaceCardProps) {
  const { workspace } = props;
  return (
    <div
      key={workspace.id}
      className="flex items-center justify-between border-orange-100 last:border-b-0 last:pb-0 last:mb-0 border-b pb-4 mb-4"
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
      <Button to={`/${workspace.id}`}>Launch Selek</Button>
    </div>
  );
}
