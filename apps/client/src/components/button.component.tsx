import { twMerge } from "tailwind-merge";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
}

export default function Button(props: ButtonProps) {
  const { children, className, ...rest } = props;

  const buttonClassNames = twMerge(
    "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-800 hover:bg-orange-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-800 transform transition duration-300 ease-in-out hover:scale-105",
    className
  );

  return (
    <button className={buttonClassNames} {...rest}>
      {children}
    </button>
  );
}
