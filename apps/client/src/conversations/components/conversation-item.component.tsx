import type React from 'react';
import { HiUsers } from 'react-icons/hi';
import { HiHashtag, HiUser } from 'react-icons/hi2';
import { Link } from 'react-router';

interface ConversationItemProps {
  name: string;
  type: string;
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

  let icon: React.ReactNode;
  if (type === 'dm') {
    icon = <HiUser className="text-sm" />;
  } else if (type === 'group') {
    icon = <HiUsers className="text-sm" />;
  } else {
    icon = <HiHashtag className="text-sm" />;
  }

  return (
    <Link className={`${baseClassName} ${activeClassName}`} to={to}>
      <div className="w-6 h-6 rounded-full bg-orange-700 flex items-center justify-center">
        {icon}
      </div>
      <span className="font-medium ml-2">{name}</span>
    </Link>
  );
};
