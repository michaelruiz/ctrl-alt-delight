export function Button({ children, className = '', ...props }) {
  return (
    <button
      className={`bg-hot-magnetic px-4 py-2 rounded text-white font-bold ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
