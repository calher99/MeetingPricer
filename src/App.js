import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MeetingDetailForm from "./pages/MeetingDetailForm";
import MeetingTimer from "./pages/MeetingTimer";

const router = createBrowserRouter([
  {path: "/", element: <MeetingDetailForm/>},
  {path: "/timer", element: <MeetingTimer/>}
])

function App() {
  
  return (
    <RouterProvider router={router}/>
  );
}

export default App;
