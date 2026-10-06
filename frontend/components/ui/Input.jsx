export function Input({ className, ...props }) {
  return (
    <input
      className={`flex h-10 w-full rounded-[6px] border border-border-default bg-surface px-3 py-2 text-sm text-primary-text ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-bright-red disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
      {...props}
    />
  );
}