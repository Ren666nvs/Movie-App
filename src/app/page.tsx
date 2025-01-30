// import Footer from "@/components/footer/Footer";
// import Header from "@/components/header/Header";
// import { SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Select } from "@radix-ui/react-select";
// import { Car}

// const Page = () => {
//   return (
//     <>
//       <Header />
//       <main>

//       <div className="...">
//         <Select>
//           <SelectTrigger className="w-[180px]">
//             <SelectValue placeholder="Genres" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectGroup>
//               <SelectLabel>Fruits</SelectLabel>
//               <SelectItem value="apple">Apple</SelectItem>
//               <SelectItem value="banana">Banana</SelectItem>
//               <SelectItem value="blueberry">Blueberry</SelectItem>
//               <SelectItem value="grapes">Grapes</SelectItem>
//               <SelectItem value="pineapple">Pineapple</SelectItem>
//             </SelectGroup>
//           </SelectContent>
//         </Select>
//         <Carousel />
//       </div>
//       </main>
//       <Footer />
//     </>
//   );
// };

// export default Page;
"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
// import Link from "next/link";
import { useRouter } from "next/navigation"; // ✅ Next.js 13+ хувилбарт зөв импорт

export default function Home() {
  const { push } = useRouter(); // ✅ useRouter-г зөв хэрэглэх

  const movieData = [
    { id: 1, title: "name1", img: "image", category: "top_rate" },
    { id: 2, title: "name2", img: "image", category: "up_coming" },
  ];

  return (
    <div className="grid grid-rows-3 items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {movieData.map((movie) => (
        <Card key={movie.id}>
          <CardHeader>{movie.title}</CardHeader>
          <CardContent onClick={() => push(`/category/${movie.category}`)} className="cursor-pointer hover:text-blue-500">
            Click me and navigate to category page
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
