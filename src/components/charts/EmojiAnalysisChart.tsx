'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface EmojiAnalysisChartProps {
  data: { emoji: string; count: number }[];
}

export default function EmojiAnalysisChart({ data }: EmojiAnalysisChartProps) {
  const topEmojis = data.slice(0, 10);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={topEmojis}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="emoji" 
          tick={{ fontSize: 16 }}
          height={50}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
        />
        <Tooltip 
          formatter={(value: number) => [value, 'Uses']}
          labelFormatter={(label) => `${label} emoji`}
          itemStyle={{ color: '#1F2937' }}
          contentStyle={{ 
            backgroundColor: '#F9FAFB', 
            border: '1px solid #E5E7EB',
            borderRadius: '6px'
          }}
        />
        <Bar 
          dataKey="count" 
          fill="#F59E0B"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}