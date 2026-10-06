const fs = require('fs');
const path = require('path');

const routes = [
  'app/(public)/page.jsx',
  'app/(auth)/login/page.jsx',
  'app/(auth)/register/page.jsx',
  'app/(auth)/forgot-password/page.jsx',
  'app/(auth)/reset-password/page.jsx',
  'app/(member)/dashboard/page.jsx',
  'app/(member)/roadmap/page.jsx',
  'app/(member)/sessions/[id]/page.jsx',
  'app/(member)/assignments/page.jsx',
  'app/(member)/assignments/[id]/page.jsx',
  'app/(member)/projects/page.jsx',
  'app/(member)/projects/[id]/page.jsx',
  'app/(member)/competitions/page.jsx',
  'app/(member)/competitions/[id]/page.jsx',
  'app/(member)/badges/page.jsx',
  'app/(member)/points/page.jsx',
  'app/(member)/profile/page.jsx',
  'app/(member)/layout.jsx',
  'app/(auth)/layout.jsx',
  'app/(public)/layout.jsx'
];

routes.forEach(route => {
  const fullPath = path.join(__dirname, 'frontend', route);
  const dir = path.dirname(fullPath);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const name = path.basename(dir);
  const title = name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  let content = `export default function Page() {\n  return (\n    <div className="p-8">\n      <h1 className="text-2xl font-bold">${title} Page</h1>\n    </div>\n  );\n}\n`;

  if (route.endsWith('layout.jsx')) {
    content = `export default function Layout({ children }) {\n  return (\n    <div className="${name}-layout">\n      {children}\n    </div>\n  );\n}\n`;
  }

  // Only create if it doesn't exist
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, content);
  }
});

console.log('Placeholder routes generated.');
