import { cva, type VariantProps } from 'class-variance-authority';
import type React from 'react';
import { HiUsers } from 'react-icons/hi';
import { HiHashtag, HiUser } from 'react-icons/hi2';
import type { IConversation } from '~/conversations/conversations.interface';

const conversationTypes = {
  dm: HiUser,
  group: HiUsers,
  channel: HiHashtag,
} as const


const typeIcon = cva(
  'rounded-full bg-orange-700 flex text-white items-center justify-center',
  {
    variants: {
      size: {
        sm: 'w-6 h-6',
        lg: 'w-12 h-12',
      },
      center: {
        true: 'mx-auto',
      }
    },
    defaultVariants: {
      size: 'sm',
      center: false,
    },
  },
);

const icon = cva('text-white', {
  variants: {
    size: {
      sm: 'text-sm',
      lg: 'text-3xl',
    },
  },
  defaultVariants: {
    size: 'sm',
  },
});

interface ConversationTypeIconProps extends Pick<IConversation, 'type'>, VariantProps<typeof typeIcon> { }

export const ConversationTypeIcon: React.FC<ConversationTypeIconProps> = ({
  type,
  size,
  center,
}) => {
  const Icon = conversationTypes[type];

  return (
    <div className={typeIcon({ size, center })}>
      <Icon className={icon({ size })} />
    </div>
  );
};