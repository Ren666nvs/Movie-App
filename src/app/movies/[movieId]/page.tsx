"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { Star } from "lucide-react";

const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
const TMDB_API_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_TOKEN;

interface MovieDetails {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  genres: { id: number; name: string }[];
}

export default function MovieDetailsPage() {
  const { movieId } = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!TMDB_BASE_URL || !TMDB_API_TOKEN || !movieId) {
        console.error("Missing TMDB environment variables or movieId.");
        setError("Error");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
          params: { language: "en-US" },
          headers: { Authorization: `Bearer ${TMDB_API_TOKEN}` },
        });

        setMovie(response.data);
      } catch (err) {
        console.error("Error fetching movie details:", err);
        setError("error");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!movie) return <p className="text-center">error</p>;

  return (
    <div className="min-h-screen p-8 relative">
  <div className="mt-6 flex items-center justify-between">
    <div>
      <h1 className="text-3xl font-bold">{movie.title}</h1>
      <p className="text-gray-600 dark:text-gray-400">{movie.release_date}</p>
    </div>
    <div className="flex items-center">
      <Star className="text-yellow-400" />
      <span className="ml-1 text-lg font-medium">
        {movie.vote_average.toFixed(1)} / 10
      </span>
    </div>


      </div>
      {movie.backdrop_path && (
        <div className="relative w-full h-64 md:h-96">
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            layout="fill"
            objectFit="cover"
            className="rounded-md"
          />
        </div>
      )}
      <div className="mt-4">
        <div className="flex flex-wrap gap-2 mt-2">
          {movie.genres.map((genre) => (
            <span
              key={genre.id}
              className="bg-gray-300 dark:bg-gray-700 px-3 py-1 rounded-full text-sm"
            >
              {genre.name}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-gray-700 dark:text-gray-300">{movie.overview}</p>
      </div>
    </div>
  );
}
