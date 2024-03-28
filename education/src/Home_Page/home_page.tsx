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
      <button onClick={openModal}>Open Modal</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        style={{
          content: {
            width: "50%",
            height: "90%",
            margin: "auto",
            textAlign: "center",
          },
        }}
      >
        <h2>Create user to compare study programs</h2>
        <p>content of the modal.</p>
        <button onClick={closeModal}>No, thanks</button>
        <button onClick={closeModal}>Create user</button>
      </Modal>
    </div>
  );
}

export default HomePage;
