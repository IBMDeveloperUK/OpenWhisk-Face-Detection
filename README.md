# OpenWhisk Face Detection
With IBM Watson Visual Recognition

## Overview

This is a serverless function that accepts a JPEG or PNG image and uses Watson Visual Recognition to detect and analyse the faces of any people in it. The result is passed back to the requester.

## Usage
_NB: These steps are for deploying the OpenWhisk function to IBM Cloud, but the code will work on any platform that OpenWhisk is running on._

**Required prerequisites**
    
- Node.js `^8.8.0` && npm `>= v5.6.0`
- [OpenWhisk CLI tools](https://github.com/apache/incubator-openwhisk-cli/releases)
- An IBM Cloud account for Watson/OpenWhisk services (which you can sign up for  [here](https://console.bluemix.net/registration/))

## Deploying the function

To deploy the function to IBM Cloud, follow these steps:

1) Clone/download this repo to your local machine.
2) Log in to your IBM Cloud account and head to the [OpenWhisk Functions Dashboard](https://console.bluemix.net/openwhisk)
3) Click the "Start Creating" button
4) Click "Create Action"
5) Fill in the presented form to create a new action
    - Enter a memorable action name
    - Leave "Enclosing Package" set to "(Default Package)"
    - Select "Node.js 8" as your runtime
6) Click "Create"
7) Your new OpenWhisk function will be created and you'll be taken to a dashboard for entering code inline, but we're not going to use this. 
8) Click the "Parameters" tab in the sidebar and add a parameter with the key `USER_SECRET` and a value set to something secret. This is used to stop the public from posting images to your Watson Visual Recognition service (which we set up below) from your serverless function
9) Go to https://console.bluemix.net/openwhisk/learn/api-key to get your API key and hostname. We'll need these to configure the `wsk` CLI tool to talk to and authenticate with the IBM Cloud
10) Copy the API hostname and run `wsk property set --apihost <YOUR_API_HOSTNAME>`
11) Copy your key and run `wsk property set --auth "<YOUR_API_KEY>"`
12) Copy the name of your newly created function and `cd` to the directory of the cloned repo you created in step 1.
13) Run `npm install` to install the dependencies (Watson Developer Cloud) for your function.
14) Run `npm run package`. This will zip up your action and it's dependencies for uploading to IBM Cloud
15) Enter and run the following command to deploy your function to the IBM Cloud and allow it to be triggered from a URL.

    `wsk action update <YOUR_ACTION_NAME> --kind nodejs:8 action.zip --web raw`

## Setting up Watson Visual Recognition

Once (or even before) you've uploaded your OpenWhisk function, you need to create a Watson Visual Recognition service instance to use with it. Visual Recognition has a 'lite' tier, so you don't have to pay up-front to use the service or add a credit card to your IBM Cloud account (unless you want to exceed the tier quota)

To create an instance of the [Watson Visual Recognition Service](https://www.ibm.com/watson/services/visual-recognition/) complete the following steps.

1) If you've not done so already, log in to your IBM Cloud account
2) Head to the [IBM Cloud Catalog](https://console.bluemix.net/catalog/?search=Watson) and select the "Visual Recogntion" tab.
3) Give your service a recognisable name, and click 'Create'
4) You'll be taken to the dashboard for your newly created visual recogntion service. In the sidebar to the left of the display click "Service Credentials" and then "New Credentials" follow the onscreen instructions to create an API key that we'll pass to our serverless function when we invoke it. 
5) You now have a visual recognition service that you can use to detect faces in images!

## Invoking the function and detecting faces

The OpenWhisk function we've created and configured can now be triggered with a `POST` request to a web endpoint. To analyse an image:

### Invoking with cURL

1) Head to the dashboard for your OpenWhisk function and click on the "Endpoints" tab;
2) Copy the URL in the Web Action to your clipboard
3) Enter your terminal and paste **but do not execute** the following command (we need to append some properties)

    `curl -X POST --header "Content-Type:application/octet-stream" --data-binary @<PATH_TO_IMAGE_TO_ANALSYE>.jpg "<OPENWHISK_WEB_ACTION_URL>"`

4) Append the following query parameters to your web action URL:
    - `apiKey` : The API key you created for your Watson Visual Recognition service
    - `userSecret` : The value of the `USER_SECRET` parameter you set when you first created your OpenWhisk function

5) Your cURL command should now look something like the following:
    `curl -X POST --header "Content-Type:application/octet-stream" --data-binary @<PATH_TO_IMAGE_TO_ANALSYE>.jpg <OPENWHISK_WEB_ACTION_URL>?apiKey=<VISUAL_RECOGNITION_KEY>&userSecret=<USER_SECRET_PARAMETER>`

6) Execute the command, and if successful, you should get a result something like the following!
```JSON
{
  "images": [{
    "faces": [{
      "age": {
        "max": 44,
        "min": 35,
        "score": 0.513807
      },
      "face_location": {
        "height": 407,
        "left": 426,
        "top": 182,
        "width": 315
      },
      "gender": {
        "gender": "MALE",
        "score": 0.993307
      }
    }],
    "image": "image.jpeg"
  }],
  "images_processed": 1
}
```

### Invoking with Postman

1) Open Postman and paste the following URL into the request URL input box (Follow the cURL command instructions to find where the values can be found)
    `<OPENWHISK_WEB_ACTION_URL>?apiKey=<VISUAL_RECOGNITION_KEY>&userSecret=<USER_SECRET_PARAMETER>`
2) Change the HTTP verb to `POST` in the dropdown next to the URL input field.
3) Click the "Headers" tab below the URL input field and add a `Content-Type` header with the value `application/octet-stream`
4) Click the "Body" tab and select the `binary` radio option. A file input selector will appear. Click it and select the image you wish to detect faces in.
5) Click send!