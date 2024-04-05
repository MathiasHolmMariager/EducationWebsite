import React, { useState } from "react";

function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    console.log("Previous state:", dropdownOpen);
    setDropdownOpen(prevState => !prevState);
  };

  return (
    <div>
      <img
        style={{
          width: "40px",
          height: "40px",
          marginRight: "40px",
          cursor: "pointer",
        }}
        onClick={toggleDropdown}
        alt="Profile"
      />
      {dropdownOpen && <div>Dropdown content</div>}
    </div>
  );
}

export default Header;