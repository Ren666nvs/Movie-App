"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation"; 
import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton"; // Ensure Skeleton is properly imported

const TMDB_API_TOKEN = process.env.TMDB_API_TOKEN;
const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

const Page = (props: { movieData: Movie[]; pageTitle: string }) => {
  const { movieData = [] } = props;  // Default value to an empty array if movieData is undefined
  const [detailedMovieData, setDetailedMovieData] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const fetchDetailedData = async () => {
    if (!Array.isArray(movieData)) {
      console.error("movieData is not an array:", movieData);
      return;
    }

    try {
      setIsLoading(true);
      const requests = movieData.map((movie) =>
        axios.get(`${TMDB_BASE_URL}/movie/${movie.id}`, {
          headers: {
            Authorization: `Bearer ${TMDB_API_TOKEN}`,
          },
          params: {
            language: "en-US",
            append_to_response: "images,credits,videos",
            include_image_language: "en",
          },
        })
      );
      const responses = await Promise.all(requests);
      const movieDetailedData = responses.map((res) => res.data);
      setDetailedMovieData(movieDetailedData);

      console.log("Page detailed movie", movieDetailedData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetailedData();
  }, [movieData]);

  return (
    <div>
      <div className="w-full flex justify-center items-center pb-5">
        <div className="w-full flex justify-start flex-col overflow-hidden ml-[4%]">
          <div className="flex flex-row justify-between">
            <h1 className="text-xl text-white font-bold mb-5 pl-2">{pageTitle}</h1>
            <h1 className="text-base text-slate-400 font-medium flex flex-row cursor-pointer mr-10">
              See more
            </h1>
          </div>
          <div className="w-full relative">
            {isLoading ? (
              <Skeleton className="w-full h-48 bg-gray-700 rounded-md" />
            ) : (
              <div className="flex flex-wrap">
                {detailedMovieData.map((movie) => (
                  <div key={movie.id} className="basis-4/12 md:basis-2/5 lg:basis-1/5 p-1">
                    <Card
                      className="overflow-hidden cursor-pointer border border-[#353843] bg-cover bg-center transform transition-transform duration-300 ease-in-out hover:scale-105"
                      style={{
                        backgroundImage: `url(https://image.tmdb.org/t/p/w780/${
                          movie?.images?.backdrops?.[0]?.file_path || movie.backdrop_path
                        })`,
                      }}
                      onClick={() => router.push(`/info/movie/${movie.id}`)}
                    >
                      <CardContent className="card flex items-center justify-center h-48 p-6">
                        {/* Add additional content inside the Card if needed */}
                      </CardContent>
                    </Card>
                    <div className="mt-3 flex flex-col">
                      <p className="text-white text-start text-lg font-medium">{movie.title}</p>
                      <div className="flex flex-row">
                        <p className="text-white text-start text-base font-medium flex flex-row items-center">
                          {/* Star component here */}
                          {movie.vote_average.toFixed(1)}
                        </p>
                        <p className="text-slate-500 text-start text-base font-medium flex flex-row items-center ml-2">
                          | <span className="ml-2 text-sm">{movie?.genres?.[0]?.name}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
