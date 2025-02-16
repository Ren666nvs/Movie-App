"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";

const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
const TMDB_API_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_TOKEN;



export default function MovieDetailsPage({ params }: { params: { movieId: string } }) {
  const { push } = useRouter();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!TMDB_BASE_URL || !TMDB_API_TOKEN) {
        console.error("Missing TMDB API configuration.");
        setError("API тохиргоо дутуу байна.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${TMDB_BASE_URL}/movie/${params.movieId}`, {
          params: { language: "en-US" },
          headers: { Authorization: `Bearer ${TMDB_API_TOKEN}` },
        });

        setMovie(response.data);
      } catch (err) {
        console.error("Error fetching movie details:", err);
        setError("Киноны мэдээлэл ачааллахад алдаа гарлаа.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [params.movieId]);

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen p-8 text-black dark:text-white">
      {movie && (
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-6">{movie.title}</h1>
          <div className="flex flex-col md:flex-row items-center gap-6">
            {movie.poster_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                width={300}
                height={450}
                className="rounded-lg"
              />
            ) : (
              <div className="w-[300px] h-[450px] bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400">
                No Image
              </div>
            )}

            <div>
              <p className="text-lg">{movie.overview}</p>
              <p className="mt-4">
                <strong>date:</strong> {movie.release_date}
              </p>
              <p>
                <strong>rate:</strong> {movie.vote_average.toFixed(1)} / 10
              </p>
              <p>
                <strong>genre:</strong> {movie.genres.map((g) => g.name).join(", ")}
              </p>
              <button
                className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg"
                onClick={() => push("/")}
              >
                back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
