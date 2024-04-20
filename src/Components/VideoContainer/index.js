import React, { Fragment, useEffect, useState } from "react";
import ApiService from "../../Services/apiService";
import useErrorHandler from "../../Utils/errorHandler";
import Video from "../Video";
import Error from "../Error";
import { API } from "../../Constants";

const VideoContainer = () => {
  const [iframeUrl, setIframeUrl] = useState("");
  const { error, showError, handleClose } = useErrorHandler();

  const handleEdit = async () => {
    try {
      // Simulating API call to get dynamic URL with query params
      const response = await ApiService.get(API.GET_EDIT_URL);
      if (response?.url) {
        setIframeUrl(response.url);
      } else {
        showError("Error editing video!");
      }
    } catch (error) {
      showError("Error editing video: " + error.message);
    }
  };

  useEffect(() => {
    const handlePageLoad = () => {
      setIframeUrl("");
    };

    window.addEventListener("load", handlePageLoad);

    return () => {
      // Remove event listeners on component unmount
      window.removeEventListener("load", handlePageLoad);
    };
  }, []);

  const handleMessage = (event) => {
    if (event.data && event.data.type === "parentLoaded") {
      console.log(
        "Received onload message from parent app with URL:",
        event.data
      );

      if (iframeUrl) {
        // Construct target origin using the origin of the dynamic URL
        const targetOrigin = new URL(iframeUrl).origin;

        const iframe = document.getElementById("edit-iframe");
        if (iframe) {
          console.log("Sending message:", {
            type: "onEditVideo",
            iframeUrl,
          });
          iframe.contentWindow.postMessage(
            { type: "onEditVideo", iframeUrl },
            targetOrigin
          );
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <Fragment>
      <Video onEdit={handleEdit} iframeUrl={iframeUrl} />
      <Error open={error !== null} handleClose={handleClose} message={error} />
    </Fragment>
  );
};

export default VideoContainer;
