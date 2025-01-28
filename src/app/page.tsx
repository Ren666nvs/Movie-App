import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectValue } from "@/components/ui/select";
import { SelectTrigger } from "@radix-ui/react-select";
import { headers } from "next/headers";

export default function Home() {
  return (
    <div className="...">
      <Button>hello button</Button>
      <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" /> 
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes">Grapes</SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectGroup>
      </SelectContent>
     </Select>
    
      </div>
      )
   }
   const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
   const TMDB_API_TOKEN = process.env.TMDB_API_TOKEN;
   const getMovieData = async () => {
    try{
      console.log("working");
      
      const response = axios.get(
        `${TMDB_BASE_URL}/movie/popular?language=en-US&page=1`, 
        {headers: {
      Authorization: `Bearer ${TMDB_API_TOKEN}` ,
      },
      }
    );
    console.log(response);
    
    }
    catch(err){
      console.log(err);
      
    }
  
   }