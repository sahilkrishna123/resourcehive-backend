import { useNavigate } from "react-router-dom";
import "../pages/css/homepage/HomePage.css"; 
import TypingText from "../components/TypingText";
import { useEffect } from "react";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Remove the token from localStorage
    localStorage.removeItem("token");

    // 2. Push current state to history
    window.history.pushState(null, "", window.location.href);

    // 3. Prevent going back
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handlePopState);

    // 4. Clean up when component unmounts
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return (
    <div
      className="homepage-container"
      style={{
        backgroundImage: `url("/RH-IMAGE.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="typing-text-container">
        <TypingText />
      </div>

      <div className="homepage-buttons">
        <button onClick={() => navigate("/signin")} className="button-style">
          Sign In
        </button>
        <button onClick={() => navigate("/signup")} className="button-style">
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default HomePage;
