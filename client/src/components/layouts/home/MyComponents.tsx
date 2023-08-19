import { useState } from 'react';
import { useQuery } from 'react-query';
import { handleCallApi } from 'src/services/api';

export default function MyComponent() {
  const [params, setParams] = useState(1);

  const { data, isLoading } = useQuery(['myData', params], handleCallApi);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    !isLoading && (
      <div>
        <h1>MyComponent</h1>
        <p>data: {data?.data?.map((p) => p.id)}</p>
        <button onClick={() => setParams(params + 1)}>Button</button>
      </div>
    )
  );
}
