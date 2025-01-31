const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export async function fetchMovies(category: string) {
  try {
    const res = await fetch(`${BASE_URL}/movie/${category}?api_key=${API_KEY}&language=en-US`);
    
    if (!res.ok) throw new Error("Failed to fetch movies");
    
    const data = await res.json();
    return data.results; 
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
}
