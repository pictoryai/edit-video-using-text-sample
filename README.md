# Pictory-Video-Summarizer-Sample-App

This repo contains the source code of our sample Video Summarizer app. Our sample app shows how to call our whitelabel-Video Summarier page using iFrame inside your own webapp.

## Installation 
Ensure you have the following prerequisites installed:

1. NODE VERSION 18 AND ABOVE

Steps to run the sample app are mentioned below:
```
Download the repo code and run following commands in your terminal
$npm install
$ VITE_API_URL=<PICTORY_API_URL> 
VITE_CLIENT_ID=<UNIQUE-CLIENT-ID>
VITE_CLIENT_SECRET=<UNIQUE_CLIENT-SECRET>
VITE_X_PICTORY_USER_ID=<YOUR_USER_ID>
npm start
```

## Prerequisite to integrate our Video Summarizer page in your webapp

You need Pictory API KEYS, including CLIENT_ID, CLIENT_SECRET and X-Pictory-User-Id to include our video summarizer app inside your web app.

Note: If you don't have your Pictory API KEYs, please get in touch with us at support@pictory.ai.

##### Initializing `VideoEditor` from your web page

https://github.com/pictoryai/edtech-video-editor-front-end/blob/main/src/videoEditor/index.js

```
new VideoEditor( reference_to_your_Container, editorUrl, brandOptions);
```

You can obtain `editorUrl` by calling our transcription API mentioned at https://docs.pictory.ai/reference/post_pictoryapis-v2-transcription

Brand-Option Format is mentioned at bottom of this page.

#### Important `postMessage` from your webpage container to our iframe page

1. Pictory `access_token`: You can obtain an access_token by calling our authentication API https://docs.pictory.ai/reference/authentication. Please see access_token expires in 1 hour, so please regenerate  `access_token` before its expiry and pass it to the iFrame.

```
{ message: 'SET_ACCESS_TOKEN', <YOUR_ACCESS_TOKEN> }
```

2. Render Webhook: You can set your Video Download URL by providing render webhook from your web page container to our iFrame by passing following message:
   ```
    { message: 'SET_WEBHOOK', renderWebhook}    
   ```
#### Brand Options parameters 

```
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
  }
```
