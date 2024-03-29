import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../Home_Page/home_page.tsx";
import SearchPage from "../Search_Page/search_page.tsx";
import StudyProgramPage from "../Study_Program_Page/study_program_page.tsx";
import ProfilePage from "../Profile_Page/profile_page.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <HomePage /> },
      { path: "/search", element: <SearchPage /> },
      { path: "/study", element: <StudyProgramPage /> },
      { path: "/profile", element: <ProfilePage /> },

    ],
  },
]);
