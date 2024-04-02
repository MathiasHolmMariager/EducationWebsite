import { getDatabase, ref, child, get } from "firebase/database";
import { useEffect, useState } from "react";

function ProfilePage() {
  let userId = localStorage.getItem("UID");
  const dbRef = ref(getDatabase());

  const fetchUserEmail = async () => {
    try {
      const snapshot = await get(child(dbRef, `users/${userId}/email`));
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
      }
    } catch (error) {
    }
  };

  const [email, setEmail] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchUserEmail().then((email) => {
        setEmail(email);
      });
    }
  }, [userId, dbRef]);

  return (
    <div>
      <h1>din email er: {email}</h1>
    </div>
  );
}

export default ProfilePage;
