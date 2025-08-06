export const socketEvents = {
  MESSAGES_NEW: 'messages:new',
  CONVERSATIONS_JOIN: 'conversations:join',
  WORKSPACES_JOIN: 'workspaces:join',
  CONVERSATIONS_LEAVE: 'conversations:leave',
  WORKSPACES_LEAVE: 'workspaces:leave',
  WORKSPACES_JOINED: 'workspaces:joined',
};

export const emitterEvents = {
  MESSAGES_CREATED: 'messages:created',
};

export const socketRooms = {
  getWorkspace: (workspaceId: string) => `workspaces:${workspaceId}`,
  getConversation: (conversationId: string) =>
    `conversations:${conversationId}`,
};
