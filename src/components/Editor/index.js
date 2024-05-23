import React, { Fragment, useEffect, useRef, useState, useLayoutEffect } from "react";
import { Box, Button, Grid } from "@mui/material";
import { VideoEditor } from "../../videoEditor";
import API from '../../services/API';

const RENDER_WEBHOOK = "https://webhook.site/4f88f3a7-a10c-4bb3-a2d8-00efd6d76754";

const Editor = ({ editorUrl, onError }) => {
  const editorContainerRef = useRef(null);
  const [videoEditor, setVideoEditor] = useState(null);
  const [accessTokenIntervalId, setAccessTokenIntervalId] = useState(null);

  useEffect(() => {
    return () => {
      if (accessTokenIntervalId) {
        clearInterval(accessTokenIntervalId);
      }
      if (videoEditor) {
        videoEditor.close();
      }
    }
  }, []);

  useLayoutEffect(() => {
    let editor = new VideoEditor(editorContainerRef.current, editorUrl);
    editor.onLoaded = onVideoEditorLoaded;
    editor.onError = onVideoEditorErrored;
    editor.onVideoRenderJobSchedule = onVideoRenderJobSchedule;
    setVideoEditor(editor);
  }, []);

  const onVideoEditorLoaded = async (editor) => {
    let intervalId = setInterval(updateAccessToken, 900000, editor); //15mins
    setAccessTokenIntervalId(intervalId);
    await editor.setWebhooks({ renderWebhook: RENDER_WEBHOOK });
  }

  const onVideoEditorErrored = (editor, error) => {
    onError && onError(error);
  }

  const updateAccessToken = async (editor) => {
    const { access_token } = await API.getToken();
    await editor.setAccessToken(access_token);
  }

  const onVideoRenderJobSchedule = async (editor, jobId) => {
    console.log(jobId);
  }

  return <Box sx={{ display: "flex", height: "100%", width: "100%", flexDirection: "column", boxSizing: "border-box" }} ref={editorContainerRef}>
  </Box>
};

export default Editor;
