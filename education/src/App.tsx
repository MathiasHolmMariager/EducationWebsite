import { Outlet } from "react-router";
import "./App.css";

function App() {
  return (
    <div className="Page">
      <Outlet />
    </div>
  );
}

export default App;
