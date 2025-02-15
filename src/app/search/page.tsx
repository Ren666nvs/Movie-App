"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";

const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
const TMDB_API_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_TOKEN;

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [target, toFixed]

  useEffect(() => {
    if (!query) return;
    
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
          params: { query, language: "en-US", page: 1 },
          headers: { Authorization: `Bearer ${TMDB_API_TOKEN}` },
        });

        setMovies(response.data.results || []);
      } catch (err) {
        console.error("Error fetching search results:", err);
        setError("Failed to fetch movies.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [query]);

  if (!query) return <p className="text-center">Please enter a search term.</p>;
  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (movies.length === 0) return <p className="text-center">No results found.</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Search Results for "{query}"</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <div key={movie.id} className="cursor-pointer" onClick={() => router.push(`/movies/${movie.id}`)}>
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              width={200}
              height={300}
              className="rounded-md"
            />
            <p className="text-center mt-2">{movie.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
