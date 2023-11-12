import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface Gender {
  female: number;
  male: number;
  others: number;
}
interface GenderProps {
  gender: Gender;
}

const COLORS = ['#4dc2d5', '#e45d42', '#e3e6ef'];

const GenderAgeChart = (props: GenderProps) => {
  const { gender } = props;
  const data = [
    { name: 'Male', value: gender?.male },
    { name: 'Female', value: gender?.female },
    { name: 'Other', value: gender?.others },
  ];

  return (
    <ResponsiveContainer>
      <PieChart>
        <Pie
          data={data}
          // cx="50%"
          // cy="50%"
          paddingAngle={1}
          labelLine={false}
          // label={renderCustomizedLabel}
          innerRadius={50}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default GenderAgeChart;
