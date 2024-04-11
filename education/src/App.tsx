import { Outlet } from "react-router";
import Header from "./Components/header";

function App() {
  return (
    <div className="Page" style={{display:"flex", flexDirection:"column"}}>
      <Header />
      <div style={{marginTop:"7vh"}}>
      <Outlet />
      </div>
    </div>
  );
}

export default App;
