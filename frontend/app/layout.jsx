import './globals.css';
import Providers from '@/providers/Providers';
import { Inter, JetBrains_Mono } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' });

export const metadata = {
  title: 'OFFSCRIPT',
  description: 'OFFSCRIPT Learning Platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark`}>
      <body className="bg-background text-primary-text font-sans antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
