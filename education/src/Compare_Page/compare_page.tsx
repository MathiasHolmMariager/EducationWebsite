import { useEffect, useState} from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import "./compare_page.css"
import aboutIcon from "../assets/abouticon.png"
import greyAboutIcon from "../assets/abouticonGray.png"
import expandIcon from "../assets/expand1.png"
import collapseIcon from "../assets/collapseWhite1.png"
import whiteSearch from "../assets/search.png"
import greySearch from "../assets/searchGrey.png"
import BarChartCompare from "../Components/barchart_compare";
import { getDatabase, onValue, ref } from "firebase/database";

interface FavoriteItem {
    title: string;
    type: string;
    lønNiveau: {name: string; value: number; fill: string; unit: string;}[];
    lønNiveauTi: {name: string; value: number; fill: string; unit: string;}[];
    tidsforbrug: {name: string; value: number; fill: string; unit: string;}[];
  }


function ComparePage() {
    const [underPage, setUnderPage] = useState<string>('0');
    const [options, setOptions] = useState<string>('');
    const [user, setUser] = useState<User | null>(null);
    const [favoritesStudy, setFavoritesStudy] = useState<FavoriteItem[]>([]);
    const barColors = ['#09214C', '#FAA712', '#FBD607', '#DBDE4F', '#4FA169'];
    const lønData = favoritesStudy.filter(item => item.type === "master").flatMap(item => item.lønNiveau).map((lønNiveau, index) => ({ ...lønNiveau, fill: barColors[index % barColors.length] }));
    const lønTiData = favoritesStudy.filter(item => item.type === "master").flatMap(item => item.lønNiveauTi).map((lønNiveauTi, index) => ({ ...lønNiveauTi, fill: barColors[index % barColors.length] }));
    const tidsforbrugData = favoritesStudy.filter(item => item.type === "master").flatMap(item => item.tidsforbrug).map((tidsforbrug, index) => ({ ...tidsforbrug, fill: barColors[index % barColors.length], unit: "timer"}));
  //henter UID fra firebase
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);
  
  //få list over favoritter
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


  return (
    <div style={{width:"90%",height:"100%", margin:"auto", display:"flex", flexDirection:"row", overflowY:"auto"}}>
      <div style={{width:"20%", height:"100%", display:"flex", alignItems:"center", flexDirection:"column", position:"fixed", background:"white", boxShadow:"0px 0px 8px 1px rgba(0,0,0,0.1)"}}>
        <button style={{width:"90%", height:"7%", outline:"none", marginTop:"5%", background: underPage === '0' && options === '' ? "rgb(33, 26, 82)" : "rgb(239,239,239)", color: underPage === '0' && options === '' ? "white" : "", display:"flex", justifyContent:"space-between", alignItems:"center",}} onClick={() => {setUnderPage('0'); setOptions("");}}>Overview<img src={underPage === '0' && options === '' ? aboutIcon : greyAboutIcon} style={{width:"9%", marginRight:"0%"}}/></button>
        <button style={{width:"90%", height:"7%", outline:"none", marginTop:"5%", background: underPage === '1' && options === '' ? "rgb(33, 26, 82)" : "rgb(239,239,239)", color: underPage === '1' && options === '' ? "white" : "", display:"flex", justifyContent:"space-between", alignItems:"center",}} onClick={() => {setUnderPage('1'); setOptions("");}}>Reverse search<img src={underPage === '1' && options === '' ? whiteSearch : greySearch} style={{width:"8%", marginRight:"0%"}}/></button>
        <button style={{marginTop:"5%", width:"90%", height:"7%", outline:"none", background: options === 'bachelor' ? "rgb(33, 26, 82)" : "rgb(239,239,239)", color: options === 'bachelor' ? "white" : "", display:"flex", justifyContent:"space-between", alignItems:"center" }} onClick={() => {setOptions(prevState => prevState === 'bachelor' ? '' : 'bachelor'); setUnderPage('2');}}>Sammenlign bachelor <img src={options === 'bachelor' ? collapseIcon : expandIcon} style={{width:"7%", marginRight:"1%"}}/></button>
        {options === 'bachelor' && (
            <div style={{width:"90%", display:"flex", justifyContent:"center", flexDirection:"column", alignItems:"end", marginBottom:"-3%"}}>
                <button style={{ outline:"none", textAlign:"left", width:"95%", marginTop:"2%", borderLeft: underPage === '2' ? "10px solid rgb(33, 26, 82)" : "", background:"rgb(239,239,239)"}} onClick={() => setUnderPage('2')}>Bachelor adgangskrav</button> 
                <button style={{ outline:"none", textAlign:"left", width:"95%", marginTop:"2%", borderLeft: underPage === '3' ? "10px solid rgb(33, 26, 82)" : "", background:"rgb(239,239,239)"}} onClick={() => setUnderPage('3')}>Kandidat muligheder</button> 
                <button style={{ outline:"none", textAlign:"left", width:"95%", marginTop:"2%", borderLeft: underPage === '4' ? "10px solid rgb(33, 26, 82)" : "", background:"rgb(239,239,239)"}} onClick={() => setUnderPage('4')}>Bachelor semestre</button> 
                <button style={{ outline:"none", textAlign:"left", width:"95%", marginTop:"2%", borderLeft: underPage === '5' ? "10px solid rgb(33, 26, 82)" : "", background:"rgb(239,239,239)"}} onClick={() => setUnderPage('5')}>Tidsforbrug på bachelor</button> 
            </div>
        )}
        <button style={{marginTop:"5%", width:"90%", height:"7%", outline:"none", background: options === 'kandidat' ? "rgb(33, 26, 82)" : "rgb(239,239,239)", color: options === 'kandidat' ? "white" : "", display:"flex", justifyContent:"space-between", alignItems:"center" }} onClick={() => {setOptions(prevState => prevState === 'kandidat' ? '' : 'kandidat'); setUnderPage('6');}}>Sammenlign kandidater <img src={options === 'kandidat' ? collapseIcon : expandIcon} style={{width:"7%", marginRight:"1%"}}/></button>
        {options === 'kandidat' && (
            <div style={{width:"90%", display:"flex", justifyContent:"center", flexDirection:"column", alignItems:"end" , marginBottom:"-3%"}}>
                <button style={{ outline:"none", textAlign:"left", width:"95%", marginTop:"2%", borderLeft: underPage === '6' ? "10px solid rgb(33, 26, 82)" : "", background:"rgb(239,239,239)"}} onClick={() => setUnderPage('6')}>Kandidat adgangskrav</button> 
                <button style={{ outline:"none", textAlign:"left", width:"95%", marginTop:"2%", borderLeft: underPage === '7' ? "10px solid rgb(33, 26, 82)" : "", background:"rgb(239,239,239)"}} onClick={() => setUnderPage('7')}>Kandidat semestre</button> 
                <button style={{ outline:"none", textAlign:"left", width:"95%", marginTop:"2%", borderLeft: underPage === '8' ? "10px solid rgb(33, 26, 82)" : "", background:"rgb(239,239,239)"}} onClick={() => setUnderPage('8')}>Tidsforbrug på kandidat</button> 
                <button style={{ outline:"none", textAlign:"left", width:"95%", marginTop:"2%", borderLeft: underPage === '9' ? "10px solid rgb(33, 26, 82)" : "", background:"rgb(239,239,239)"}} onClick={() => setUnderPage('9')}>Jobmuligheder</button> 
                <button style={{ outline:"none", textAlign:"left", width:"95%", marginTop:"2%", borderLeft: underPage === '10' ? "10px solid rgb(33, 26, 82)" : "", background:"rgb(239,239,239)"}} onClick={() => setUnderPage('10')}>løn niveau</button>
                <button style={{ outline:"none", textAlign:"left", width:"95%", marginTop:"2%", borderLeft: underPage === '11' ? "10px solid rgb(33, 26, 82)" : "", background:"rgb(239,239,239)"}} onClick={() => setUnderPage('11')}>Social miljø</button>
                <button style={{ outline:"none", textAlign:"left", width:"95%", marginTop:"2%", borderLeft: underPage === '12' ? "10px solid rgb(33, 26, 82)" : "", background:"rgb(239,239,239)"}} onClick={() => setUnderPage('12')}>Arbejdsløshed</button>
            </div>
        )}
      </div>
      <div style={{ marginLeft:"25%", width:"75%", height:"100%", display:"flex", flexDirection:"column", alignItems:"center"}}>
        {underPage === '0' && (
            <div style={{width:"90%", height:"10%", marginTop:"5%", boxShadow:"0px 0px 8px 1px rgba(0,0,0,0.1)", borderRadius:"8px", padding:"3%", marginBottom:"4%", background:"white", display:"flex", flexDirection:"column"}}>               
                <p style={{width:"100%", textAlign:"center", fontWeight: 500}}>På denne side kan du bruge de forskellige undersider til at sammenligne dinde favorit uddannelser:</p>
                <h3 style={{margin:"0%"}}>Reverse search</h3>
                <p style={{marginLeft:"2%"}}>Brug reverse search til at finde din vej til et job. Denne underside kan finde den bachlor og/eller kandidat der giver adgang til dit drømme job.</p>
                <h3 style={{margin:"0%"}}>Sammenlign Bachelor</h3>
                <p style={{marginLeft:"2%"}}>Brug denne side til at få et hurtigt overblik over statestikken for dine favorit bachelor uddannelser.</p>
                <h3 style={{margin:"0%"}}>Sammenlign kandidater</h3>
                <p style={{marginLeft:"2%"}}>Brug denne side til at få et hurtigt overblik over statestikken for dine favorit kandidat uddannelser.</p>
            </div>
        )}
        {underPage === '1' && (
            <div style={{width:"90%", height:"10%", marginTop:"5%", boxShadow:"0px 0px 8px 1px rgba(0,0,0,0.1)", borderRadius:"8px", padding:"3%", marginBottom:"4%", background:"white", display:"flex", flexDirection:"column"}}>
                <p style={{width:"100%", textAlign:"center", fontWeight: 500}}>Indtast dit drømme job så finder vi vejen dertil for dig</p>
                                
            </div>
        )}
        {underPage === '2' && (
            <div style={{width:"90%", height:"10%", marginTop:"5%", boxShadow:"0px 0px 8px 1px rgba(0,0,0,0.1)", borderRadius:"8px", padding:"3%", marginBottom:"4%", background:"white", display:"flex", flexDirection:"column"}}>
                bachelor compare 1 side
            </div>
        )}
        {underPage === '3' && (
            <div style={{width:"90%", height:"10%", marginTop:"5%", boxShadow:"0px 0px 8px 1px rgba(0,0,0,0.1)", borderRadius:"8px", padding:"3%", marginBottom:"4%", background:"white", display:"flex", flexDirection:"column"}}>
                bachelor compare 2 side
            </div>
        )}
        {underPage === '4' && (
            <div style={{width:"90%", height:"10%", marginTop:"5%", boxShadow:"0px 0px 8px 1px rgba(0,0,0,0.1)", borderRadius:"8px", padding:"3%", marginBottom:"4%", background:"white", display:"flex", flexDirection:"column"}}>
                bachelor compare 3 side
            </div>
        )}
        {underPage === '5' && (
            <div style={{width:"90%", height:"10%", marginTop:"5%", boxShadow:"0px 0px 8px 1px rgba(0,0,0,0.1)", borderRadius:"8px", padding:"3%", marginBottom:"4%", background:"white", display:"flex", flexDirection:"column"}}>
                bachelor compare 4 side
            </div>
        )}
        {underPage === '6' && (
            <div style={{width:"90%", height:"10%", marginTop:"5%", boxShadow:"0px 0px 8px 1px rgba(0,0,0,0.1)", borderRadius:"8px", padding:"3%", marginBottom:"4%", background:"white", display:"flex", flexDirection:"column"}}>
                kandidat compare 5 side
            </div>
        )}
        {underPage === '7' && (
            <div style={{width:"90%", height:"10%", marginTop:"5%", boxShadow:"0px 0px 8px 1px rgba(0,0,0,0.1)", borderRadius:"8px", padding:"3%", marginBottom:"4%", background:"white", display:"flex", flexDirection:"column"}}>
                kandidat compare 6 side
            </div>
        )}
        {underPage === '8' && (
            <div style={{width:"90%", height:"10%", marginTop:"5%", boxShadow:"0px 0px 8px 1px rgba(0,0,0,0.1)", borderRadius:"8px", padding:"3%", marginBottom:"4%", background:"white", display:"flex", flexDirection:"column"}}>
                <h2>Gennemsnit arbejdstimer på dine favorit uddannelser</h2>
                <h3>ugentlige arbejdstimer:</h3>
                <BarChartCompare data = {tidsforbrugData} width={300} height={200} />
            </div>
        )}
        {underPage === '9' && (
            <div style={{width:"90%", height:"10%", marginTop:"5%", boxShadow:"0px 0px 8px 1px rgba(0,0,0,0.1)", borderRadius:"8px", padding:"3%", marginBottom:"4%", background:"white", display:"flex", flexDirection:"column"}}>
                kandidat compare 8 side
            </div>
        )}
        {underPage === '10' && (
            <div style={{width:"90%", height:"10%", marginTop:"5%", boxShadow:"0px 0px 8px 1px rgba(0,0,0,0.1)", borderRadius:"8px", padding:"3%", marginBottom:"4%", background:"white", display:"flex", flexDirection:"column"}}>
                <h2>Gennemsnit løn niveau for dine favorit uddannelser</h2>
                <h3>Første års løn:</h3>
                <BarChartCompare data = {lønData} width={300} height={200} />
                <h3>Løn efter 10 år:</h3>
                <BarChartCompare data = {lønTiData} width={300} height={200} />
            </div>
        )}
        {underPage === '11' && (
            <div style={{width:"90%", height:"10%", marginTop:"5%", boxShadow:"0px 0px 8px 1px rgba(0,0,0,0.1)", borderRadius:"8px", padding:"3%", marginBottom:"4%", background:"white", display:"flex", flexDirection:"column"}}>
                kandidat compare 10 side
            </div>
        )}
        {underPage === '12' && (
            <div style={{width:"90%", height:"10%", marginTop:"5%", boxShadow:"0px 0px 8px 1px rgba(0,0,0,0.1)", borderRadius:"8px", padding:"3%", marginBottom:"4%", background:"white", display:"flex", flexDirection:"column"}}>
                kandidat compare 11 side
            </div>
        )}
      </div>
    </div>
  );
}

export default ComparePage;


