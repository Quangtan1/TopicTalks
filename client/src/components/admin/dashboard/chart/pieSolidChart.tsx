import React from 'react';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const dataChart01 = [
  { name: '< 18 ', value: 45 },
  { name: '18 - 30', value: 35 },
  { name: '> 30', value: 20 },
];

const COLORS = ['#4dc2d5', '#e45d42', '#e3e6ef'];
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
const ChartTopicChildWGroupChat = () => {
  return (
    <ResponsiveContainer>
      <PieChart>
        <Pie
          dataKey="value"
          labelLine={false}
          data={dataChart01}
          // cx="50%"
          // cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label={renderCustomizedLabel}
        >
          {dataChart01.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ChartTopicChildWGroupChat;
