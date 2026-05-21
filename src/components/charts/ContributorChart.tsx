'use client';

import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface ContributorData {
  login: string;
  contributions: number;
}

interface ContributorChartProps {
  data: ContributorData[];
}

export default function ContributorChart({ data }: ContributorChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-64 flex items-center justify-center bg-orange-500/5 rounded-2xl border border-[var(--card-border)] animate-pulse">
        <span className="text-xs text-[var(--text-muted)]">Loading Contributor Stats...</span>
      </div>
    );
  }

  const hasData = data && data.length > 0;

  // Format data for Recharts (limit to top 8)
  const chartData = data.slice(0, 8).map((d) => ({
    name: d.login,
    commits: d.contributions,
  }));

  return (
    <div className="h-64 w-full">
      {!hasData ? (
        <div className="h-full flex flex-col items-center justify-center border border-[var(--card-border)] border-dashed rounded-2xl text-center p-4">
          <p className="text-xs text-[var(--text-muted)] font-medium">No contributor data compiled.</p>
          <p className="text-[10px] text-[var(--text-muted)] opacity-80 mt-0.5">Contributor splits update automatically on git events.</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#fb923c" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.05)" vertical={false} />
            
            <XAxis 
              dataKey="name" 
              stroke="var(--text-muted)" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
            />
            
            <YAxis 
              stroke="var(--text-muted)" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              allowDecimals={false}
            />
            
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: '12px',
                fontSize: '11px',
                color: 'var(--text-primary)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
              labelStyle={{ fontWeight: 'bold', color: 'var(--primary-orange)' }}
              cursor={{ fill: 'rgba(249, 115, 22, 0.05)' }}
            />
            
            <Bar 
              dataKey="commits" 
              fill="url(#barGradient)" 
              radius={[4, 4, 0, 0]} 
              name="Contributions"
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}