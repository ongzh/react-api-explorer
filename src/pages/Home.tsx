import React from "react";
import "./Home.css";
const ExploreButton: React.FC = () => {
  return (
    <button
      className="explore-btn"
      onClick={() => {
        console.log("Explore button clicked!");
      }}
    >
      Explore web APIs
    </button>
  );
};
const Home: React.FC = () => {
  return (
    <div className="home-container">
      <ExploreButton />
    </div>
  );
};

export default Home;
