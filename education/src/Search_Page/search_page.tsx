import React, { useEffect, useState } from "react";
import "./search_page.css";
import Select from "react-select";
import ArrowLink from "../assets/arrow.png";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import { child, get, getDatabase, onValue, push, ref } from "firebase/database";

interface AdgangskravBachItem {
  fag: string;
  niveau: string;
  n: number;
  avg: number;
  n2: number;
  avg2: number;
}

interface DataItem {
  name: string;
  code: string;
  students: number;
  degree: string;
  interests: string[]; 
  adgangskravBach: AdgangskravBachItem[];
  adgangskravKand: string[];
}

function SearchPage() {
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("alpha");
  const [selectedDegree, setSelectedDegree] = useState<string>("all");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedAvailable, setSelectedAvailable] = useState<string>("all");
  const [userBachelor, setUserBachelor] = useState<string>("none")
  const [userHigh] = useState<any[]>([]);


  const data: DataItem[] = [
    {
      name: "Interaktionsdesign - Aalborg - Bachelor",
      code: "Interaktionsdesign, Bachelor",
      students: 100,
      degree: "bachelor",
      interests: ["Matematik"],
      adgangskravBach: [
        {
          fag: 'Dansk',
          niveau: "A",
          n: 3,
          avg: 2,
          n2: 3,
          avg2: 2,
        },
        {
          fag: 'Engelsk',
          niveau: "B",
          n: 2,
          avg: 2,
          n2: 2,
          avg2: 2,
        },
        {
          fag: 'Matematik',
          niveau: "B",
          n: 2, 
          avg: 2,
          n2: 2,
          avg2: 2,
        },
      ],
      adgangskravKand: [],
    },
    {
      name: "Computer science (IT) - Aalborg - Kandidat",
      code: "Computerscience, Kandidat",
      students: 200,
      degree: "master",
      interests: ["Fysik"],
      adgangskravKand: ["Informationsteknologi","Datavidenskab og machine learning","Interaktionsdesign","Data Science","Datavidenskab","Computer Science"],
      adgangskravBach: [],
    },
    {
      name: "Interaktionsdesign - Aalborg - Kandidat",
      code: "Interaktionsdesign, Kandidat",
      students: 123,
      degree: "master",
      interests: ["Programmering"],
      adgangskravKand: ["Interaktionsdesign", "Informationsteknologi", "Medialogi", "Datalogi", "Software", "Digital design", "Datalogi"],
      adgangskravBach: [],
    },
    {
      name: "Informationsteknologi - Aalborg - Bachelor",
      code: "Informationsteknologi, Bachelor",
      students: 342,
      degree: "bachelor",
      interests: ["Matematik"],
      adgangskravBach:[
        {
          fag: 'Dansk',
          niveau: "A",
          n: 3,
          avg: 2,
          n2: 3,
          avg2: 2,
        },
        {
          fag: 'Engelsk',
          niveau: "B",
          n: 2,
          avg: 2,
          n2: 2,
          avg2: 2,
        },
        {
          fag: 'Matematik',
          niveau: "A",
          n: 3, 
          avg: 2,
          n2: 3,
          avg2: 2,
        },
      ],
      adgangskravKand: [],
    },
    {
      name: "Medialogi - Aalborg - Bachelor",
      code: "Medialogi, Bachelor",
      students: 113,
      degree: "bachelor",
      interests: ["Matematik"],
      adgangskravBach: [
        {
          fag: 'Dansk',
          niveau: "A",
          n: 3,
          avg: 2,
          n2: 3,
          avg2: 2,
        },
        {
          fag: 'Engelsk',
          niveau: "B",
          n: 2,
          avg: 2,
          n2: 2,
          avg2: 2,
        },
        {
          fag: 'Matematik',
          niveau: "A med et gennemsnit på minimum 2,0 eller matematik B med et gennemsnit på minimum 7,0",
          n: 3, 
          avg: 2,
          n2: 2,
          avg2: 7,
        },
      ],
      adgangskravKand: [],
    },
    {
      name: "Medialogy - Aalborg - Kandidat",
      code: "Medialogy, Kandidat",
      students: 248,
      degree: "master",
      interests: ["Fysik"],
      adgangskravKand: ["Medialogi","Bachelor of Science (BSc) in Engineering (Electronic Engineering)"],
      adgangskravBach: [],
    },
  ];

  const options = [
    { value: "alpha", label: "A-Å" },
    { value: "noalpha", label: "Å-A" },
    { value: "popularity", label: "Popularitet" },
  ];

  const interests = [
    { value: "Matematik", label: "Matematik" },
    { value: "Fysik", label: "Fysik" },
    { value: "Programmering", label: "Programmering" },
  ];

  const degreeOptions = [
    { value: "all", label: "Alle uddannelser" },
    { value: "bachelor", label: "Bachelor uddannelser" },
    { value: "master", label: "Kandidat uddannelser" },
  ];

  const availableOptions = [
    { value: "all", label: "Alle uddannelser (også dem hvor du ikke opfylder adgangskrav" },
    { value: "available", label: "Uddannelser hvor du opfylder alle optagelsekrav" },
  ];

  useEffect(() => { 
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect (() => {
    if (user) {
      const db = getDatabase();
      const diplomaRef = ref(db, `users/${user.uid}/diploma/`);
      const diplomaRefBachelor = ref(db, `users/${user.uid}/diploma/highSchoolDiploma`);

      get(child(diplomaRef, "bachelorTitel")).then((snapshot) => {
        if (snapshot.exists()) {
          const value = snapshot.val();
          if (value) {
            setUserBachelor(value);        
          }
        } 
      });
      
      onValue(diplomaRefBachelor, (snapshot) => {
        const firebaseData = snapshot.val();
        if (firebaseData) {  
          const bachelorData = data.filter(item => item.degree === 'bachelor');
          const dataSet = bachelorData.map(({ adgangskravBach, name }) => ({ adgangskravBach, name }));

          for (const index of dataSet) {
            const matchingData = index.adgangskravBach.map(subject => {
              const filteredData = firebaseData.filter((item: { fag: string;}) => item.fag === subject.fag);
              const dataN = filteredData.map((item: {n: number}) => [item.n]).flat();
              const sumN = dataN.reduce((total: number, num: number) => total + num, 0);
              const averageN = sumN / dataN.length;
              const mappedData = filteredData.map((item: { årsKarakter: number; prøveKarakter: number; }) => [item.årsKarakter, item.prøveKarakter]).flat();
              const noUndefined = mappedData.filter((item: number) => item !== undefined);
              const sum = noUndefined.reduce((total: number, num: number) => total + num, 0);
              const average = sum / noUndefined.length;
              return {
                fag: subject.fag,
                n: averageN,
                avg: average,
              };
            });

            const allExist = index.adgangskravBach.every(subject => (
              matchingData.some((item: any) => (
                (item.fag === subject.fag && item.n >= subject.n && item.avg >= subject.avg) || (item.fag === subject.fag && item.n >= subject.n2 && item.avg >= subject.avg2 )  
              ))
            ));

            if (allExist && !userHigh.includes(index.name)) {
              userHigh.push(index.name);
            }
          }
        } 
      });
    }
  }, [user]);


  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const query = event.target.value;
    setSearchQuery(query);
  };

  const handleSortChange = (selectedOption: any) => {
    setSortOption(selectedOption.value);
  };

  const handleDegreeChange = (selectedOption: any) => {
    setSelectedDegree(selectedOption.value);
  };

  const handleInterestChange = (selectedInterests: any) => {
    const selectedInterestValues = selectedInterests.map((interest: any) => interest.value);
    setSelectedInterests(selectedInterestValues);
  };

  const handleAvailableChange = (selectedOption: any) => {
    setSelectedAvailable(selectedOption.value);
  };

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAndSortedData = [...filteredData].filter((item) => {
    if (selectedDegree === "all") {
      return true;
    } else {
      return item.degree === selectedDegree;
    }
  }).filter((item) => {
    if (selectedInterests.length === 0) {
      return true;
    } else {
      return selectedInterests.some((interest) => item.interests.includes(interest));
    }
  }).filter((item) => {
    if (selectedAvailable === "all") {
      return true
    } else if (selectedAvailable === "available") {
      return item.adgangskravKand.includes(userBachelor) || userHigh.includes(item.name);
    } 
  });

  const sortedFilteredData = filteredAndSortedData.sort((a, b) => {
    if (sortOption === "alpha") {
      return a.name.localeCompare(b.name);
    } else if (sortOption === "popularity") {
      return b.students - a.students;
    } else {
      return b.name.localeCompare(a.name);
    }
  });

  return (
    <div
      style={{
        width: "90%",
        height: "100%",
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}
    >
      <div style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "10%",
            marginTop: "1%",
          }}
        >
          <div className="search-container">
            <input
              type="text"
              placeholder="Søg..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              className="search-input"
              style={{ outline: "none" }}
            />
          </div>
          <Select
            className="select-sort"
            options={options}
            defaultValue={options[0]}
            onChange={handleSortChange}
            styles={{
              control: (provided) => ({
                ...provided,
                borderColor: "black",
                "&:hover": {
                  borderColor: "black",
                },
              }),
            }}
          />
        </div>
        <div className="filter-container">
          <div className="filter-box">
            <Select
              className="filter"
              options={degreeOptions}
              defaultValue={degreeOptions[0]}
              onChange={handleDegreeChange}
              styles={{
                control: (provided) => ({
                  ...provided,
                  borderColor: "black",
                  "&:hover": {
                    borderColor: "black",
                  },
                }),
              }}
            />
            <Select
              className="filter"
              options={interests}
              onChange={handleInterestChange}
              isMulti
              placeholder="Interesser"
              styles={{
                control: (provided) => ({
                  ...provided,
                  borderColor: "black",
                  "&:hover": {
                    borderColor: "black",
                  },
                }),
              }}
            />
            <Select
              className="filter"
              options={availableOptions}
              defaultValue={availableOptions[0]}
              onChange={handleAvailableChange}
              styles={{
                control: (provided) => ({
                  ...provided,
                  borderColor: "black",
                  "&:hover": {
                    borderColor: "black",
                  },
                }),
              }}
            />  
          </div>
        </div>
      </div>
      <div
        style={{
          width: "100%",
          margin: "auto",
          display: "flex",
          padding: "0px",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "-42px"
        }}
      >
      {sortedFilteredData.length === 0 ? (
        <h2 style={{marginTop:"15%"}}>Beklager ingen uddannelser matcher din søgning</h2>
      ) : (
        <ul style={{ listStyle: "none", width: "100%", padding: "0%" }}>
          {sortedFilteredData.map((item, index) => (
            <li key={index} style={{ width: "100%", marginBottom: "1%" }}>
              <a href={item.code} style={{ width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    textAlign: "left",
                    width: "98%",
                    backgroundColor: "rgb(239, 239, 239",
                    color: "rgb(75, 75, 75)",
                    padding: "1%",
                    borderRadius: "8px",
                  }}
                >
                  <p
                    style={{
                      width: "90%",
                      height: "100%",
                      fontSize: "25px",
                      marginLeft: "2%",
                    }}
                  >
                    {item.name}
                  </p>
                  <div
                    style={{
                      width: "10%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={ArrowLink}
                      alt="Arrow"
                      style={{ width: "40%" }}
                    />
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
      </div>
    </div>
  );
}

export default SearchPage;

