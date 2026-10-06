export function Card({ className, children, ...props }) {
  return (
    <div className={`rounded-[8px] border border-border-default bg-surface-card text-primary-text shadow-sm ${className || ''}`} {...props}>
      {children}
    </div>
  );
}