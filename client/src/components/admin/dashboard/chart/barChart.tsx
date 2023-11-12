import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Technology',
    uv: 4000, // Thay đổi số liệu tương ứng với dữ liệu thực tế
    pv: 2400, // Thay đổi số liệu tương ứng với dữ liệu thực tế
    amt: 2400,
  },
  {
    name: 'Health',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Business',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Education',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Art and Culture',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Science',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Travel',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: 'Food and Drink',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Sports',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Fashion',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
];
const BarChartItem = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="pv" fill="#4dc2d5" shape={<Rectangle fill="pink" stroke="blue" />} />
        <Bar dataKey="uv" fill="#e3e6ef" shape={<Rectangle fill="gold" stroke="purple" />} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartItem;
