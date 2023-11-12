import React from 'react';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AgeProps {
  age: number[];
}

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
const ChartTopicChildWGroupChat = (props: AgeProps) => {
  const { age } = props;

  const nonZeroAges = age.filter((value) => value !== 0);
  const totalCount = nonZeroAges.length;

  const dataChart01 = [
    { name: '< 18 ', value: (nonZeroAges.filter((value) => value < 18).length * 100) / totalCount },
    { name: '18 - 30', value: (nonZeroAges.filter((value) => value >= 18 && value <= 30).length * 100) / totalCount },
    { name: '> 30', value: (nonZeroAges.filter((value) => value > 30).length * 100) / totalCount },
  ];

  const formatNumber = (number) => {
    return number.toFixed(2);
  };

  return (
    <ResponsiveContainer>
      <PieChart>
        <Pie
          dataKey="value"
          labelLine={false}
          data={dataChart01}
          outerRadius={100}
          fill="#8884d8"
          label={renderCustomizedLabel}
        >
          {dataChart01.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => formatNumber(value)} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ChartTopicChildWGroupChat;
