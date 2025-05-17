import { useEffect } from 'react';
import { getToken, socket } from '~/shared';

export function useSocketJoin(workspaceId: string) {
  useEffect(() => {
    socket.auth = {
      token: getToken(),
    };
    socket.connect();
  }, []);

  useEffect(() => {
    socket.emit('workspaces:join', workspaceId);
    socket.on('exception', console.error);

    return () => {
      socket.off('exception');
      socket.emit('workspaces:leave', workspaceId);
    };
  }, [workspaceId]);
}
