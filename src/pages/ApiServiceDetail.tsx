import React, { useEffect, useState } from "react";
import { ApiDetail } from "../utils/schema";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ApiServiceDetail.css";

const ApiServiceDetail: React.FC = () => {
  const [apiDetail, setApiDetail] = useState<ApiDetail>();

  const { provider, apiService } = useParams<{
    provider: string;
    apiService: string;
  }>();

  useEffect(() => {
    const fetchApiDetail = async () => {
      try {
        axios
          .get(`https://api.apis.guru/v2/${provider}.json`)
          .then((response) => {
            console.log(provider, apiService);
            if (apiService !== undefined) {
              const api = response.data.apis[`${provider}:${apiService}`];
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
            }
          });
      } catch (error) {
        console.error(error);
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
  return (
    <div>
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
        <div className="service-detail-section">
          <h2 className="service-detail-header">Description</h2>
          <span>{apiDetail.description}</span>
        </div>
        <div className="service-detail-section">
          <h2 className="service-detail-header">Swagger</h2>
          <span>{apiDetail.swaggerUrl}</span>
        </div>
        <div className="service-detail-section">
          <h2 className="service-detail-header">Contact</h2>

          <div>
            <h3 className="contact-info-header">Email</h3>
            <span>{apiDetail.contact.email}</span>
          </div>
          <div>
            <h3 className="contact-info-header">Name</h3>
            <span>{apiDetail.contact.name}</span>
          </div>
          <div>
            <h3 className="contact-info-header">Url</h3>
            <span>{apiDetail.contact.url}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ApiServiceDetail;
