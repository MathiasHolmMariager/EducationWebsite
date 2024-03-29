import React, { useState } from 'react';
import './search_page.css';
import Select from 'react-select'

interface SearchProps {
  data: string[];
}

const Search: React.FC<SearchProps> = ({ data }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showResults, setShowResults] = useState<boolean>(false);

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    setShowResults(query.trim().length > 0);
  };

  const filteredData = data.filter(item =>
    item.toLowerCase().includes(searchQuery.toLowerCase())
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
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const options = [
  { value: 'a-å', label: 'A-Å' },
  { value: 'å-a', label: 'Å-A' },
  { value: 'popularitet', label: 'Popularitet' }
]

const interests = [
  { value: 'matematik', label: 'Matematik' },
  { value: 'fysik', label: 'Fysik' },
  { value: 'programmering', label: 'Programmering' }
]

function SearchPage() {
  const data = [
    'Interaktionsdesign - Aalborg - Bachelor', 
    'Software - Aalborg - Bachelor', 
    'Computer science (Int) - Aalborg - Kandidat', 
    'Interaktionsdesign - Aalborg - Kandidat', 
    'Uddannelse 5 - Esbjerg - Bachelor'];
  
  return (
    <div>
      <Search data={data} />
      <div className='filter-container'>
          <Select className='select-sort' options={options} placeholder='Sorter efter:'/>
        <div className='filter-box'>
          <Select className='filter' options={interests} isMulti placeholder='Interesser'/>
          <Select className='filter' options={interests} isMulti placeholder='Interesser'/>
          <Select className='filter' options={interests} isMulti placeholder='Interesser'/>
        </div>
      </div>
    </div>
  );
}

export default SearchPage;