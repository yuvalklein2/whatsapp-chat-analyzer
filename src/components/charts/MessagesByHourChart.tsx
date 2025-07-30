'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MessagesByHourChartProps {
  data: { hour: number; count: number }[];
}

export default function MessagesByHourChart({ data }: MessagesByHourChartProps) {
  const formattedData = data.map(item => ({
    ...item,
    formattedHour: `${item.hour.toString().padStart(2, '0')}:00`
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="formattedHour" 
          tick={{ fontSize: 12 }}
          interval={1}
        />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip 
          labelFormatter={(label) => `${label} - ${(parseInt(label) + 1).toString().padStart(2, '0')}:00`}
          formatter={(value: number) => [value, 'Messages']}
        />
        <Bar 
          dataKey="count" 
          fill="#10B981"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}