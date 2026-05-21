'use client';

import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

interface CommitData {
  name: string;
  commits: number;
}

interface CommitChartProps {
  data: CommitData[];
}

export default function CommitChart({ data }: CommitChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-64 flex items-center justify-center bg-orange-500/5 rounded-2xl border border-[var(--card-border)] animate-pulse">
        <span className="text-xs text-[var(--text-muted)]">Loading Activity Graph...</span>
      </div>
    );
  }

  const hasData = data && data.some((d) => d.commits > 0);

  return (
    <div className="h-64 w-full">
      {!hasData ? (
        <div className="h-full flex flex-col items-center justify-center border border-[var(--card-border)] border-dashed rounded-2xl text-center p-4">
          <p className="text-xs text-[var(--text-muted)] font-medium">No recent push/commit activity found.</p>
          <p className="text-[10px] text-[var(--text-muted)] opacity-80 mt-0.5">Commit distributions update on new pushes.</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="commitGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            
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
              cursor={{ stroke: 'var(--primary-orange)', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            
            <Area
              type="monotone"
              dataKey="commits"
              stroke="#f97316"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#commitGlow)"
              name="Commits"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}