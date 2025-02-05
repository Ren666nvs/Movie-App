"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
}

const MovieCard = ({ movie }: { movie: Movie }) => {
  const { push } = useRouter();

  return (
    <Card
      key={movie.id}
      className="cursor-pointer hover:scale-105 transition"
      onClick={() => push(`/movie/${movie.id}`)}
    >
      <div className="relative w-full h-64">
        {movie.poster_path && (
          <Image
            src={`${process.env.NEXT_PUBLIC_TMDB_IMAGE_SERVICE_URL}/w500${movie.poster_path}`}
            alt={movie.title}
            layout="fill"
            objectFit="cover"
            className="rounded-md"
          />
        )}
      </div>

      <CardContent className="flex items-center justify-start space-x-2 text-left text-yellow-400 font-medium">
        <Star className="text-yellow-400" />
        <span>{movie.vote_average.toFixed(1)} / 10</span>
      </CardContent>

      <CardHeader className="text-lg font-semibold text-center">
        {movie.title}
      </CardHeader>
    </Card>
  );
};

export default MovieCard;

