import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../Home_Page/home_page.tsx";
import SearchPage from "../Search_Page/search_page.tsx";
import StudyProgramPage from "../Study_Program_Page/study_program_page.tsx";
import ProfilePage from "../Profile_Page/profile_page.tsx";
import NoPage from "../No_Page/no_page.tsx";
import ChatPage from "../Chat_Page/chat_page.tsx";
import StudyProgramPageTwo from "../Study_Program_Page_Two/study_program_page_two.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <HomePage /> },
      { path: "/search", element: <SearchPage /> },
      { path: "/study", element: <StudyProgramPage /> },
      { path: "/studytwo", element: <StudyProgramPageTwo /> },
      { path: "/profile", element: <ProfilePage /> },
      { path: "/chat", element: <ChatPage/> },
      { path: "/nopage", element: <NoPage /> },

    ],
  },
]);
