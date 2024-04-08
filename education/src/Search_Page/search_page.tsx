import React, { useState } from "react";
import "./search_page.css";
import Select from "react-select";
import { Link } from "react-router-dom";

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
          <ul>
            {filteredData.map((item, index) => (
              <li key={index}>
                <Link to={`/${item.code}`}>{item.name}</Link>
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
    { name: "Interaktionsdesign - Aalborg - Bachelor", code: "study" },
    {
      name: "Software - Aalborg - Bachelor",
      code: "nopage",
    },
    {
      name: "Computer science (Int) - Aalborg - Kandidat",
      code: "nopage",
    },
    {
      name: "Interaktionsdesign - Aalborg - Kandidat",
      code: "nopage",
    },
    {
      name: "Uddannelse 5 - Esbjerg - Bachelor",
      code: "nopage",
    },
  ];

  return (
    <div className="container">
      <Search data={data} />
      <div className="filter-container">
        <Select
          className="select-sort"
          options={options}
          placeholder="Sorter efter:"
        />
        <div className="filter-box">
          <Select
            className="filter"
            options={interests}
            isMulti
            placeholder="Interesser"
          />
          <Select
            className="filter"
            options={interests}
            isMulti
            placeholder="Interesser"
          />
          <Select
            className="filter"
            options={interests}
            isMulti
            placeholder="Interesser"
          />
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
