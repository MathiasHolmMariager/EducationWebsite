import { useEffect, useState } from "react";
import Modal from "react-modal";

function HomePage() {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  useEffect(() => {
    setModalIsOpen(true);
  }, []);

  return (
    <div>
      <button onClick={openModal} style={{ margin: "20px" }}>
        Create user
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        style={{
          content: {
            width: "30%",
            height: "90%",
            margin: "auto",
            textAlign: "center",
          },
        }}
      >
        <h2>Create user to compare study programs</h2>

        <button onClick={closeModal} style={{ margin: "20px" }}>
          No, thanks
        </button>
        <button
          onClick={closeModal}
          style={{
            margin: "20px",
            backgroundColor: "rgb(33, 26, 82)",
            color: "white",
          }}
        >
          Create user
        </button>
      </Modal>
    </div>
  );
}

export default HomePage;
