import React, { useEffect, useState } from "react";
import { ApiDetail } from "../utils/schema";
import { useParams } from "react-router-dom";
import axios from "axios";

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
    <>{apiDetail === undefined ? <div></div> : <div>{apiDetail.title}</div>}</>
  );
};

export default ApiServiceDetail;
