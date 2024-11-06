import { Navigation } from "../ui/navigation";
import { Title } from "../ui/title";

export const QuizPage = () => (
  <div className="bg-black w-screen h-screen p-10">
    <Title>Quiz Page</Title>
    
    <Navigation 
      items={[
        ["/editor", "Go to editor"],
        ["/", "Go to main page"],
      ]} 
    />  
  </div>
);