import { useEffect, useState } from "react";
import UserModal from "../Components/login_create_user";

function HomePage() {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  useEffect(() => {
    const uid = localStorage.getItem("UID");
    if (!uid) {
      setModalIsOpen(true);
    }
  }, []);

  return (
    <div>
      <button onClick={openModal} style={{ margin: "20px" }}>
        Log ind
      </button>
      <UserModal isOpen={modalIsOpen} onRequestClose={closeModal} />
    </div>
  );
}

export default HomePage;


