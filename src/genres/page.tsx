"use client"
import { Separator } from "@radix-ui/react-dropdown-menu"
import axios from "axios" ;
import { useState, useEffect } from "react";
import { Badge } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { headers } from "next/headers";

const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
const TMDB_API_TOKEN = process.env.TMDB_API_TOKEN;

type GenresType = { id: number; name: string};

const Genres = () => {
    const searchParams = useSearchParams();

const [genres, setGenres ]  = useState<GenresType[]>([]);
const [selectedGenreIds, setSelectedGenreIds] = useState<string[]>([]);
const {push} = useRouter();
const getGenresList = async () =>  {
    await axios
    .get( `${TMDB_BASE_URL}/genre/movie/list?language=en`, {
        headers; {
            "Content-Type": "application/json",
            Authorization : `Bearer ${TMDB_API_TOKEN}`,
        },
    })
    .then((response) => {
        console.log(response);
        setGenres(response.data.genres);
    })
    .catch((error) => {
        console.log("Axios error:" , error ); 
    });
};
const getMoviesByGenres = async () => {
    const searchParams = useSearchParams();
    const genreIds = searchParams.get("genreIds")
}
 }