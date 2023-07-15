import React, { useEffect, useState } from "react";
import { ApiDetail } from "../utils/schema";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/ApiServiceDetail.css";

const ApiServiceDetail: React.FC = () => {
  const [apiDetail, setApiDetail] = useState<ApiDetail>();

  const { provider, apiService } = useParams<{
    provider: string;
    apiService: string;
  }>();

  useEffect(() => {
    const fetchApiDetail = () => {
      try {
        axios
          .get(`https://api.apis.guru/v2/${provider}.json`)
          .then((response) => {
            console.log(provider, apiService);
            const api =
              apiService === undefined
                ? response.data.apis[`${provider}`]
                : response.data.apis[`${provider}:${apiService}`];
            console.log(response);
            console.log(api);
            const apiDetail: ApiDetail = {
              title: api.info.title,
              image: api.info["x-logo"].url, // api.x-logo.url
              description: api.info.description,
              swaggerUrl: api.swaggerUrl,
              contact: api.info.contact,
            };

            setApiDetail(apiDetail);
          });
      } catch (error) {
        console.error(error);
        alert("Error fetching API details");
      }
    };
    fetchApiDetail();
  }, [provider, apiService]);

  console.log(apiService);

  return (
    <>
      {apiDetail === undefined ? (
        <div></div>
      ) : (
        <ApiDetailDisplay apiDetail={apiDetail} />
      )}
    </>
  );
};

const ApiDetailDisplay: React.FC<{ apiDetail: ApiDetail }> = ({
  apiDetail,
}) => {
  const navigate = useNavigate();

  const handleExploreMoreClick = () => {
    navigate("/", { state: { isSidebarOpen: true } });
  };
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <h1 className="api-service-header">
        <img
          src={apiDetail.image}
          alt=""
          aria-label="api service image"
          style={{ height: "7rem", marginRight: "0.5rem" }}
        />
        {apiDetail.title}
      </h1>
      <div className="service-detail-container">
        <ServiceDetailDisplay
          serviceDetailInfo={apiDetail.description}
          serviceDetailType="Description"
        />
        <ServiceDetailDisplay
          serviceDetailInfo={apiDetail.swaggerUrl}
          serviceDetailType="Swagger"
        />

        {/*not all api have contact field */}
        {apiDetail.contact !== undefined && (
          <div className="service-detail-section">
            <h2 className="service-detail-header">Contact</h2>

            {apiDetail.contact.email !== undefined && (
              <ContactDetailDisplay
                contactFieldInfo={apiDetail.contact.email}
                contactFieldType="Email"
              />
            )}

            {apiDetail.contact.name !== undefined && (
              <ContactDetailDisplay
                contactFieldInfo={apiDetail.contact.name}
                contactFieldType="Name"
              />
            )}

            {apiDetail.contact.url !== undefined && (
              <ContactDetailDisplay
                contactFieldInfo={apiDetail.contact.url}
                contactFieldType="Url"
              />
            )}
          </div>
        )}
      </div>

      <div className="explore-btn-container">
        <button
          className="explore-btn"
          onClick={() => handleExploreMoreClick()}
        >
          Explore More APIs
        </button>
      </div>
    </div>
  );
};

const ServiceDetailDisplay: React.FC<{
  serviceDetailInfo: string;
  serviceDetailType: string;
}> = ({ serviceDetailInfo, serviceDetailType }) => {
  return (
    <div className="service-detail-section">
      <h2 className="service-detail-header">{serviceDetailType}</h2>
      <span>{serviceDetailInfo}</span>
    </div>
  );
};

const ContactDetailDisplay: React.FC<{
  contactFieldInfo: string;
  contactFieldType: string;
}> = ({ contactFieldInfo, contactFieldType }) => {
  return (
    <div>
      <h3 className="contact-info-header">{contactFieldType}</h3>
      <span>{contactFieldInfo}</span>
    </div>
  );
};

export default ApiServiceDetail;
