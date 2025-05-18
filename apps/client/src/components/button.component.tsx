import { type VariantProps, cva, cx } from 'class-variance-authority';
import type { ButtonHTMLAttributes } from 'react';
import { Link } from 'react-router';

const button = cva(
  'rounded-md shadow-sm font-medium transform transition duration-300 ease-in-out hover:scale-105',
  {
    variants: {
      disabled: {
        true: 'cursor-not-allowed opacity-50 hover:scale-none',
        false: 'cursor-pointer',
      },
      variant: {
        primary:
          'border border-transparent bg-orange-800 hover:bg-orange-900 text-white',
        secondary:
          'border border-orange-300 bg-white hover:bg-orange-50 text-orange-800',
        danger: 'border border-red-300 bg-red-50 hover:bg-red-100 text-red-800',
      },
      size: {
        xs: 'py-1 px-2 text-xs',
        sm: 'py-2 px-4 text-sm',
        lg: 'py-3 px-8 text-base md:py-4 md:text-lg md:px-10 ',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'sm',
    },
  },
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    Omit<VariantProps<typeof button>, 'disabled'> {
  to?: string;
  children: React.ReactNode;
}

export default function Button(props: ButtonProps) {
  const { children, to, variant, fullWidth, size, className, disabled,  ...rest } = props;

  const buttonClassNames = cx(button({ variant, fullWidth, size, disabled }), className);

  if (to) {
    return (
      <Link to={to} className={buttonClassNames}>
        {children}
      </Link>
    );
  }

  return (
    <button className={buttonClassNames} {...rest}>
      {children}
    </button>
  );
}
