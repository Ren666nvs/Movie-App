// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import { Card, CardHeader, CardContent } from "@/components/ui/card";
// import Image from "next/image";
// import { Star } from "lucide-react";

// const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
// const TMDB_API_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_TOKEN;

// interface Movie {
//   id: number;
//   title: string;
//   poster_path: string;
//   vote_average: number;
// }

// export default function GenreMoviesPage({ params }: { params: { genreId: string } }) {
//   const { push } = useRouter();
//   const [movies, setMovies] = useState<Movie[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchMoviesByGenre = async () => {
//       if (!TMDB_BASE_URL || !TMDB_API_TOKEN) {
//         console.error("Missing TMDB API configuration.");
//         setError("API тохиргоо дутуу байна.");
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
//           params: { language: "en-US", with_genres: params.genreId, page: 1 },
//           headers: { Authorization: `Bearer ${TMDB_API_TOKEN}` },
//         });

//         setMovies(response.data.results);
//       } catch (err) {
//         console.error("Error fetching movies:", err);
//         setError("Киноны мэдээлэл ачааллахад алдаа гарлаа.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMoviesByGenre();
//   }, [params.genreId]);

//   if (loading) return <p className="text-center text-lg">Кинонууд ачааллаж байна...</p>;
//   if (error) return <p className="text-center text-red-500">{error}</p>;

//   return (
//     <div className="min-h-screen p-8 text-black dark:text-white">
//       <h1 className="text-3xl font-bold text-center mb-6">Жанрын кинонууд</h1>

//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
//         {movies.length > 0 ? (
//           movies.map((movie) => (
//             <Card
//               key={movie.id}
//               className="cursor-pointer hover:scale-105 transition"
//               onClick={() => push(`/movies/${movie.id}`)}
//             >
//               <div className="relative w-full h-64">
//                 {movie.poster_path ? (
//                   <Image
//                     src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
//                     alt={movie.title}
//                     layout="fill"
//                     objectFit="cover"
//                     className="rounded-md"
//                   />
//                 ) : (
//                   <div className="w-full h-64 bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400">
//                     No Image
//                   </div>
//                 )}
//               </div>

//               <CardContent className="flex items-center justify-start space-x-2 text-left text-yellow-400 font-medium">
//                 <Star className="text-yellow-400" />
//                 <span>{movie.vote_average.toFixed(1)} / 10</span>
//               </CardContent>

//               <CardHeader className="text-lg font-semibold text-center">
//                 {movie.title}
//               </CardHeader>
//             </Card>
//           ))
//         ) : (
//           <p className="text-gray-600 dark:text-gray-400 text-center w-full">
//             Энэ жанрт кино алга байна.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }
