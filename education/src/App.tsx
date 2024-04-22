import { Outlet } from "react-router";
import Header from "./Components/header";
import { useEffect, useState } from "react";
import UserModal from "./Components/login_create_user";
import { auth } from "./Components/firebase";

function App() {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const isInitialized = localStorage.getItem('ID');
    if (!isInitialized) {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (!user) {
          setModalIsOpen(true);
        }
      });

      localStorage.setItem('ID', "true");
      return () => unsubscribe();
    }
  }, []);


  const closeModal = () => {
    setModalIsOpen(false);
  };



  return (
    <div className="Page" style={{display:"flex", flexDirection:"column"}}>
      <Header />
      <div style={{marginTop:"7vh"}}>
      <Outlet />
      </div>
      <div
            style={{
              display: modalIsOpen ? "block" : "none",
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
            onClick={closeModal}
          >
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <UserModal onRequestClose={closeModal} />
            </div>
          </div>
    </div>
  );
}

export default App;
