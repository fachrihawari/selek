import { useEffect } from 'react';
import { getToken, socket } from '~/shared';
import { useOnlineUsers } from './use-online-users';

export function useSocketJoin(workspaceId: string) {
  const updateByWorkspaceId = useOnlineUsers((state) => state.updateByWorkspaceId);

  useEffect(() => {
    socket.auth = {
      token: getToken(),
    };
    socket.connect();
  }, []);

  useEffect(() => {
    socket.emit('workspaces:join', workspaceId);
    socket.on('exception', console.error);
    socket.on('workspaces:joined', (data) => {
      updateByWorkspaceId(workspaceId, data.users);
    });
    socket.on('workspaces:left', (data) => {
      updateByWorkspaceId(workspaceId, data.users);
    });

    return () => {
      socket.off('exception');
      socket.off('workspaces:joined');
      socket.off('workspaces:left');
      socket.emit('workspaces:leave', workspaceId);
    };
  }, [workspaceId]);
}
