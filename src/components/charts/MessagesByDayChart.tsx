'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface MessagesByDayChartProps {
  data: { date: string; count: number }[];
}

export default function MessagesByDayChart({ data }: MessagesByDayChartProps) {
  const formattedData = data.map(item => ({
    ...item,
    formattedDate: format(new Date(item.date), 'MMM d')
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart 
        data={formattedData}
        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis 
          dataKey="formattedDate" 
          tick={{ fontSize: 11 }}
          interval="preserveStartEnd"
          axisLine={{ stroke: '#e2e8f0' }}
          tickLine={{ stroke: '#e2e8f0' }}
        />
        <YAxis 
          tick={{ fontSize: 11 }} 
          axisLine={{ stroke: '#e2e8f0' }}
          tickLine={{ stroke: '#e2e8f0' }}
        />
        <Tooltip 
          labelFormatter={(label, payload) => {
            if (payload && payload[0]) {
              const originalData = payload[0].payload;
              return format(new Date(originalData.date), 'EEEE, MMMM d, yyyy');
            }
            return label;
          }}
          formatter={(value: number) => [value, 'Messages']}
          contentStyle={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Line 
          type="monotone" 
          dataKey="count" 
          stroke="#3B82F6" 
          strokeWidth={2}
          dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
          activeDot={{ r: 5, fill: '#1D4ED8' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}