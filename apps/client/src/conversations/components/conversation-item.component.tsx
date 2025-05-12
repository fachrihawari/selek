import type React from 'react';
import { Link } from 'react-router';
import type { IConversation } from '~/conversations/conversations.interface';
import { ConversationTypeIcon } from './conversation-type-icon.component';

interface ConversationItemProps extends Pick<IConversation, 'name' | 'type'> {
  to: string;
  isActive?: boolean;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  name,
  type,
  to,
  isActive = false,
}) => {
  const baseClassName =
    'flex items-center px-3 py-1.5 rounded-md text-orange-100 w-full';
  const activeClassName = isActive
    ? 'bg-orange-800/50'
    : 'hover:bg-orange-800/30';

  return (
    <Link className={`${baseClassName} ${activeClassName}`} to={to}>
      <ConversationTypeIcon type={type} />
      <span className="font-medium ml-2">{name}</span>
    </Link>
  );
};
