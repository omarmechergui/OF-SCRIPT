export function Button({ children, className, variant = 'primary', ...props }) {
  const base = "inline-flex items-center justify-center rounded-[6px] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bright-red disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2";
  const variants = {
    primary: "bg-primary-red text-primary-text hover:bg-bright-red shadow-[0_0_16px_rgba(255,30,45,0.4)]",
    secondary: "bg-surface border border-border-default hover:border-bright-red hover:bg-surface-elevated text-primary-text",
    ghost: "hover:bg-surface-elevated text-secondary-text hover:text-primary-text"
  };
  return (
    <button className={`${base} ${variants[variant]} ${className || ''}`} {...props}>
      {children}
    </button>
  );
}