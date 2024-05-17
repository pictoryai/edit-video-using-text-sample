import React, { Fragment, useEffect, useState } from "react";
import useErrorHandler from "../../utils/errorHandler";
import Video from "../Video";
import Editor from "../Editor";
import Error from "../Error";
import Loader from "../Loader";
import API from '../../services/API'

const EditorContainer = () => {
  const [showEditor, setShowEditor] = useState(true);
  const { error, showError, handleClose } = useErrorHandler();
  const [editorUrl, setEditorUrl] = useState("http://localhost:3000/e98ee536-a695-4164-8133-3fff941565cc?user=edtechuser&expires=20240517014806&authorization=eyJraWQiOiJlM1U2N01NQ3hwNTVWak12dVwvMEp2bmxaOFJPRm5RVlFPYkRIS0ZtTmdFcz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ1ZHE3anRkMmx2Nm5nbXRjMXRkMXF1NWJ1IiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJwaWN0b3J5YXBpc1wvcGljdG9yeWFwaXMucmVhZCBwaWN0b3J5YXBpc1wvcGljdG9yeWFwaXMud3JpdGUiLCJhdXRoX3RpbWUiOjE3MTU5MDMyODQsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTIuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0yX2RVNGE5MDN0USIsImV4cCI6MTcxNTkwNjg4NCwiaWF0IjoxNzE1OTAzMjg0LCJ2ZXJzaW9uIjoyLCJqdGkiOiJlY2U4ZTE5MS1hYTFjLTQ1ZTktOGEwZS1iMzVmZTBjYzMxODQiLCJjbGllbnRfaWQiOiJ1ZHE3anRkMmx2Nm5nbXRjMXRkMXF1NWJ1In0.mBguQWBWtwKploYQ1VmNB1ySQ0g6jqN1k7SOVrqlW_WbmPmknSLYKJMdyWZCfzIY9inZKxHQelQaCg2dvYgXzV5pJWmSKMh8LNvL-in9QWPRJKQ-mr7cPXRymxWQ0v6402jKZcOPSBbmWcKJzaNxgWJVE-fOvsN0Cbxzql_O5FICMsdCB2OVatTFqoAo8TjJ1-jb1OzkadDhffEtgipMhVPBXoFCF9tULFMLEGJnIzwxfavlPaN7APzB-FLDQ_juJhCVXR41V7KBR6QqsTzVve-biIiQw_r1QfKMu5UPMuxD51hGCMynM25N7Adhmt30c5NPLUOPPZQM_8XfCf5QuQ&date=20240516T234806Z&signature=1c8b14025c61b92e8b2fd5ce7ca21b72a71347353d9fdf20c1ad9d810b5d64d2");
  const [showLoader, setShowLoader] = useState(false);

  const onEditClicked = async (videoUrl) => {
    try {
      setShowLoader(true);
      const { jobId } = await API.transcribeVideo(videoUrl);
      const editVideoUrl = await API.getTranscriptionResponse(jobId);
      setShowLoader(false);
      setShowEditor(true);
      setEditorUrl(editVideoUrl);
    }
    catch (error) {
      showError(error.message);
    }
  }

  return (
    <Fragment>
      <Loader show={showLoader}></Loader>
      {
        showEditor
          ?
          <Editor onError={showError} editorUrl={editorUrl}></Editor>
          :
          <Video onEdit={onEditClicked} />
      }
      <Error open={error !== null} handleClose={handleClose} message={error} />
    </Fragment>
  );
};

export default EditorContainer;
