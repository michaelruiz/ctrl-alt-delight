import { ButtonProps } from '@/types';

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <button
      className={`px-4 py-2 rounded-md shadow-md transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}; 