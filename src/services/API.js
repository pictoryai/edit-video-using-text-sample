import axios from "axios";

const getToken = async () => {
  let response = await axios.get(`${process.env.REACT_APP_TOKEN_URL}/token`);
  return {
    "access_token": response.data.access_token,
    "expires_in": response.data.expires_in,
    "token_type": response.data.token_type,
  }
}

const transcribeVideo = async (videoUrl,) => {
  let { access_token } = await getToken();
  let response = await axios.post(`${process.env.REACT_APP_API_URL}/pictoryapis/v2/transcription`, {
    "fileUrl": videoUrl,
    "mediaType": "video",
    "language": "en-US"
  },
    {
      headers: {
        "Authorization": access_token,
        "X-Pictory-User-Id": "EDTECH_USER"
      }
    }
  );
  return {
    "jobId": response.data.data.jobId
  }
}

const getTranscriptionResponse = async (jobId) => {
  let maxTries = 25;
  let tries = 0;
  return new Promise((resolve, reject) => {
    let intervalId = setInterval(async () => {
      try {
        let { access_token } = await getToken();
        let response = await axios.get(`${process.env.REACT_APP_API_URL}/pictoryapis/v1/jobs/${jobId}`,
          {
            headers: {
              "Authorization": access_token,
              "X-Pictory-User-Id": "EDTECH_USER"
            }
          }
        );
        if (response.data.data.editVideoUrl) {
          resolve(response.data.data.editVideoUrl);
          clearInterval(intervalId);
        }
        else {
          if (tries > maxTries) {
            reject("TRANSCRIPTION_RESPONSE_POLLING_TIMEOUT");
            clearInterval(intervalId);
          }
          else {
            tries++
          }
        }
      }
      catch (error) {
        reject(error.message);
        clearInterval(intervalId);
      }
    }, 10000);
  })
}

export default {
  getToken,
  transcribeVideo,
  getTranscriptionResponse
}