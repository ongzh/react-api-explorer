import React, { useEffect, useState } from "react";
import "./Home.css";
import axios from "axios";
import { FaAngleUp, FaAngleDown } from "react-icons/fa";
import { ApiDisplay } from "../utils/schema";
import { Link } from "react-router-dom";

const ExploreButton: React.FC<{
  toggleExploreButton: () => void;
}> = ({ toggleExploreButton }) => {
  return (
    <button className="explore-btn" onClick={toggleExploreButton}>
      Explore web APIs
    </button>
  );
};

const Sidebar: React.FC<{ apiProviders: string[] }> = ({ apiProviders }) => {
  return (
    <div className="sidebar">
      <h1 className="sidebar-title">Select Provider</h1>
      <div
        style={{
          marginLeft: "4rem",
          marginRight: "4rem",
        }}
      >
        {apiProviders.map((provider) => (
          <ApiProvider key={provider} provider={provider} />
        ))}
      </div>
    </div>
  );
};

const ApiProvider: React.FC<{ provider: string }> = ({ provider }) => {
  const [availableApis, setAvailableApis] = useState<ApiDisplay[]>([]);
  const [isToggleOpen, setIsToggleOpen] = useState<boolean>(false);

  const toggleDropdown = () => {
    if (!availableApis.length) {
      const fetchAvailableApis = async () => {
        try {
          axios
            .get(`https://api.apis.guru/v2/${provider}.json`)
            .then((response) => {
              console.log(response.data.apis);

              for (const key in response.data.apis) {
                const api = response.data.apis[key];
                const apiDisplay: ApiDisplay = {
                  title: api.info.title,
                  image: api.info["x-logo"].url, // api.x-logo.url
                  provider: provider,
                  service: api.info["x-serviceName"],
                };
                setAvailableApis((prev) => [...prev, apiDisplay]);
              }
            });
        } catch (error) {
          console.error(error);
        }
      };
      fetchAvailableApis();
    }
    setIsToggleOpen(!isToggleOpen);
  };

  return (
    <div>
      <div
        className={
          isToggleOpen
            ? "api-provider-container toggled-color"
            : "api-provider-container"
        }
      >
        <div className="api-provider">
          {provider}
          <button className="dropdown-toggle" onClick={toggleDropdown}>
            {isToggleOpen ? <FaAngleUp /> : <FaAngleDown />}
          </button>
        </div>
        {isToggleOpen && <ApiList availableApis={availableApis} />}
      </div>
    </div>
  );
};

const ApiList: React.FC<{ availableApis: ApiDisplay[] }> = ({
  availableApis,
}) => {
  return (
    <div className="api-list">
      {availableApis.map((apiDisplay) => (
        <Link
          className="api-provided"
          to={`/apiDetails/${apiDisplay.provider}/${apiDisplay.service}`}
        >
          <img
            src={apiDisplay.image}
            alt=""
            style={{ height: "2.5rem", marginRight: "0.5rem" }}
            aria-label="api service image"
          />
          {apiDisplay.title}
        </Link>
      ))}
    </div>
  );
};

const Home: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [apiProviders, setApiProviders] = useState<string[]>([]);

  useEffect(() => {
    const fetchApiProviders = async () => {
      try {
        const response = await axios.get(
          "https://api.apis.guru/v2/providers.json"
        );
        setApiProviders(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchApiProviders();
  }, []);

  const toggleExploreButton = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <div className="home-container">
        <ExploreButton toggleExploreButton={toggleExploreButton} />
        {isSidebarOpen && (
          <div className="overlay-shadow" onClick={toggleExploreButton} />
        )}
        {isSidebarOpen && <Sidebar apiProviders={apiProviders} />}
      </div>
    </>
  );
};

export default Home;
