import { Navigation } from "../ui/navigation";
import { Title } from "../ui/title";

export const MainPage = () => (
  <div className="bg-black w-screen h-screen p-10">
    <Title>Main Page</Title>
    
    <Navigation 
      items={[
        ["/editor", "Go to editor"],
        ["/quiz", "Go to quiz"],
      ]} 
    />  
  </div>
);