import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import "./profile_page.css"

interface FavoriteItem {
  code: string;
  title: string;
}

interface Diploma {
  highSchoolDiploma?: { [key: number]: any };
  bachelorDiploma?: { [key: number]: any };
}

function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [favoritesStudy, setFavoritesStudy] = useState<FavoriteItem[]>([]);
  const [pickedInterests, setPickedInterests] = useState<string[]>([]);
  const [diploma, setDiploma] = useState<Diploma>({});
  const [favoritesDropdownVisible, setFavoritesDropdownVisible] = useState(false);
  const [interestsDropdownVisible, setInterestsDropdownVisible] = useState(false);
  const [highSchoolDiplomaDropdownVisible, setHighSchoolDiplomaDropdownVisible] = useState(false);
  const [bachelorDiplomaDropdownVisible, setBachelorDiplomaDropdownVisible] = useState(false);

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
      const interestsRef = ref(db, `users/${user.uid}/interests`);
      const diplomaRef = ref(db, `users/${user.uid}/diploma`);

      onValue(favsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const favoritesArray: FavoriteItem[] = Object.values(data);
          setFavoritesStudy(favoritesArray);
        } else {
          setFavoritesStudy([]);
        }
      });

      onValue(interestsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setPickedInterests(data);
        } else {
          setPickedInterests([]);
        }
      });

      onValue(diplomaRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setDiploma(data);
        } else {
          setDiploma({});
        }
      });
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const toggleDropdown = (dropdownName: string) => {
    switch (dropdownName) {
      case "favorites":
        setFavoritesDropdownVisible(!favoritesDropdownVisible);
        break;
      case "interests":
        setInterestsDropdownVisible(!interestsDropdownVisible);
        break;
      case "highSchoolDiploma":
        setHighSchoolDiplomaDropdownVisible(!highSchoolDiplomaDropdownVisible);
        break;
      case "bachelorDiploma":
        setBachelorDiplomaDropdownVisible(!bachelorDiplomaDropdownVisible);
        break;
      default:
        break;
    }
  };

  return (
    <div className="profile_container">
      {user ? (
        <div style={{ width: "60%"}}>
          <p>Welcome, {user.email}!</p>
          <button onClick={handleSignOut}>Sign Out</button>
          <div></div>
          <div className="profile_dropdown">
            <button className="profile_dropdown-button" onClick={() => toggleDropdown("favorites")}>
              Favorites
            </button>
            {favoritesDropdownVisible && (
              <div className="profile_dropdown-content">
                <ul>
                  {favoritesStudy.map((favorite, index) => (
                    <li key={index}>
                      <a href={`/${favorite.code}`}>{favorite.title}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="profile_dropdown">
            <button className="profile_dropdown-button" onClick={() => toggleDropdown("interests")}>
              Interests
            </button>
            {interestsDropdownVisible && (
              <div className="profile_dropdown-content">
                <ul>
                  {pickedInterests.map((interest, index) => (
                    <li key={index}>{interest}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {diploma.highSchoolDiploma && (
            <div className="profile_dropdown">
              <button className="profile_dropdown-button" onClick={() => toggleDropdown("highSchoolDiploma")}>
                High School Diploma
              </button>
              {highSchoolDiplomaDropdownVisible && (
                <div className="profile_dropdown-content">
                  <ul>
                    {Object.values(diploma.highSchoolDiploma).map((subject: any, index: number) => (
                      <li key={index}>
                        Fag: {subject.fag} {subject.niveau} {subject.type}  Karakter: {subject.årsKarakter}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          {diploma.bachelorDiploma && (
            <div className="profile_dropdown">
              <button className="profile_dropdown-button" onClick={() => toggleDropdown("bachelorDiploma")}>
                Bachelor's Diploma
              </button>
              {bachelorDiplomaDropdownVisible && (
                <div className="profile_dropdown-content">
                  <ul>
                    {Object.values(diploma.bachelorDiploma).map((subject: any, index: number) => (
                      <li key={index}>
                        Kursus: {subject.fag}, Semester: {subject.semester}, Karakter: {subject.karakter}, ECTS Points: {subject.ectsPoint}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <p>You are not signed in.</p>
      )}
    </div>
  );
}

export default ProfilePage;
