export function Badge({ children, className, variant = 'default', ...props }) {
  const base = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  const variants = {
    default: "border-transparent bg-primary-red text-primary-text hover:bg-bright-red",
    outline: "text-primary-text border-border-default",
    secondary: "border-transparent bg-surface-elevated text-secondary-text hover:bg-surface/80"
  };
  return (
    <div className={`${base} ${variants[variant]} ${className || ''}`} {...props}>
      {children}
    </div>
  );
}