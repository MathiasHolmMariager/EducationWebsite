import { useEffect, useState } from "react";
import UserModal from "../Components/login_create_user";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, onValue, ref } from "firebase/database";
import "../Home_Page/home_page.css";
import arrowClick from "../assets/arrow.png"

interface LastSeenItem {
  title: string;
  code: string;
}

interface FavoriteItem {
  code: string;
  title: string;
}

function HomePage() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [lastSeenList, setLastSeenList] = useState<LastSeenItem[]>([]);
  const uidExists = localStorage.getItem("UID");
  const [user, setUser] = useState<User | null>(null);
  const [favoritesStudy, setFavoritesStudy] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const db = getDatabase();
      const favsRef = ref(db, `users/${user.uid}/favorites`);

      onValue(favsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const favoritesArray: FavoriteItem[] = Object.values(data);
          setFavoritesStudy(favoritesArray);
        } else {
          setFavoritesStudy([]);
        }
      });
    }
  }, [user]);

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
        width: "90%",
        margin: "auto",
        height: "90vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
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
        <div>
          <h1>EducationHelper</h1>
          <h2>Guiding your path to academic success</h2>
        </div>
      </div>
      <div
        style={{
          width: "100%",
          margin: "auto",
          height: "80%",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <div
          style={{
            width: "40%",
            margin: "auto",
            height: "90%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: "10px",
            padding: "0%",
            boxShadow: "0px 0px 8px 2px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              background: "rgb(33, 26, 82)",
              color: "white",
              width: "100%",
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
              height: "20%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h2>Sidst sete uddannelser:</h2>
          </div>
          <div
            className="likeList"
            style={{
              width: "100%",
              overflow: "auto",
              borderBottomLeftRadius: "10px",
              borderBottomRightRadius: "10px",

            }}
          >
            <ul style={{ margin: "0%", padding:"0%", marginTop:"2%" }}>
              {lastSeenList.map((item, index) => (
                <li
                  key={index}
                  style={{
                    background: "lightgrey",
                    margin: "auto",
                    width: "96%",
                    marginBottom: "2%",
                    height: "50px",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <a href={item.code} style={{ width:"100%", height:"100%", borderRadius:"8px", display:"flex", alignItems:"center", textAlign:"left", color:"rgb(75,75,75)", paddingLeft:"2%"}}>
                    <p style={{width:"92%"}}>{item.title}</p>
                    <img src={arrowClick} style={{width:"30px", height:"30px", marginTop:"0.2%"}} />
                    </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div
          style={{
            width: "40%",
            margin: "auto",
            height: "90%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "11px",
            boxShadow: "0px 0px 8px 2px rgba(0,0,0,0.1)",
          }}
        >
          {uidExists ? (
            <div
              style={{
                width: "100%",
                height: "100%",
                
              }}
            >
              <div
                style={{
                  background: "rgb(33, 26, 82)",
                  color: "white",
                  width: "100%",
                  borderTopLeftRadius: "8px",
                  borderTopRightRadius: "8px",
                  height: "20%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  
                }}
              >
                <h2>Dine favorit uddannelser:</h2>
              </div>
              <div
                className="likeList"
                style={{
                  width: "100%",
                  height: "80%",
                  overflow: "auto",
                  borderBottomLeftRadius: "10px",
                  borderBottomRightRadius: "10px",
                  background:"white"
                }}
              >
                <ul
                  style={{
                    listStyleType: "none",
                    margin: "0%",
                    padding: "0%",
                    marginTop: "2%",
                  }}
                >
                  {favoritesStudy.map((favorite, index) => (
                    <li
                      key={index}
                      style={{
                        background: "lightgrey",
                        margin: "auto",
                        width: "96%",
                        marginBottom: "2%",
                        height: "50px",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <a href={`/${favorite.code}`} style={{ width:"100%", height:"100%", borderRadius:"8px", display:"flex", alignItems:"center", textAlign:"left", color:"rgb(75,75,75)", paddingLeft:"2%"}}>
                        <p style={{width:"92%"}}>{favorite.title}</p>
                        <img src={arrowClick} style={{width:"30px", height:"30px", marginTop:"0.2%"}} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
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
