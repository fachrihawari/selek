import React from "react";
import { HiHashtag, HiUser } from "react-icons/hi2";

interface ConversationItemProps {
  name: string;
  type: string;
  href?: string;
  isActive?: boolean;
  onClick?: () => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  name,
  type,
  href,
  isActive = false,
  onClick,
}) => {
  const baseClassName = "flex items-center px-3 py-1.5 rounded-md text-orange-100";
  const activeClassName = isActive ? "bg-orange-800/50" : "hover:bg-orange-800/30";
  
  const Element = href ? "a" : "button";
  const elementProps = href 
    ? { href } 
    : { onClick, type: "button" as const };

  return (
    <Element 
      className={`${baseClassName} ${activeClassName}`}
      {...elementProps}
    >
      {type === "dm" ? (
        <div className="w-5 h-5 rounded-full bg-orange-700 flex items-center justify-center">
          <HiUser className="text-sm" />
        </div>
      ) : (
        <HiHashtag className="text-lg" />
      )}
      <span className="font-medium ml-3">{name}</span>
    </Element>
  );
};