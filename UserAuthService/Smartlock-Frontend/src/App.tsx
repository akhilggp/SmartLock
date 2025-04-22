import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home"; // Assuming you have a Home component

function App() {
  return (
    <Router>
      <div className="auth-container">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />{" "}
          {/* Redirect root to login */}
          <Route path="/login" element={<Login />} />{" "}
          {/* Login component at /login */}
          <Route path="/register" element={<Register />} />{" "}
          {/* Register component at /register */}
          <Route path="/home" element={<Home />} />{" "}
          {/* Home component at /home */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
