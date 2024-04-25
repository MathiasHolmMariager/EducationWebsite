import { useEffect, useState } from "react";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, onValue, ref } from "firebase/database";
import "../Home_Page/home_page.css";
import arrowClick from "../assets/arrow.png"
import loginIcon from "../assets/loginIcon.png"
import UserModal from "../Components/login_create_user";
import searchIcon from "../assets/search.png"
import compareIcon from "../assets/compare.png"
import chatIcon from "../assets/chat.png"

interface LastSeenItem {
  title: string;
  code: string;
}

interface FavoriteItem {
  code: string;
  title: string;
}

function HomePage() {
  const [lastSeenList, setLastSeenList] = useState<LastSeenItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [favoritesStudy, setFavoritesStudy] = useState<FavoriteItem[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

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


  //#####################Sidst_Sete_uddan#########################
  useEffect(() => {
    const storedList = localStorage.getItem("LAST_SEEN");
    if (storedList) {
      setLastSeenList(JSON.parse(storedList));
    }
  }, []);
  //##############################################################

  const signInButtonClick = () => {
    if (!user) {
      setModalIsOpen(true);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

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
        <div style={{width:"100%", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column"}}>
          <h1 style={{marginTop:"2%"}}>EducationHelper</h1>
          <h2 style={{marginTop:"-2%"}}>Guiding your path to academic success</h2>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", width:"70%", marginTop:"2%"}}>
          <button style={{background:"rgb(33, 26, 82)", color:"white", width:"26%", display:"flex", alignItems:"center", justifyContent:"center",}}><a style={{color:"white", width:"100%", height:"100%",display:"flex", alignItems:"center", justifyContent:"center",}} href="/search"><img src={searchIcon} style={{width:"15%", marginRight:"5%"}}/>Søg efter uddannelser</a></button>
          <button style={{background:"rgb(33, 26, 82)", color:"white", width:"26%", display:"flex", alignItems:"center", justifyContent:"center",}}><a style={{color:"white", width:"100%", height:"100%",display:"flex", alignItems:"center", justifyContent:"center",}} href="/compare"><img src={compareIcon} style={{width:"15%", marginRight:"5%"}}/> Sammenlign uddanelser</a></button>
          <button style={{background:"rgb(33, 26, 82)", color:"white", width:"26%", display:"flex", alignItems:"center", justifyContent:"center",}}><a style={{color:"white", width:"100%", height:"100%",display:"flex", alignItems:"center", justifyContent:"center",}} href="/chat"> <img src={chatIcon} style={{width:"15%", marginRight:"5%",}}/>Skriv til uddannelser</a></button>
          </div>
        </div>
      </div>
      <div
        style={{
          width: "100%",
          margin: "auto",
          marginTop: "1.5%",
          height: "80%",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <div
          style={{
            width: "40%",
            margin: "auto",
            height: "82%",
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
              height: "10%",
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
              height:"90%",
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
            height: "82%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "11px",
            boxShadow: "0px 0px 8px 2px rgba(0,0,0,0.1)",
          }}
        >
          {user ? (
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
                  height: "10%",
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
                  height: "90%",
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
                style={{
                  width: "100%",
                  height: "80%",
                  borderBottomLeftRadius: "10px",
                  borderBottomRightRadius: "10px",
                  background:"white",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection:"column"

                }}
              >
                <p style={{color:"75,75,75", fontSize:"100%", fontWeight:"500", marginTop:"-5%"}}>Log ind for at gemme dine favorit uddannelser:</p>
                <button style={{ display:"flex", width:"25%", height:"15%", alignItems:"center", justifyContent:"center", marginTop:"5%"}} >
                  <img src={loginIcon} style={{width:"20%",}} />
                  <p style={{width:"70%", textAlign:"left", paddingLeft:"20%"}} onClick={signInButtonClick}>Log ind</p>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {user ? null : (
        <div
          style={{
            display: modalIsOpen ? "block" : "none",
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 99999,
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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <UserModal onRequestClose={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
