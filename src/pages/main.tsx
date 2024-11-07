import { Navigation } from "../ui/navigation";
import { Title } from "../ui/title";

export const MainPage = () => (
  <div className="bg-black w-screen h-screen p-10 flex flex-col justify-center items-stretch">
    <Title>Main Page</Title>
    
    <Navigation 
      items={[
        ["/editor", "Go to editor"],
        ["/quiz", "Go to quiz"],
      ]} 
    />  

    <div className="border border-transparent 0 p-1 m-1 w-full min-h-full relative">
      
    </div>
  </div>
);