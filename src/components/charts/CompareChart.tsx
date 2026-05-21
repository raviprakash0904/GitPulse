'use client';

import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

interface CompareMetric {
  metric: string;
  [key: string]: string | number; // dynamically mapped subject keys
}

interface CompareChartProps {
  nameA: string;
  nameB: string;
  metrics: {
    label: string;
    valA: number;
    valB: number;
  }[];
}

export default function CompareChart({ nameA, nameB, metrics }: CompareChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-80 flex items-center justify-center bg-orange-500/5 rounded-2xl border border-[var(--card-border)] animate-pulse">
        <span className="text-xs text-[var(--text-muted)]">Loading Comparison Analytics...</span>
      </div>
    );
  }

  // Format the metrics data for Recharts
  const chartData = metrics.map((m) => ({
    metric: m.label,
    [nameA]: m.valA,
    [nameB]: m.valB,
  }));

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 15, right: 10, left: -25, bottom: 5 }}>
          <defs>
            <linearGradient id="glowA" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#fb923c" />
            </linearGradient>
            <linearGradient id="glowB" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#fcd34d" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.05)" vertical={false} />
          
          <XAxis 
            dataKey="metric" 
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
            cursor={{ fill: 'rgba(249, 115, 22, 0.03)' }}
          />
          
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconSize={8}
            iconType="circle"
            wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
          />
          
          <Bar 
            dataKey={nameA} 
            fill="url(#glowA)" 
            radius={[4, 4, 0, 0]} 
          />
          
          <Bar 
            dataKey={nameB} 
            fill="url(#glowB)" 
            radius={[4, 4, 0, 0]} 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}