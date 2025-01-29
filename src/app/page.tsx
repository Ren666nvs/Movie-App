import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import { SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Select } from "@radix-ui/react-select";


const Page = () => {
  return (
    <>
      <Header />
      <main>
      
      <div className="...">
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Genres" />
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
      </main>
      <Footer />
    </>
  );
};

export default Page;
