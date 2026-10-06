const fs = require('fs');
const path = require('path');

const components = {
  'Button.jsx': `export function Button({ children, className, variant = 'primary', ...props }) {
  const base = "inline-flex items-center justify-center rounded-[6px] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bright-red disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2";
  const variants = {
    primary: "bg-primary-red text-primary-text hover:bg-bright-red shadow-[0_0_16px_rgba(255,30,45,0.4)]",
    secondary: "bg-surface border border-border-default hover:border-bright-red hover:bg-surface-elevated text-primary-text",
    ghost: "hover:bg-surface-elevated text-secondary-text hover:text-primary-text"
  };
  return (
    <button className={\`\${base} \${variants[variant]} \${className || ''}\`} {...props}>
      {children}
    </button>
  );
}`,
  'Input.jsx': `export function Input({ className, ...props }) {
  return (
    <input
      className={\`flex h-10 w-full rounded-[6px] border border-border-default bg-surface px-3 py-2 text-sm text-primary-text ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-bright-red disabled:cursor-not-allowed disabled:opacity-50 \${className || ''}\`}
      {...props}
    />
  );
}`,
  'Card.jsx': `export function Card({ className, children, ...props }) {
  return (
    <div className={\`rounded-[8px] border border-border-default bg-surface-card text-primary-text shadow-sm \${className || ''}\`} {...props}>
      {children}
    </div>
  );
}`,
  'Badge.jsx': `export function Badge({ children, className, variant = 'default', ...props }) {
  const base = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  const variants = {
    default: "border-transparent bg-primary-red text-primary-text hover:bg-bright-red",
    outline: "text-primary-text border-border-default",
    secondary: "border-transparent bg-surface-elevated text-secondary-text hover:bg-surface/80"
  };
  return (
    <div className={\`\${base} \${variants[variant]} \${className || ''}\`} {...props}>
      {children}
    </div>
  );
}`
};

const uiDir = path.join(__dirname, 'frontend', 'components', 'ui');
if (!fs.existsSync(uiDir)) {
  fs.mkdirSync(uiDir, { recursive: true });
}

Object.keys(components).forEach(file => {
  const fullPath = path.join(uiDir, file);
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, components[file]);
  }
});

console.log('Core UI components generated.');
