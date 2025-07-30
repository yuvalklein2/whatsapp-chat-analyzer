'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WordFrequencyChartProps {
  data: { word: string; count: number }[];
}

export default function WordFrequencyChart({ data }: WordFrequencyChartProps) {
  const topWords = data.slice(0, 15);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={topWords} layout="horizontal">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" tick={{ fontSize: 12 }} />
        <YAxis 
          type="category" 
          dataKey="word" 
          tick={{ fontSize: 12 }}
          width={80}
        />
        <Tooltip 
          formatter={(value: number) => [value, 'Frequency']}
          labelFormatter={(label) => `Word: ${label}`}
        />
        <Bar 
          dataKey="count" 
          fill="#8B5CF6"
          radius={[0, 4, 4, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}