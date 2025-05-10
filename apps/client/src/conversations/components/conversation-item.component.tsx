import type React from 'react';
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

  return (
    <Link
      className={`${baseClassName} ${activeClassName}`}
      to={to}
    >
      {type === 'dm' ? (
        <div className="w-5 h-5 rounded-full bg-orange-700 flex items-center justify-center">
          <HiUser className="text-sm" />
        </div>
      ) : (
        <HiHashtag className="text-lg" />
      )}
      <span className="font-medium ml-3">{name}</span>
    </Link>
  );
};
