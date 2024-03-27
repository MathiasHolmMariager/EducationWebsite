import { Outlet } from "react-router";
import Header from "./Components/header";

function App() {
  return (
    <div className="Page">
      <Header />
      <Outlet />
    </div>
  );
}

export default App;
