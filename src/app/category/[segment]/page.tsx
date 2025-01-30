
"use client";

import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams();

  // params.category байгаа эсэхийг шалгах
  if (!params || !params.category) {
    return <div>Category not found</div>;
  }

  console.log("Category:", params.category);

  return (
    <div>
      <h1 className="text-2xl font-bold">Category: {params.category}</h1>
    </div>
  );
};

export default Page;
