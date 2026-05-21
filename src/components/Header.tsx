'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Activity, GitCompare, LayoutDashboard } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Compare Hub', path: '/compare', icon: GitCompare },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--card-border)] bg-[var(--header-bg)] backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-8">
        
        {/* Branding & Logo */}
        <Link href="/" className="flex items-center gap-2 group select-none">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-500 to-amber-400 p-1.5 shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <Activity className="text-white w-full h-full animate-pulse" />
          </div>
          <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
            GitPulse
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 md:gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.path} 
                href={item.path}
                className="relative px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide flex items-center gap-1.5 transition-colors duration-300 select-none cursor-pointer"
              >
                {/* Active Indicator Background */}
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 bg-orange-500/10 dark:bg-orange-500/15 border border-orange-500/20 dark:border-orange-500/30 rounded-xl"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                
                <Icon size={14} className={isActive ? 'text-orange-500' : 'text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]'} />
                <span className={isActive ? 'text-orange-500 font-bold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}