'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ResponseTimeChartProps {
  data: { name: string; avgResponseMinutes: number; totalResponses: number }[];
}

const formatTime = (minutes: number) => {
  if (minutes < 60) {
    return `${Math.round(minutes)}m`;
  } else if (minutes < 1440) {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  } else {
    const days = Math.floor(minutes / 1440);
    const hours = Math.floor((minutes % 1440) / 60);
    return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
  }
};

export default function ResponseTimeChart({ data }: ResponseTimeChartProps) {
  const chartData = data.map(item => ({
    ...item,
    displayTime: formatTime(item.avgResponseMinutes)
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          tickFormatter={formatTime}
        />
        <Tooltip 
          formatter={(value: number) => [
            formatTime(value),
            'Average Response Time'
          ]}
          labelFormatter={(label, payload) => {
            if (payload && payload[0]) {
              const data = payload[0].payload;
              return `${data.name} (${data.totalResponses} responses)`;
            }
            return label;
          }}
          itemStyle={{ color: '#1F2937' }}
          contentStyle={{ 
            backgroundColor: '#F9FAFB', 
            border: '1px solid #E5E7EB',
            borderRadius: '6px'
          }}
        />
        <Bar 
          dataKey="avgResponseMinutes" 
          fill="#6366F1"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}