import React from "react";
import { TypeAnimation } from "react-type-animation";
import "../components/css/TypingText.css"; // Import CSS

const TypingText = () => {
  return (
    <div className="typing-container">
      <TypeAnimation
        sequence={[
          "Welcome to Resource Hive🌐",
          1000,
          "AI Healthcare Solutions🏥",
          1000,
          "Equipment Monitoring✅",
          1000,
          "Explore Amazing Features🚀",
          1000,
        ]}
        wrapper="span"
        speed={50}
        repeat={Infinity}
      />
    </div>
  );
};

export default TypingText;
