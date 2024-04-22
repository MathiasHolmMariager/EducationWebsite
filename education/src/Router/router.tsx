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



export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <HomePage /> },
      { path: "/search", element: <SearchPage /> },
      { path: "/Interaktionsdesign, Bachelor", element: <InteractionsdesignBachelor /> },
      { path: "/Informationsteknologi, Bachelor", element: <InformationsteknologiBachelor /> },
      { path: "/Interaktionsdesign, Kandidat", element: <InteraktionsdesignKandidat /> },
      { path: "/Medialogi, Bachelor", element: <MedialogiBachelor /> },
      { path: "/profile", element: <ProfilePage /> },
      { path: "/chat", element: <ChatPage/> },
      { path: "/nopage", element: <NoPage /> },
    ],
  },
]);
