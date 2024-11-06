import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client"
import { StrictMode } from "react";
import { EditorPage } from "./pages/editor";
import { MainPage } from "./pages/main";
import { QuizPage } from "./pages/quiz";
import { ReactFlowProvider } from "@xyflow/react";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
  },
  {
    path: "/editor",
    element: <EditorPage />,
  },
  {
    path: "/quiz",
    element: <QuizPage />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ReactFlowProvider>
      <RouterProvider router={router} />
    </ReactFlowProvider>
  </StrictMode>
);