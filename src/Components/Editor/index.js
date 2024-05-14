import React, { Fragment, useEffect, useRef, useState } from "react";
import { Box, Button, Grid } from "@mui/material";
import { VideoEditor } from "../../VideoEditor";

const Editor = ({ editorUrl, onError }) => {
  const editorContainerRef = useRef(null);
  const [videoEditor, setVideoEditor] = useState(null);
  const [accessTokenIntervalId, setAccessTokenIntervalId] = useState(null);

  useEffect(() => {
    return () => {
      if (accessTokenIntervalId) {
        clearInterval(accessTokenIntervalId);
      }
      videoEditor.close();
    }
  }, []);

  useLayoutEffect(() => {
    let videoEditor = new VideoEditor(editorContainerRef.current, editorUrl);
    videoEditor.onReady = onVideoEditorReady;
    setVideoEditor(videoEditor);

  }, []);

  onVideoEditorReady = () => {
    let intervalId = setInterval(updateAccessToken, 180000);
    setAccessTokenIntervalId(intervalId);
    console.log("Video Editor is Ready");
  }

  updateAccessToken = async () => {
    let accessToken = null;
    //Get access token
    await videoEditor.setAccessToken(accessToken);

  }

  return <Box sx={{ display: "flex", height: "100%", width: "100%", flexDirection: "column", boxSizing: "border-box" }} ref={editorContainerRef}>
  </Box>
};

export default Editor;
