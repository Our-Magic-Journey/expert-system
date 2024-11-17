import { useState } from "react";
import { Node } from "../logic/node";
import {packTree, UnpackedTree} from "../logic/unpacked";
import { Navigation } from "../ui/navigation";
import { Title } from "../ui/title";
import * as startTree from '../start-data.json';

function loadTree(): Node {
  try {
    let data = JSON.parse(localStorage.getItem("tree-data"));

    if (data) {
      return packTree(data);
    }
  }
  catch {}

  return packTree(startTree as UnpackedTree);
}

export const QuizPage = () => {
  const [question, setQuestion] = useState(loadTree());

  return (
    <div className="bg-black w-screen h-screen p-10 flex flex-col justify-center items-stretch">
      <Title>Quiz Page</Title>
      
      <Navigation 
        items={[
          ["/editor", "Go to editor"],
          ["/", "Go to main page"],
        ]} 
      />  

      <div className="border border-yellow-400 p-1 m-1 w-full h-full flex flex-col">'
        <h1 className="text-white font-bold text-3xl w-full h-1/2 flex justify-center items-center">{question.text}</h1>
        
        <div className="text-white text-xl w-full h-1/2 flex flex-col justify-evenly items-center">
          {question.children.map(answer => (
            <div
              key={`${question.index}${answer.target.index}`}
              className="text-white hover:text-yellow-400 cursor-pointer"
              onClick={() => setQuestion(answer.target)}
            >
              {answer.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
