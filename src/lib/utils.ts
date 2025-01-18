import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getColorClasses = (color: 'blue' | 'yellow' | 'green' | 'red') => {
  const classes = {
    blue: 'bg-blue-100',
    yellow: 'bg-yellow-100',
    green: 'bg-green-100',
    red: 'bg-red-100'
  };
  return classes[color];
};

