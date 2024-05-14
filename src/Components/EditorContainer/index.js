import React, { Fragment, useEffect, useState } from "react";
import ApiService from "../../Services/apiService";
import useErrorHandler from "../../Utils/errorHandler";
import Video from "../Video";
import Editor from "../Editor";
import Error from "../Error";
import { API } from "../../Constants";

const EditorContainer = () => {
  const [showEditor, setShowEditor] = useState(false);
  const { error, showError, handleClose } = useErrorHandler();

  onEditClicked = () => {
    setShowEditor(true);
  }

  return (
    <Fragment>
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
