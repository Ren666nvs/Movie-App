"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { Star } from "lucide-react";
import HomeSkeleton from "@/components/HomeSkeleton";

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

interface MovieCredits {
  director: string;
  writers: string[];
  stars: string[];
}

interface Video {
  site: string;
  type: string;
  key: string;
}

interface MovieTrailer {
  key: string;
}

interface SimilarMovie {
  id: number;
  title: string;
  poster_path: string;
}

interface CrewMember {
  job: string;
  name: string;
  department: string;
}

interface CastMember {
  name: string;
}

export default function MovieDetailsPage() {
  const { movieId } = useParams() as { movieId: string };
  const router = useRouter();

  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [credits, setCredits] = useState<MovieCredits | null>(null);
  const [trailer, setTrailer] = useState<MovieTrailer | null>(null);
  const [similarMovies, setSimilarMovies] = useState<SimilarMovie[]>([]);
  const [showAllSimilar, setShowAllSimilar] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!TMDB_BASE_URL || !TMDB_API_TOKEN || !movieId) {
        setError("Missing environment variables or movie ID.");
        setLoading(false);
        return;
      }

      try {
        const [movieRes, creditsRes, videosRes, similarRes] = await Promise.all([
          axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
            params: { language: "en-US" },
            headers: { Authorization: `Bearer ${TMDB_API_TOKEN}` },
          }),
          axios.get(`${TMDB_BASE_URL}/movie/${movieId}/credits`, {
            headers: { Authorization: `Bearer ${TMDB_API_TOKEN}` },
          }),
          axios.get(`${TMDB_BASE_URL}/movie/${movieId}/videos`, {
            params: { language: "en-US" },
            headers: { Authorization: `Bearer ${TMDB_API_TOKEN}` },
          }),
          axios.get(`${TMDB_BASE_URL}/movie/${movieId}/similar`, {
            params: { language: "en-US", page: 1 },
            headers: { Authorization: `Bearer ${TMDB_API_TOKEN}` },
          }),
        ]);

        setMovie(movieRes.data);

        const crew = creditsRes.data.crew as CrewMember[];
        const cast = creditsRes.data.cast as CastMember[];

        const director = crew.find((p) => p.job === "Director")?.name || "Unknown";
        const writers = crew
          .filter((p) => p.job === "Writer" || p.department === "Writing")
          .map((writer) => writer.name);
        const stars = cast.slice(0, 3).map((actor) => actor.name);

        setCredits({ director, writers, stars });

        const trailerVideo = videosRes.data.results.find(
          (video: Video) => video.site === "YouTube" && video.type === "Trailer"
        );

        setTrailer(trailerVideo || null);
        setSimilarMovies(similarRes.data.results || []);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          console.error("Axios Error:", err.response?.data || err.message);
        } else if (err instanceof Error) {
          console.error("Unknown Error:", err.message);
        } else {
          console.error("Unexpected error:", err);
        }
        setError("Failed to load movie details.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  if (loading) return <HomeSkeleton />;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!movie) return <p className="text-center">Movie not found.</p>;

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
        <div className="relative w-full h-64 md:h-96 mt-4">
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            fill
            className="rounded-md object-cover"
          />
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {movie.genres.map((genre) => (
          <span
            key={genre.id}
            className="bg-gray-300 dark:bg-gray-700 px-3 py-1 rounded-full text-sm"
          >
            {genre.name}
          </span>
        ))}
      </div>

      <div className="mt-4">
        <p className="text-gray-700 dark:text-gray-300">{movie.overview}</p>
      </div>

      {credits && (
        <div className="mt-6 space-y-1">
          <p><strong>Director:</strong> {credits.director}</p>
          <p><strong>Writers:</strong> {credits.writers.join(", ")}</p>
          <p><strong>Stars:</strong> {credits.stars.join(", ")}</p>
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Trailer</h2>
        {trailer ? (
          <iframe
            width="100%"
            height="400"
            src={`https://www.youtube.com/embed/${trailer.key}`}
            title={`Trailer for ${movie.title}`}
            allowFullScreen
            className="rounded-lg"
          />
        ) : (
          <p>No trailer available.</p>
        )}
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Similar Movies</h2>
          {similarMovies.length > 5 && (
            <button
              onClick={() => setShowAllSimilar(!showAllSimilar)}
              className="text-blue-600 hover:text-blue-800"
            >
              {showAllSimilar ? "See Less" : "See More"}
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-4">
          {(showAllSimilar ? similarMovies : similarMovies.slice(0, 5)).map((m) => (
            <div
              key={m.id}
              className="cursor-pointer"
              onClick={() => router.push(`/movies/${m.id}`)}
            >
              <Image
                src={
                  m.poster_path
                    ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
                    : "/fallback-image.jpg"
                }
                alt={m.title}
                width={200}
                height={300}
                className="rounded-md"
              />
              <p className="text-center mt-2">{m.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
