import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import Button from '~/components/button.component';
import type { IUser } from '~/users/users.interface';
import { conversationTypes } from '../conversations.constant';
import { http, type IHttpResponse } from '~/shared';
import toast from 'react-hot-toast';
import Select from 'react-select';
import type { IConversation } from '../conversations.interface';

interface ConversationsAddModalProps {
  workspaceId: string;
  type: 'dm' | 'group' | 'channel';
  open: boolean;
  onClose: () => void;
  onCreated?: (conversation: IConversation) => void;
}

export function useAddModal() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<'dm' | 'group' | 'channel'>('dm');

  const openModal = (conversationType: 'dm' | 'group' | 'channel') => {
    setType(conversationType);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  return { open, type, openModal, closeModal };

}

export const ConversationsAddModal: React.FC<ConversationsAddModalProps> = ({
  workspaceId,
  type,
  open,
  onClose,
  onCreated,
}) => {
  const [name, setName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const { data: user } = useSWR<IUser>('/auth/me');
  const { data: users, isLoading } = useSWR<IUser[]>(`/workspaces/${workspaceId}/members`);

  useEffect(() => {
    setName('');
    setSelectedUsers([])
  },[open])

  // Prepare options for react-select
  const userOptions = (users || []).filter(u => u.id !== user?.id).map((user) => ({
    value: user.id,
    label: (
      <div className="flex flex-col">
        <span>{user.fullName}</span>
        <span className="text-xs text-gray-400">{user.email}</span>
      </div>
    ),
    labelString: user.fullName + ' (' + user.email + ')' // for filtering
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const conversation = await http<IConversation>('/conversations', {
        body: {
          type,
          name: type === 'channel' ? name : type,
          members: selectedUsers,
          workspaceId,
        }
      })
      onCreated?.(conversation);
      onClose();
    } catch (error) {
      toast.error((error as IHttpResponse).message);
    }

  };

  // Validation logic
  const isValid =
    (type === 'dm' && selectedUsers.length === 1) ||
    ((type === 'group' || type === 'channel') && selectedUsers.length >= 2 && (type !== 'channel' || !!name));

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-opacity duration-300" style={{ opacity: open ? 1 : 0 }}>
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 transform transition-all duration-300"
        style={{
          opacity: open ? 1 : 0,
          translate: open ? 'none' : '0 2rem',
          scale: open ? 1 : 0.95,
        }}
      >
        <h2 className="text-xl font-bold mb-4">Create a new {conversationTypes[type]}</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {type === 'channel' && (
            <div className="flex flex-col gap-1">
              <label htmlFor="conversation-name" className="text-sm font-medium text-gray-700">Channel name</label>
              <input
                id="conversation-name"
                type="text"
                placeholder="Channel name"
                className="border p-2 rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div className="flex flex-col gap-1">
            <label htmlFor="conversation-users" className="text-sm font-medium text-gray-700">
              {type === 'dm' ? 'Select user' : 'Select users'}
            </label>
            <div className="border rounded bg-orange-50">
              <Select
                inputId="conversation-users"
                isMulti={type !== 'dm'}
                isClearable={false}
                options={userOptions}
                value={userOptions.filter(opt => selectedUsers.includes(opt.value))}
                onChange={option => {
                  if (type === 'dm') {
                    setSelectedUsers(option && !Array.isArray(option) ? [(option as any).value] : []);
                  } else {
                    setSelectedUsers(Array.isArray(option) ? option.map((o: any) => o.value) : []);
                  }
                }}
                isLoading={isLoading}
                placeholder={type === 'dm' ? 'Select a user' : 'Select users'}
                classNamePrefix="react-select"
                getOptionLabel={opt => typeof opt.label === 'string' ? opt.label : opt.labelString}
                getOptionValue={opt => opt.value}
                styles={{
                  control: (base) => ({ ...base, backgroundColor: 'transparent', border: 'none', boxShadow: 'none' }),
                  menu: (base) => ({ ...base, zIndex: 9999 }),
                }}
                theme={theme => ({
                  ...theme,
                  borderRadius: 8,
                  colors: {
                    ...theme.colors,
                    primary25: '#fed7aa',
                    primary: '#ea580c',
                  },
                })}
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end mt-4">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button
              type="submit"
              disabled={!isValid}
            >
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
