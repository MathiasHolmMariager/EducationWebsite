import React, { useState } from "react";
import "./search_page.css";
import Select from "react-select";
import { Link } from "react-router-dom";
import ArrowLink from "../assets/arrow.png";

interface DataItem {
  name: string;
  code: string;
}

interface SearchProps {
  data: DataItem[];
}

const Search: React.FC<SearchProps> = ({ data }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showResults, setShowResults] = useState<boolean>(false);

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const query = event.target.value;
    setSearchQuery(query);
    setShowResults(query.trim().length > 0);
  };

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Søg..."
        value={searchQuery}
        onChange={handleSearchInputChange}
        className="search-input"
      />
      {showResults && (
        <div className="search-results">
          <ul style={{listStyle:"none", width:"124.7%", height:"100%"}}>
            {filteredData.map((item, index) => (
              <li key={index} style={{width:"100%", height:"100%", marginBottom:"10px", borderRadius:"8px"}}>
                <a href={item.code}>
                  <div style={{display:"flex", textAlign:"left" ,width:"calc(100% - 20px)", backgroundColor:"rgba(100, 100, 100, 0.1)", color:"rgb(75, 75, 75)", padding:"10px", borderRadius:"8px"}}>
                    <p style={{width:"93%", height:"100%", fontSize:"25px", marginLeft:"2%"}}>
                      {item.name}
                    </p>
                    <img src={ArrowLink} style={{width:"50px", height:"50px", marginTop:"20px"}}/>
                  </div>
                  
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const options = [
  { value: "a-å", label: "A-Å" },
  { value: "å-a", label: "Å-A" },
  { value: "popularitet", label: "Popularitet" },
];

const interests = [
  { value: "matematik", label: "Matematik" },
  { value: "fysik", label: "Fysik" },
  { value: "programmering", label: "Programmering" },
];

function SearchPage() {
  const data: DataItem[] = [
    { 
      name: "Interaktionsdesign - Aalborg - Bachelor", 
      code: "Interaktionsdesign, Bachlor"
    },
    {
      name: "Computer science (It) - Aalborg - Kandidat",
      code: "nopage",
    },
    {
      name: "Interaktionsdesign - Aalborg - Kandidat",
      code: "Interaktionsdesign, Kandidat",
    },
    {
      name: "Informationsteknologi - Aalborg - Bachelor",
      code: "Informationsteknologi, Bachlor",
    },
    {
      name: "Medialogi - Aalborg - Bachelor",
      code: "Medialogi, Bachlor",
    },
  ];

  return (
    <div className="container">
      <div style={{display:"flex", width:"100%", height:"10%", marginTop:"1%"}}>
        <Search data={data} />
        <Select
            className="select-sort"
            options={options}
            placeholder="Sorter efter:"
            styles={{control: (provided) => ({
              ...provided,
              borderColor: 'black',
              '&:hover': {
                borderColor: 'black',
              }
            })}}
          />
      </div>
      <div className="filter-container">
        <div className="filter-box">
          <Select
            className="filter"
            options={interests}
            isMulti
            placeholder="Interesser"
            styles={{control: (provided) => ({
              ...provided,
              borderColor: 'black',
              '&:hover': {
                borderColor: 'black',
              }
            })}}
          />
          <Select
            className="filter"
            options={interests}
            isMulti
            placeholder="Interesser"
            styles={{control: (provided) => ({
              ...provided,
              borderColor: 'black',
              '&:hover': {
                borderColor: 'black',
              }
            })}}
          />
          <Select
            className="filter"
            options={interests}
            isMulti
            placeholder="Interesser"
            styles={{control: (provided) => ({
              ...provided,
              borderColor: 'black',
              '&:hover': {
                borderColor: 'black',
              }
            })}}
          />
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
