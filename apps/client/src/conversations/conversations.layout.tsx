import { Navigate, Outlet, useNavigate } from 'react-router';
import { useSWRConfig } from 'swr';

import { getToken, useAppContext } from '~/shared';
import type { Route } from './+types/conversations.layout';
import { useSocketJoin } from './hooks/use-socket-join';
import { ConversationsAddModal, useAddModal } from './components/conversations-add-modal.component';
import type { IConversation } from './conversations.interface';
import { ConversationSidebar } from './components/conversation-sidebar.component';

export default function ConversationsLayout({ params }: Route.ComponentProps) {
  if (!getToken()) {
    return <Navigate to="/login" />;
  }

  const { workspaceId } = params;
  const navigate = useNavigate()

  const { mutate } = useSWRConfig()

  // Connect the user to the socket server and join the workspace conversations
  useSocketJoin(workspaceId);

  const { sidebarOpen, toggleSidebar } = useAppContext();

  const { open, type, closeModal, openModal } = useAddModal();

  return (
    <div className="h-screen flex relative">
      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-20 sm:hidden ${sidebarOpen ? 'block' : 'hidden'
          }`}
        onClick={toggleSidebar}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            toggleSidebar();
          }
        }}
        role="button"
        tabIndex={0}
      />
      {/* Sidebar */}
      <ConversationSidebar workspaceId={workspaceId} openModal={openModal} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-white min-w-0">
        <Outlet />
      </div>


      <ConversationsAddModal
        workspaceId={workspaceId}
        type={type}
        open={open}
        onClose={closeModal}
        onCreated={(conversation: IConversation) => {
          mutate(`/conversations?workspaceId=${workspaceId}`);
          navigate(`/${workspaceId}/${conversation.id}`);
        }}
      />
    </div>
  );
}
