import React, { Fragment, useEffect, useState } from "react";
import useErrorHandler from "../../utils/errorHandler";
import Video from "../Video";
import Editor from "../Editor";
import Error from "../Error";
import Loader from "../Loader";
import API from '../../services/API'

const EditorContainer = () => {
  const [showEditor, setShowEditor] = useState(false);
  const { error, showError, handleClose } = useErrorHandler();
  const [showLoader, setShowLoader] = useState(false);

  const onEditClicked = async (videoUrl) => {
    const { jobId } = await API.transcribeVideo(videoUrl);
    setShowLoader(true);
    const editVideoUrl = await API.getTranscriptionResponse(jobId);
    setShowLoader(false);
  }

  return (
    <Fragment>
      <Loader show={showLoader}></Loader>
      {
        showEditor
          ?
          <Editor onError={showError} ></Editor>
          :
          <Video onEdit={onEditClicked} />
      }
      <Error open={error !== null} handleClose={handleClose} message={error} />
    </Fragment>
  );
};

export default EditorContainer;
