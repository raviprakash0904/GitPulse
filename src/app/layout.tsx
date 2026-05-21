import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '../components/Providers';
import Header from '../components/Header';
import ThemeToggle from '../components/ThemeToggle';
import RateLimitIndicator from '../components/RateLimitIndicator';
import BackgroundBlobs from '../components/BackgroundBlobs';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'GitPulse | Premium GitHub Developer Analytics & Profile Comparison',
  description: 'GitPulse is a modern, startup-grade dashboard for exploring GitHub profiles, analyzing repository statistics, and comparing developer metrics with rich visualizations.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} transition-colors duration-300`} suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col font-sans" suppressHydrationWarning>
        <Providers>
          {/* Animated Glowing Gradient Blobs */}
          <BackgroundBlobs />
          
          {/* Floating Theme Toggle (Top Left) */}
          <ThemeToggle />

          {/* Sticky Glassmorphic Navbar */}
          <Header />

          {/* Page Routing Children */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-6 md:px-8 py-8 md:py-12 pb-24">
            {children}
          </main>

          {/* Floating Rate Limit & PAT Widget (Bottom Right) */}
          <RateLimitIndicator />
        </Providers>
      </body>
    </html>
  );
}