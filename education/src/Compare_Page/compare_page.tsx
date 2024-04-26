import { useEffect, useState} from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import "./compare_page.css"
import aboutIcon from "../assets/abouticonGray.png"
import greyAboutIcon from "../assets/abouticonGray.png"
import expandIcon from "../assets/expand.png"
import collapseIcon from "../assets/collapse.png"


function ComparePage() {
    const [underPage, setUnderPage] = useState<string>('0');
    const [options, setOptions] = useState<string>('kandidat');
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
      <div style={{width:"20%", height:"100%", display:"flex", alignItems:"center", flexDirection:"column", position:"fixed"}}>
        <button style={{width:"90%", height:"7%", outline:"none", marginTop:"5%", background: underPage === '0' && options === '' ? "rgb(239,239,239)" : "rgb(239,239,239)", display:"flex", justifyContent:"space-between", alignItems:"center", borderLeft: underPage === '0' && options === '' ? "12px solid rgb(33, 26, 82)" : "",}} onClick={() => {setUnderPage('0'); setOptions("");}}>Omkring siden<img src={underPage === '0' && options === '' ? aboutIcon : greyAboutIcon} style={{width:"10%", marginRight:"0%"}}/></button>
        <button style={{width:"90%", height:"7%", outline:"none", marginTop: options === 'bachelor' || options === '' || options === 'kandidat' ? "5%" : "0%", background: options === 'bachelor' ? "rgb(239,239,239)" : "rgb(239,239,239)", display:"flex", justifyContent:"space-between", alignItems:"center", borderLeft: options === 'bachelor' ? "12px solid rgb(33, 26, 82)" : "",}} onClick={() => {setOptions(prevState => prevState === 'bachelor' ? '' : 'bachelor'); setUnderPage('1')}}>Sammenlign batchelor <img src={options === 'bachelor' ? collapseIcon : expandIcon} style={{width:"8%", marginRight:"1%"}}/></button>
        {options === 'bachelor' && (
            <div style={{width:"80%", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"left", paddingLeft:"10%",}}>
            <p style={{margin:"1%",background:"white", outline:"none", textDecoration: underPage === '1' ? "underline" : "none", cursor:"pointer"}} onClick={() => setUnderPage('1')}>Bachelor</p>
            <p style={{margin:"1%",background:"white", outline:"none", textDecoration: underPage === '2' ? "underline" : "none", cursor:"pointer"}} onClick={() => setUnderPage('2')}>Bachelor</p>
            <p style={{margin:"1%",background:"white", outline:"none", textDecoration: underPage === '3' ? "underline" : "none", cursor:"pointer"}} onClick={() => setUnderPage('3')}>Bachelor</p>
            <p style={{margin:"1%",background:"white", outline:"none", textDecoration: underPage === '4' ? "underline" : "none", cursor:"pointer"}} onClick={() => setUnderPage('4')}>Bachelor</p>
            </div>
        )}
        <button style={{width:"90%", height:"7%", outline:"none", marginTop: options === 'kandidat' || options === '' ? "5%" : "0%", background: options === 'kandidat' ? "rgb(239,239,239)" : "rgb(239,239,239)", display:"flex", justifyContent:"space-between", alignItems:"center", borderLeft: options === 'kandidat' ? "12px solid rgb(33, 26, 82)" : "", }} onClick={() => {setOptions(prevState => prevState === 'kandidat' ? '' : 'kandidat'); setUnderPage('5');}}>Sammenlign kandidater <img src={options === 'kandidat' ? collapseIcon : expandIcon} style={{width:"8%", marginRight:"1%"}}/></button>
        {options === 'kandidat' && (
            <div style={{width:"80%", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"left", paddingLeft:"10%",}}>
                <p style={{margin:"1%",background:"white", outline:"none", textDecoration: underPage === '5' ? "underline" : "none", cursor:"pointer"}} onClick={() => setUnderPage('5')}>Kandidat</p>
                <p style={{margin:"1%",background:"white", outline:"none", textDecoration: underPage === '6' ? "underline" : "none", cursor:"pointer"}} onClick={() => setUnderPage('6')}>Kandidat</p>
                <p style={{margin:"1%",background:"white", outline:"none", textDecoration: underPage === '7' ? "underline" : "none", cursor:"pointer"}} onClick={() => setUnderPage('7')}>Kandidat</p>
                <p style={{margin:"1%",background:"white", outline:"none", textDecoration: underPage === '8' ? "underline" : "none", cursor:"pointer"}} onClick={() => setUnderPage('8')}>Kandidat</p>
            </div>
        )}
      </div>
      <div style={{ marginLeft:"25%", width:"75%", height:"100%", display:"flex", flexDirection:"column", alignItems:"center", background:"white"}}>
        {underPage === '0' && (
            <div style={{width:"85%", height:"10%", marginTop:"5%", boxShadow:"0px 0px 8px 1px rgba(0,0,0,0.1)", borderRadius:"8px", padding:"3%", marginBottom:"4%"}}>
                On this page you can compare different aspects of your favorite educations                
            </div>
        )}
        {underPage === '1' && (
            <div style={{width:"80%", height:"10%", marginTop:"5%", boxShadow:"0px 0px 8px 1px rgba(0,0,0,0.1)", borderRadius:"8px", padding:"3%", marginBottom:"4%"}}>
                bachelor compare 1 side
            </div>
        )}
        {underPage === '2' && (
            <div style={{width:"80%", height:"10%", marginTop:"5%", boxShadow:"0px 0px 8px 1px rgba(0,0,0,0.1)", borderRadius:"8px", padding:"3%", marginBottom:"4%"}}>
                bachelor compare 2 side
            </div>
        )}
        {underPage === '3' && (
            <div style={{width:"80%", height:"10%", marginTop:"5%", boxShadow:"0px 0px 8px 1px rgba(0,0,0,0.1)", borderRadius:"8px", padding:"3%", marginBottom:"4%"}}>
                bachelor compare 3 side
            </div>
        )}
        {underPage === '4' && (
            <div style={{width:"80%", height:"10%", marginTop:"5%", boxShadow:"0px 0px 8px 1px rgba(0,0,0,0.1)", borderRadius:"8px", padding:"3%", marginBottom:"4%"}}>
                bachelor compare 4 side
            </div>
        )}
        {underPage === '5' && (
            <div style={{width:"80%", height:"10%", marginTop:"5%", boxShadow:"0px 0px 8px 1px rgba(0,0,0,0.1)", borderRadius:"8px", padding:"3%", marginBottom:"4%"}}>
                kandidat compare 5 side
            </div>
        )}
        {underPage === '6' && (
            <div style={{width:"80%", height:"10%", marginTop:"5%", boxShadow:"0px 0px 8px 1px rgba(0,0,0,0.1)", borderRadius:"8px", padding:"3%", marginBottom:"4%"}}>
                kandidat compare 6 side
            </div>
        )}
        {underPage === '7' && (
            <div style={{width:"80%", height:"10%", marginTop:"5%", boxShadow:"0px 0px 8px 1px rgba(0,0,0,0.1)", borderRadius:"8px", padding:"3%", marginBottom:"4%"}}>
                kandidat compare 7 side
            </div>
        )}
        {underPage === '8' && (
            <div style={{width:"80%", height:"10%", marginTop:"5%", boxShadow:"0px 0px 8px 1px rgba(0,0,0,0.1)", borderRadius:"8px", padding:"3%", marginBottom:"4%"}}>
                kandidat compare 8 side
            </div>
        )}
      </div>
    </div>
  );
}

export default ComparePage;


