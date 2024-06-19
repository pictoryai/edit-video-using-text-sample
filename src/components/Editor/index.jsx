import { Box } from "@mui/material";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import API from '../../services/API';
import { VideoEditor } from "../../videoEditor";
import Loader from "../Loader";

const RENDER_WEBHOOK = "https://webhook.site/4f88f3a7-a10c-4bb3-a2d8-00efd6d76754";

const themes = [
  {
    "button": {
      "downloadVideo": {
        "visible": false
      },
      "notificationBell": {
        "visible": false
      },
      "autoHighlight": {
        "visible": true
      }
    },
    "contextMenu": {
      "downloadVideo": {
        "visible": false,
      },
    },
    "tab": {
      "highlight": {
        "label": "My Highlights"
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
  },
  {
    "button": {
      "downloadVideo": {
        "visible": true
      },
      "notificationBell": {
        "visible": true
      },
      "autoHighlight": {
        "visible": false
      }
    },
    "contextMenu": {
      "downloadVideo": {
        "visible": true,
      },
    },
    "tab": {
      "highlight": {
        "label": "My Clips"
      }
    },
    "color": {
      "primary": {
        "contrastText": "#dbff26",
        "dark": "#022a66",
        "light": "#b3d1fc",
        "main": "#4f95ff"
      }
    },
    "font": {
      "family": "Party Confetti",
      "format": "truetype",
      "url": "https://pictory-static.pictorycontent.com/static/fonts/Party_Confetti/Party_Confetti.ttf"
    }
  },
  {
    "button": {
      "downloadVideo": {
        "visible": true
      },
      "notificationBell": {
        "visible": false
      },
      "autoHighlight": {
        "visible": true
      }
    },
    "contextMenu": {
      "downloadVideo": {
        "visible": false,
      },
    },
    "tab": {
      "highlight": {
        "label": "My Selected Clips"
      }
    },
    "color": {
      "primary": {
        "contrastText": "#dbff26",
        "dark": "#0b7801",
        "light": "#a4ff9c",
        "main": "#2cbf1f"
      }
    },
    "font": {
      "family": "Party Confetti",
      "format": "truetype",
      "url": "https://pictory-static.pictorycontent.com/static/fonts/Party_Confetti/Party_Confetti.ttf"
    }
  },
  {
    "button": {
      "downloadVideo": {
        "visible": false
      },
      "notificationBell": {
        "visible": true
      },
      "autoHighlight": {
        "visible": false
      }
    },
    "contextMenu": {
      "downloadVideo": {
        "visible": true,
      },
    },
    "tab": {
      "highlight": {
        "label": "My HSelected ighlights"
      }
    },
    "color": {
      "primary": {
        "contrastText": "#dbff26",
        "dark": "#9c9402",
        "light": "#fff98c",
        "main": "#a8a11b"
      }
    },
    "font": {
      "family": "Party Confetti",
      "format": "truetype",
      "url": "https://pictory-static.pictorycontent.com/static/fonts/Party_Confetti/Party_Confetti.ttf"
    }
  },
  {
    "button": {
      "downloadVideo": {
        "visible": false
      },
      "notificationBell": {
        "visible": false
      }
    },
    "contextMenu": {
      "downloadVideo": {
        "visible": true,
      },
    },
    "tab": {
      "highlight": {
        "label": "Highlights"
      }
    },
    "color": {
      "primary": {
        "contrastText": "#dbff26",
        "dark": "#6f0180",
        "light": "#ef95fc",
        "main": "#ab15c2"
      }
    },
    "font": {
      "family": "Party Confetti",
      "format": "truetype",
      "url": "https://pictory-static.pictorycontent.com/static/fonts/Party_Confetti/Party_Confetti.ttf"
    }
  },
  {
    "button": {
      "downloadVideo": {
        "visible": true
      },
      "notificationBell": {
        "visible": true
      }
    },
    "contextMenu": {
      "downloadVideo": {
        "visible": false,
      },
    },
    "tab": {
      "highlight": {
        "label": "Clips"
      }
    },
    "color": {
      "primary": {
        "contrastText": "#dbff26",
        "dark": "#04787a",
        "light": "#95eef0",
        "main": "#1ec4c7"
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
      theme: themes[Math.floor(Math.random() * themes.length)]
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
