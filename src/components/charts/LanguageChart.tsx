'use client';

import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface LanguageItem {
  name: string;
  value: number;
}

interface LanguageChartProps {
  data: LanguageItem[];
}

const COLORS = [
  '#f97316', // Orange
  '#fb923c', // Accent Orange
  '#eab308', // Amber/Yellow
  '#f59e0b', // Yellow-500
  '#fcd34d', // Amber-300
  '#fdba74', // Orange-300
];

export default function LanguageChart({ data }: LanguageChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-64 flex items-center justify-center bg-orange-500/5 rounded-2xl border border-[var(--card-border)] animate-pulse">
        <span className="text-xs text-[var(--text-muted)]">Loading Language Chart...</span>
      </div>
    );
  }

  const hasData = data && data.length > 0;

  return (
    <div className="h-64 w-full">
      {!hasData ? (
        <div className="h-full flex flex-col items-center justify-center border border-[var(--card-border)] border-dashed rounded-2xl text-center p-4">
          <p className="text-xs text-[var(--text-muted)] font-medium">No language metrics available.</p>
          <p className="text-[10px] text-[var(--text-muted)] opacity-80 mt-0.5">Languages update when repository code compiles.</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  className="stroke-[var(--background)] stroke-2 focus:outline-none"
                />
              ))}
            </Pie>
            
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: '12px',
                fontSize: '11px',
                color: 'var(--text-primary)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
              formatter={(value: any) => [`${value} repos`, 'Count']}
            />
            
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconSize={8}
              iconType="circle"
              wrapperStyle={{ fontSize: '10px', color: 'var(--text-secondary)' }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}