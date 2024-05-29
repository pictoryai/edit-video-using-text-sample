import React, { Fragment, useEffect, useRef, useState, useLayoutEffect } from "react";
import { Box, Button, Grid } from "@mui/material";
import { VideoEditor } from "../../videoEditor";
import API from '../../services/API';
import Loader from "../Loader";

const RENDER_WEBHOOK = "https://webhook.site/4f88f3a7-a10c-4bb3-a2d8-00efd6d76754";

const brands = [
  {
    "button": {
      "downloadVideo": {
        "visible": false
      },
      "notificationBell": {
        "visible": false
      }
    },
    "color": {
      "primary": {
        "contrastText": "#dbff26",
        "dark": "#940b01",
        "light": "#f59089",
        "main": "#f02011"
      }
    },
    "font": {
      "family": "Party Confetti",
      "format": "truetype",
      "url": "https://pictory-static.pictorycontent.com/static/fonts/Party_Confetti/Party_Confetti.ttf"
    }
  }
]

const Editor = ({ editorUrl, onError }) => {
  const editorContainerRef = useRef(null);
  const [videoEditor, setVideoEditor] = useState(null);
  const [accessTokenIntervalId, setAccessTokenIntervalId] = useState(null);
  const [showLoader, setShowLoader] = useState(true);

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
    let editor = new VideoEditor(editorContainerRef.current, editorUrl, {
      branding: brands[0]
    });
    editor.onReady = onVideoEditorReady;
    editor.onLoaded = onVideoEditorLoaded;
    editor.onError = onVideoEditorErrored;
    editor.onVideoRenderJobSchedule = onVideoRenderJobSchedule;
    setVideoEditor(editor);
  }, []);

  const onVideoEditorReady = async (editor) => {
    setShowLoader(false);
  }

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

  return <>
    <Loader show={showLoader}></Loader>
    <Box sx={{ display: "flex", height: "100%", width: "100%", flexDirection: "column", boxSizing: "border-box" }} ref={editorContainerRef}>
    </Box>
  </>
};

export default Editor;
