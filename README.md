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

        `wsk action update <YOUR_ACTION_NAME> --kind nodejs:8 action.zip --web raw