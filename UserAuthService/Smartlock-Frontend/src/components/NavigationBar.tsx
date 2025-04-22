import { useNavigate } from "react-router-dom";

export default function NavigationBar(props: any) {
  const navigate = useNavigate();
  const getUsernameFromMessage = (msg: string) => {
    try {
      const parts = msg.split(",");
      if (parts.length < 2) return msg;
      const email = parts[1].trim();
      return email.split("@")[0];
    } catch (e) {
      return msg;
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("token");
    navigate("/login", { state: { message: "Logout successful!" } });
  };
  return (
    // home page
    // lock and unlock page.
    // logs page
    // username
    // logout button
    <div className="main-nav">
      <div className="nav-buttons">
        <button>Home</button>
        <button>Lock & Unlock</button>
        <button>Logs</button>
      </div>
      <nav className="nav-logout">
        <h2>{getUsernameFromMessage(props.message)}</h2>
        <button onClick={handleLogout}>Logout</button>
      </nav>
    </div>
  );
}
