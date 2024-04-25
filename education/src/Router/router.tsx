import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../Home_Page/home_page.tsx";
import SearchPage from "../Search_Page/search_page.tsx";
import InteractionsdesignBachelor from "../Bachelor_Pages/Interaktionsdesign_Bachelor/interaktionsdesign_bachelor.tsx";
import ProfilePage from "../Profile_Page/profile_page.tsx";
import NoPage from "../No_Page/no_page.tsx";
import ChatPage from "../Chat_Page/chat_page.tsx";
import InformationsteknologiBachelor from "../Bachelor_Pages/Informationsteknologi_Bachelor/informationsteknologi_bachelor.tsx";
import MedialogiBachelor from "../Bachelor_Pages/Medialogi_Bachelor/medialogi_bachelor.tsx";
import InteraktionsdesignKandidat from "../Kandidat_Pages/Interaktionsdesign_Kandidat/interaktionsdesign_kandidat.tsx";
import MedialogyKandidat from "../Kandidat_Pages/Medialogy_Kandidat/medialogy_kandidat.tsx";
import ComputerscienceKandidat from "../Kandidat_Pages/ComputerScience_Kandidat/computerscience_kandidat.tsx";
import ComparePage from "../Compare_Page/compare_page.tsx";



export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <HomePage /> },
      { path: "/search", element: <SearchPage /> },
      { path: "/Interaktionsdesign, Bachelor", element: <InteractionsdesignBachelor /> },
      { path: "/Informationsteknologi, Bachelor", element: <InformationsteknologiBachelor /> },
      { path: "/Medialogi, Bachelor", element: <MedialogiBachelor /> },
      { path: "/Interaktionsdesign, Kandidat", element: <InteraktionsdesignKandidat /> },
      { path: "/Medialogy, Kandidat", element: <MedialogyKandidat /> },
      { path: "/Computerscience, Kandidat", element: <ComputerscienceKandidat /> },
      { path: "/profile", element: <ProfilePage /> },
      { path: "/chat", element: <ChatPage/> },
      { path: "/nopage", element: <NoPage /> },
      { path: "/compare", element: <ComparePage /> },
    ],
  },
]);
