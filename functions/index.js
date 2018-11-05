// Copyright 2018, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const {dialogflow} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

const request = require('request-promise');

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});

// Handle the Dialogflow intent named 'favorite color'.
// The intent collects a parameter named 'color'.
app.intent('listSpotsInGarage', (conv, {parkingStructure, spotColor}) => {
    return request("http://us-central1-utdapi-217616.cloudfunctions.net/function-1").then(function(body){
        let structureNumber = parkingStructure.substring(parkingStructure.length - 1);
        let jsonIndex = parseInt(structureNumber, 10);

        if(jsonIndex == 1){
            jsonIndex = 0;
        }else if(jsonIndex == 3){
            jsonIndex = 1;
        }else{
            jsonIndex = 2;
        }
        let spotIndex = "parking_"+spotColor;
        let jsonResponse = JSON.parse(body);
        let parkingGreen = jsonResponse[jsonIndex][spotIndex].toString();
        let responseString = parkingStructure + " has " + parkingGreen + spotColor + " " + "spots available";
        conv.close(responseString);
    });
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
