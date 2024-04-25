import { useEffect, useState} from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import "./compare_page.css"


function ComparePage() {
    const [underPage, setUnderPage] = useState<string>('1');
    const [user, setUser] = useState<User | null>(null);

  //henter UID fra firebase
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);


  return (
    <div style={{width:"90%",height:"100%", margin:"auto", display:"flex", flexDirection:"row", overflowY:"auto"}}>
      <div style={{width:"25%", height:"100%", display:"flex", alignItems:"center", flexDirection:"column", position:"fixed"}}>
        <button style={{width:"80%", height:"7%", outline:"none", marginTop:"5%", background: underPage === '1' ? "rgb(33, 26, 82)" : "", color: underPage === '1' ? "white" : "" }} onClick={() => setUnderPage('1')}>compare 1</button>
        <button style={{width:"80%", height:"7%", outline:"none", marginTop:"5%", background: underPage === '2' ? "rgb(33, 26, 82)" : "", color: underPage === '2' ? "white" : ""}} onClick={() => setUnderPage('2')}>compare 2</button>
        <button style={{width:"80%", height:"7%", outline:"none", marginTop:"5%", background: underPage === '3' ? "rgb(33, 26, 82)" : "", color: underPage === '3' ? "white" : ""}} onClick={() => setUnderPage('3')}>copare 3</button>
        <button style={{width:"80%", height:"7%", outline:"none", marginTop:"5%", background: underPage === '4' ? "rgb(33, 26, 82)" : "", color: underPage === '4' ? "white" : ""}} onClick={() => setUnderPage('4')}>compare 4</button>
      </div>
      <div style={{ marginLeft:"25%", width:"75%", height:"100%", display:"flex", flexDirection:"column", alignItems:"center"}}>
        {underPage === '1' && (
            <div></div>
        )}
        {underPage === '2' && (
            <div></div>
        )}
        {underPage === '3' && (
            <div></div>
        )}
        {underPage === '4' && (
            <div></div>
        )}
      </div>
    </div>
  );
}

export default ComparePage;


