import React from 'react';
import { PieChart, Pie, Tooltip, ResponsiveContainer } from 'recharts';

const dataChart01 = [
  { name: 'Technology', value: 400 },
  { name: 'Health', value: 300 },
  { name: 'Finance', value: 300 },
  { name: 'Travel', value: 200 },
  { name: 'Education', value: 278 },
  { name: 'Sports', value: 189 },
];

const ChartTopicChildWGroupChat = () => {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart width={300} height={240}>
        <Pie
          dataKey="value"
          isAnimationActive={false}
          data={dataChart01}
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label
        />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ChartTopicChildWGroupChat;
