"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation"; 
import axios from 'axios';
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const { push } = useRouter(); 
  const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
  const TMDB_API_TOKEN = process.env.TMDB_API_TOKEN;
  const TMDB_IMAGE_SERVICE_URL = process.env.TMDB_IMAGE_SERVICE_URL;

  const [movies, setMovies] = useState<Movie[]>([]); 

  useEffect(() => {
    const getUpcomingMovies = async () => {
      try {
        const response = await axios.get(`${TMDB_BASE_URL}/movie/now_playing?language=en-US&page=1`, {
          params: {
            language: 'en-US',
            page: 1
          },
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${TMDB_API_TOKEN}`
          }
        });
        setMovies(response.data.results); 
      } catch (err) {
        console.error("Error fetching movies:", err);
      }
    };

    getUpcomingMovies(); 
  }, []); 

  return (
    <div className="grid grid-rows-3 items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {movies.length > 0 ? (
        movies.map((movie) => (
          <Card key={movie.id}>
            <CardHeader>{movie.title}</CardHeader>
            <div className="relative w-full h-64">
              {movie.poster_path && (
                <Image
                  src={`${TMDB_IMAGE_SERVICE_URL}${movie.poster_path}/image.tmdb.org/t/p`} 
                  alt={movie.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              )}
            </div>
            <CardContent onClick={() => push(`/category/${movie.id}`)} className="cursor-pointer hover:text-blue-500">
              Click me and navigate to the movie details page
            </CardContent>
          </Card>
        ))
      ) : (
        <p>Loading movies...</p>
      )}
    </div>
  );
}
