"use client";

import { useParams } from 'next/navigation'

const Page = () => {
   const params = useParams();
   console.log(params.id);
   
  return <div>dynamic route example page movie id: { params.id}</div>;
};

export default Page;