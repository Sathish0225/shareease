import { Outlet } from "react-router-dom";
import "./App.css";
import "././assets/css/style.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <NavBar />
      <div className="min-vh-100">
        <div className="content">
          <Outlet />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default App;
