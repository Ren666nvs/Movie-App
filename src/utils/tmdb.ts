const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const fetchPopularMovies = async () => {
  const res = await fetch(`${BASE_URL}/movie/popular?language=en-US&page=1&api_key=${API_KEY}`);
  const data = await res.json();
  return data.results;
};

export const fetchMovieDetails = async (id: string) => {
  const res = await fetch(`${BASE_URL}/movie/${id}?language=en-US&api_key=${API_KEY}`);
  if (!res.ok) return null;
  return res.json();
};
