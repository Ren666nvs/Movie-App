"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Star } from "lucide-react";
// import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
const TMDB_API_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_TOKEN;

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  genre_ids: number[];
}

interface Genre {
  id: number;
  name: string;
}

const MovieSection = ({
  title,
  movies,
  push,
}: {
  title: string;
  movies: Movie[];
  push: (path: string) => void;
}) => {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <Card
              key={movie.id}
              className="cursor-pointer hover:scale-105 transition"
              onClick={() => push(`/movies/${movie.id}`)}
            >
              <div className="relative w-full h-64">
                {movie.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-300 flex items-center justify-center">
                    No Image
                  </div>
                )}
              </div>

              <CardContent className="flex items-center justify-start space-x-2 text-yellow-400 font-medium">
                <Star className="text-yellow-400" />
                <span>{movie.vote_average.toFixed(1)} / 10</span>
              </CardContent>

              <CardHeader className="text-lg font-semibold text-center">
                {movie.title}
              </CardHeader>
            </Card>
          ))
        ) : (
          <p className="text-gray-600">No movies available</p>
        )}
      </div>
    </div>
  );
};

export default function Home() {
  const { push } = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>("");

  useEffect(() => {
    const fetchMoviesAndGenres = async () => {
      if (!TMDB_BASE_URL || !TMDB_API_TOKEN) {
        console.error("Missing TMDB environment variables.");
        return;
      }

      try {
        const [movieRes, genreRes] = await Promise.all([
          axios.get(`${TMDB_BASE_URL}/movie/popular`, {
            params: { language: "en-US", page: 1 },
            headers: { Authorization: `Bearer ${TMDB_API_TOKEN}` },
          }),
          axios.get(`${TMDB_BASE_URL}/genre/movie/list`, {
            params: { language: "en-US" },
            headers: { Authorization: `Bearer ${TMDB_API_TOKEN}` },
          }),
        ]);

        setMovies(movieRes.data.results || []);
        setGenres(genreRes.data.genres || []);
      } catch (err) {
        console.error("Error fetching movies or genres:", err);
      }
    };

    fetchMoviesAndGenres();
  }, []);

  const filteredMovies = selectedGenre
    ? movies.filter((movie) => movie.genre_ids.includes(Number(selectedGenre)))
    : movies;

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Movies</h1>
        <Select onValueChange={(value) => setSelectedGenre(value)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            {genres.map((genre) => (
              <SelectItem key={genre.id} value={genre.id.toString()}>
                {genre.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <MovieSection title="Movies" movies={filteredMovies} push={push} />
    </div>
  );
}
