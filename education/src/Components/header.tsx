import home_icon from "../assets/home.png";
import search_icon from "../assets/search.png";
import chat_icon from "../assets/chat.png";
import profile_icon from "../assets/profile.png";

function Header() {
  return (
    <div
      style={{
        display: "flex",
        height: "60px",
        justifyContent: "space-between",
        alignItems: "center",
        width: "calc(100% + 16px)",
        backgroundColor: "rgb(33, 26, 82)",
        margin: "auto",
        marginTop: "-8px",
        marginLeft: "-8px",
      }}
    >
      <div>
        <a href="/">
          <img
            src={home_icon}
            style={{ width: "40px", height: "40px", marginLeft: "40px" }}
          />
        </a>
      </div>
      <div>
        <a href="/search">
          <img
            src={search_icon}
            style={{ width: "40px", height: "40px", marginRight: "40px" }}
          />
        </a>
        <a href="/">
          <img
            src={chat_icon}
            style={{ width: "43px", height: "43px", marginRight: "40px" }}
          />
        </a>
        <a href="/">
          <img
            src={profile_icon}
            style={{ width: "40px", height: "40px", marginRight: "40px" }}
          />
        </a>
      </div>
    </div>
  );
}

export default Header;
