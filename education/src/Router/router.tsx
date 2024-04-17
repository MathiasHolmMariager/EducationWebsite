import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../Home_Page/home_page.tsx";
import SearchPage from "../Search_Page/search_page.tsx";
import InteractionsdesignBachlor from "../Bachlor_Pages/Interaktionsdesign_Bachlor/interaktionsdesign_bachlor.tsx";
import ProfilePage from "../Profile_Page/profile_page.tsx";
import NoPage from "../No_Page/no_page.tsx";
import ChatPage from "../Chat_Page/chat_page.tsx";
import InformationsteknologiBachlor from "../Bachlor_Pages/Informationsteknologi_Bachlor/informationsteknologi_bachlor.tsx";
import MedialogiBachlor from "../Bachlor_Pages/Medialogi_Bachlor/medialogi_bachlor.tsx";
import InteraktionsdesignKandidat from "../Kandidat_Pages/Interaktionsdesign_Kandidat/interaktionsdesign_kandidat.tsx";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <HomePage /> },
      { path: "/search", element: <SearchPage /> },
      { path: "/Interaktionsdesign, Bachelor", element: <InteractionsdesignBachlor /> },
      { path: "/Informationsteknologi, Bachelor", element: <InformationsteknologiBachlor /> },
      { path: "/Interaktionsdesign, Kandidat", element: <InteraktionsdesignKandidat /> },
      { path: "/Medialogi, Bachelor", element: <MedialogiBachlor /> },
      { path: "/profile", element: <ProfilePage /> },
      { path: "/chat", element: <ChatPage/> },
      { path: "/nopage", element: <NoPage /> },

    ],
  },
]);
