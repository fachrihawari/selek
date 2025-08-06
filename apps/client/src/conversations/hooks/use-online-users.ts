import { create } from 'zustand'
import type { IUser } from '~/users'

type State = {
  byWorkspaceId: Record<string, IUser[]>
}
type Action = {
  updateByWorkspaceId: (workspaceId: string, users: IUser[]) => void
}

export const useOnlineUsers = create<State & Action>((set) => ({
  byWorkspaceId: {},
  updateByWorkspaceId: (workspaceId, users) => {
    set(state => {
      return {
        byWorkspaceId: {
          ...state.byWorkspaceId,
          [workspaceId]: users
        }
      }
    })
  },
}))
