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
        const url = response.url;

        // Construct target origin using the origin of the dynamic URL
        const targetOrigin = new URL(url).origin;

        setIframeUrl(url);

        // Construct the new URL by appending the iframe URL with a hash
        const currentUrl = window.location.href;
        const newUrl = `${currentUrl}#${url}`;
        window.history.pushState(null, "", newUrl);

        // Delay sending the message to ensure event listener is set up
        setTimeout(() => {
          // Send a message to the iframe with the constructed target origin
          const iframe = document.getElementById("edit-iframe");
          if (iframe) {
            console.log("Sending message:", {
              type: "onEditVideo",
              url,
            });
            iframe.contentWindow.postMessage(
              { type: "onEditVideo", url },
              targetOrigin
            );
          }
        }, 100);
      } else {
        showError("Error editing video!");
      }
    } catch (error) {
      showError("Error editing video: " + error.message);
    }
  };

  useEffect(() => {
    const handlePopstate = () => {
      // Check if the hash exists in the URL
      const hash = window.location.hash.substring(1); // Remove the '#' character
      if (!hash) {
        // Hide the iframe if the hash is empty
        setIframeUrl("");
      }
    };

    const handlePageLoad = () => {
      // Check if the hash exists in the URL during page load
      const hash = window.location.hash.substring(1); // Remove the '#' character
      if (hash) {
        // Remove the hash from the URL
        const urlWithoutHash = window.location.href.split("#")[0];
        window.history.replaceState(null, "", urlWithoutHash);

        // Hide the iframe
        setIframeUrl("");
      }
    };

    // Add event listeners for popstate and page load
    window.addEventListener("popstate", handlePopstate);
    window.addEventListener("load", handlePageLoad);

    return () => {
      // Remove event listeners on component unmount
      window.removeEventListener("popstate", handlePopstate);
      window.removeEventListener("load", handlePageLoad);
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
