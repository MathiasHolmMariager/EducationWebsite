import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";

interface FavoriteItem {
  code: string;
  title: string;
}

function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [favoritesStudy, setFavoritesStudy] = useState<FavoriteItem[]>([]);
  const [, setFavoritesCode] = useState<string[]>([]);

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

  useEffect(() => {
    if (user) {
      const db = getDatabase();
      const favsRef = ref(db, `users/${user.uid}/favorites`);

      onValue(favsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const favoritesArray: FavoriteItem[] = Object.values(data);
          setFavoritesCode(favoritesArray.map((item) => item.code));
        } else {
          setFavoritesCode([]);
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

  return (
    <div
      style={{
        background: "lightgrey",
        width: "80%",
        margin: "auto",
        height: "90vh",
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
      }}
    >
      {user ? (
        <div>
          <p>Welcome, {user.email}!</p>
          <button onClick={handleSignOut}>Sign Out</button>
          <h2>Favorites:</h2>
          <ul>
            {favoritesStudy.map((favorite, index) => (
              <li key={index}>
                <a href={`/${favorite.code}`}>{favorite.title}</a>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>You are not signed in.</p>
      )}
    </div>
  );
}

export default ProfilePage;
