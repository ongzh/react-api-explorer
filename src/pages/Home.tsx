import React, { useEffect, useState } from "react";
import "./Home.css";
import axios from "axios";
import { FaAngleUp, FaAngleDown } from "react-icons/fa";

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
      <div>
        {apiProviders.map((provider) => (
          <ApiProvider key={provider} provider={provider} />
        ))}
      </div>
    </div>
  );
};

interface ApiDetails {
  title: string;
  description: string;
  image: string;
  swaggerUrl: string;
  contact: ApiContact;
}

interface ApiContact {
  email?: string;
  url?: string;
  name?: string;
}

const ApiProvider: React.FC<{ provider: string }> = ({ provider }) => {
  const [availableApis, setAvailableApis] = useState<ApiDetails[]>([]);
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
                const apiDetails: ApiDetails = {
                  title: api.info.title,
                  description: api.info.description,
                  image: api.info["x-logo"].url, // api.x-logo.url
                  swaggerUrl: api.swaggerUrl,
                  contact: api.info.contact,
                };
                setAvailableApis((prev) => [...prev, apiDetails]);
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
    <div className="api-provider-container">
      <div className="api-provider">
        {provider}
        <button className="dropdown-toggle" onClick={toggleDropdown}>
          {isToggleOpen ? <FaAngleUp /> : <FaAngleDown />}
        </button>
      </div>
      {isToggleOpen && <ApiList availableApis={availableApis} />}
    </div>
  );
};

const ApiList: React.FC<{ availableApis: ApiDetails[] }> = ({
  availableApis,
}) => {
  const handleApiClick = () => {
    console.log("navigate to details page");
  };
  return (
    <div className="api-list">
      {availableApis.map((api) => (
        <div className="api-provided" onClick={handleApiClick}>
          <img
            src={api.image}
            alt=""
            style={{ height: "2.5rem", marginRight: "0.5rem" }}
          />
          {api.title}
        </div>
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
