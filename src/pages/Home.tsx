import React, { useEffect, useState } from "react";
import "./Home.css";
import axios from "axios";
import { FaAngleDown } from "react-icons/fa";
import { ApiDisplay } from "../utils/schema";
import { Link, useLocation } from "react-router-dom";

const Home: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [apiProviders, setApiProviders] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [buttonWidth, setButtonWidth] = useState<number>(0);
  const location = useLocation();

  useEffect(() => {
    if (location.state !== null) {
      setIsSidebarOpen(location.state.isSidebarOpen);
    }
  }, [location.state]);

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

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsAnimating(false);
    }, 3000);
    return () => {
      clearTimeout(timeout);
      console.log(isAnimating);
    };
  }, [isAnimating]);

  const handleButtonRef = (ref: HTMLButtonElement | null) => {
    if (ref) {
      setButtonWidth(ref.offsetWidth);
    }
  };

  const toggleExploreButton = () => {
    setIsAnimating(true);
    setIsSidebarOpen(true);
  };

  const toggleOverlay = () => {
    setIsAnimating(false);
    setIsSidebarOpen(false);
  };

  return (
    <>
      <div className="home-container">
        <ExploreButton
          toggleExploreButton={toggleExploreButton}
          handleButtonRef={handleButtonRef}
        />
        {isSidebarOpen && (
          <div
            className={`overlay-shadow ${isAnimating ? "" : "fixed"}`}
            onClick={toggleOverlay}
          />
        )}
        {isSidebarOpen && (
          <div
            className={`sidebar ${isAnimating ? "" : "fixed"}`}
            style={{ width: `calc(50vw - ${buttonWidth / 2}px)` }}
          >
            <Sidebar apiProviders={apiProviders} />
          </div>
        )}
      </div>
    </>
  );
};

const ExploreButton: React.FC<{
  toggleExploreButton: () => void;
  handleButtonRef: (ref: HTMLButtonElement) => void;
}> = ({ toggleExploreButton, handleButtonRef }) => {
  return (
    <button
      className="explore-btn"
      ref={handleButtonRef}
      onClick={toggleExploreButton}
    >
      Explore web APIs
    </button>
  );
};

const Sidebar: React.FC<{ apiProviders: string[] }> = ({ apiProviders }) => {
  return (
    <>
      <h1 className="sidebar-title">Select Provider</h1>
      <div className="sidebar-list-container">
        {apiProviders.map((provider) => (
          <ApiProvider key={provider} provider={provider} />
        ))}
      </div>
    </>
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
            ? "api-provider-container toggle-color"
            : "api-provider-container"
        }
      >
        <button className="api-provider" onClick={toggleDropdown}>
          <span style={{ overflow: "hidden" }}>{provider}</span>
          <span
            className={`dropdown-toggle-logo ${
              isToggleOpen ? "toggle-open" : ""
            }`}
          >
            {<FaAngleDown />}
          </span>
        </button>
        {isToggleOpen && <ApiServiceList availableApis={availableApis} />}
      </div>
    </div>
  );
};
//list of api service within each provider
const ApiServiceList: React.FC<{ availableApis: ApiDisplay[] }> = ({
  availableApis,
}) => {
  return (
    <div className="api-list">
      {availableApis.map((apiDisplay) => (
        <Link
          className="api-provided"
          to={
            apiDisplay.service !== undefined
              ? `/apiDetails/${apiDisplay.provider}/${apiDisplay.service}`
              : `/apiDetails/${apiDisplay.provider}`
          }
          key={apiDisplay.service}
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

export default Home;
