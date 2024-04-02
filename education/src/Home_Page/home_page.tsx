import { useEffect, useState } from "react";
import UserModal from "../Components/login_create_user";

interface LastSeenItem {
  title: string;
  code: string;
}

function HomePage() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [lastSeenList, setLastSeenList] = useState<LastSeenItem[]>([]);
  const uidExists = localStorage.getItem("UID");

  //#####################login/opret_popup########################
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
  //#####################login/opret_popup########################

  //#####################Sidst_Sete_uddan#########################
  useEffect(() => {
    const storedList = localStorage.getItem("LAST_SEEN");
    if (storedList) {
      setLastSeenList(JSON.parse(storedList));
    }
  }, []);
  //#####################Sidst_Sete_uddan#########################

  return (
    <div
      style={{
        background: "blue",
        width: "80%",
        margin: "auto",
        height: "90vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          background: "yellow",
          width: "100%",
          margin: "auto",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          textAlign: "center",
          justifyContent: "center",
          height: "40%",
        }}
      >
        <h1>Welcome</h1>
      </div>
      <div
        style={{
          width: "100%",
          margin: "auto",
          height: "60%",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <div
          style={{
            background: "green",
            width: "40%",
            margin: "auto",
            height: "60%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h2>Sidst sete uddannelser:</h2>

          <ul>
            {lastSeenList.map((item, index) => (
              <li key={index}>
                <a href={item.code}>{item.title}</a>
              </li>
            ))}
          </ul>
        </div>
        <div
          style={{
            background: "red",
            width: "40%",
            margin: "auto",
            height: "60%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {uidExists ? (
            <div>
              <h2>Your Saved Educations:</h2>
            </div>
          ) : (
            <div>
              <h2>Log ind for at se dine gemte uddannelser:</h2>
              <button onClick={openModal} style={{ marginTop: "15%" }}>
                Log ind
              </button>
            </div>
          )}
        </div>
      </div>
      <UserModal isOpen={modalIsOpen} onRequestClose={closeModal} />
    </div>
  );
}

export default HomePage;
