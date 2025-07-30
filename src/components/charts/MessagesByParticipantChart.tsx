'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface MessagesByParticipantChartProps {
  data: { name: string; count: number }[];
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

export default function MessagesByParticipantChart({ data }: MessagesByParticipantChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  
  const dataWithPercentage = data.map((item, index) => ({
    ...item,
    percentage: ((item.count / total) * 100).toFixed(1),
    color: COLORS[index % COLORS.length]
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={dataWithPercentage}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percentage }) => `${name}: ${percentage}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="count"
        >
          {dataWithPercentage.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: number) => [
            `${value} messages (${((value / total) * 100).toFixed(1)}%)`,
            'Messages'
          ]}
          labelFormatter={(label) => `Participant: ${label}`}
        />
        <Legend 
          verticalAlign="bottom" 
          height={36}
          formatter={(value, entry) => (
            <span style={{ color: entry.color || '#000' }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}