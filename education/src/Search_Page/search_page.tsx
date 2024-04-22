import React, { useState } from "react";
import "./search_page.css";
import Select from "react-select";
import ArrowLink from "../assets/arrow.png";

interface DataItem {
  name: string;
  code: string;
  students: number;
  degree: string;
}

function SearchPage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("alpha");
  const [selectedDegree, setSelectedDegree] = useState<string>("all");

  const data: DataItem[] = [
    {
      name: "Interaktionsdesign - Aalborg - Bachelor",
      code: "Interaktionsdesign, Bachelor",
      students: 100,
      degree: "bachelor",
    },
    {
      name: "Computer science (It) - Aalborg - Kandidat",
      code: "nopage",
      students: 200,
      degree: "master",
    },
    {
      name: "Interaktionsdesign - Aalborg - Kandidat",
      code: "Interaktionsdesign, Kandidat",
      students: 123,
      degree: "master",
    },
    {
      name: "Informationsteknologi - Aalborg - Bachelor",
      code: "Informationsteknologi, Bachelor",
      students: 342,
      degree: "bachelor",
    },
    {
      name: "Medialogi - Aalborg - Bachelor",
      code: "Medialogi, Bachelor",
      students: 113,
      degree: "bachelor",
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

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAndSortedData = [...filteredData].filter((item) => {
    if (selectedDegree === "all") {
      return true;
    } else {
      return item.degree === selectedDegree;
    }
  });

  const sortedFilteredData = filteredAndSortedData.sort((a, b) => {
    if (sortOption === "alpha") {
      return a.name.localeCompare(b.name);
    } else if (sortOption === "popularity") {
      return b.students - a.students;
    } else {
      return a.name.localeCompare(b.name);
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
              options={interests}
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
                    backgroundColor: "rgba(100, 100, 100, 0.1)",
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

