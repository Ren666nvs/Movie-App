// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import { ChevronLeft, ChevronRight, Play } from "lucide-react";

// const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
// const TMDB_IMAGE_URL = process.env.NEXT_PUBLIC_TMDB_IMAGE_SERVICE_URL;
// const TMDB_API_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_TOKEN;

// export default function MovieCarousel() {
//   const [movies, setMovies] = useState([]);
//   const [current, setCurrent] = useState(0);

//   useEffect(() => {
//     async function fetchMovies() {
//       try {
//         const response = await fetch(`${TMDB_BASE_URL}/movie/upcoming?language=en-US&page=1`, {
//           headers: { Authorization: `Bearer ${TMDB_API_TOKEN}` },
//         });
//         const data = await response.json();
//         setMovies(data.results);
//       } catch (error) {
//         console.error("Error fetching movies:", error);
//       }
//     }
//     fetchMovies();
//   }, []);

//   useEffect(() => {
//     if (movies.length > 0) {
//       const interval = setInterval(() => {
//         setCurrent((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
//       }, 5000);
//       return () => clearInterval(interval);
//     }
//   }, [movies]);

//   if (movies.length === 0) return <p className="text-center">Loading movies...</p>;

//   return (
//     <div className="relative w-full h-[500px] overflow-hidden rounded-lg">
//       {movies.map((movie, index) => (
//         <div
//           key={movie.id}
//           className={`absolute inset-0 transition-opacity duration-700 ${
//             index === current ? "opacity-100" : "opacity-0"
//           }`}
//         >
//           <Image
//             src={`${TMDB_IMAGE_URL}/original${movie.backdrop_path}`}
//             alt={movie.title}
//             layout="fill"
//             objectFit="cover"
//             className="brightness-75"
//           />
//           <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent flex items-center px-10">
//             <div className="text-white max-w-lg">
//               <h2 className="text-4xl font-bold">{movie.title}</h2>
//               <p className="mt-3 text-lg">{movie.overview?.substring(0, 150)}...</p>
//               <p className="mt-2 flex items-center text-yellow-400 font-semibold">
//                 ⭐ {movie.vote_average?.toFixed(1)}/10
//               </p>
//               <a
//                 href={`https://www.themoviedb.org/movie/${movie.id}`}
//                 className="mt-4 inline-flex items-center px-5 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-300 transition"
//                 target="_blank"
//               >
//                 <Play className="mr-2" /> Watch Trailer
//               </a>
//             </div>
//           </div>
//         </div>
//       ))}

//       {/* Navigation Buttons */}
//       <button
//         onClick={() => setCurrent((prev) => (prev === 0 ? movies.length - 1 : prev - 1))}
//         className="absolute left-5 top-1/2 transform -translate-y-1/2 bg-white/30 p-3 rounded-full hover:bg-white transition"
//       >
//         <ChevronLeft className="text-black" />
//       </button>
//       <button
//         onClick={() => setCurrent((prev) => (prev === movies.length - 1 ? 0 : prev + 1))}
//         className="absolute right-5 top-1/2 transform -translate-y-1/2 bg-white/30 p-3 rounded-full hover:bg-white transition"
//       >
//         <ChevronRight className="text-black" />
//       </button>
//     </div>
//   );
// }
