'use client';

import { useParams } from 'next/navigation';

const DashboardById = () => {
  const param = useParams();
  console.log({ param });
  return <span>{`Dashboard : ${param?.id}`}</span>;
};

export default DashboardById;
