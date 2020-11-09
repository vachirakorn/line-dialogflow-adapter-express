import bodyParser from 'body-parser';
import {config} from 'dotenv';
import express from 'express';
import {get} from 'lodash';
import {Client} from '@line/bot-sdk';

import {lineClientConfig, dialogflowClientConfig, DEFAULT_PORT} from './config';
import {DialogflowClient} from './dialogflow-client';
import {EventHandler} from './event-handler';

config();
// firebase.initializeApp(firebaseConfig);

const app = express();
app.use(bodyParser.json());

const lineClient = new Client(lineClientConfig);
console.log(lineClientConfig);
console.log(dialogflowClientConfig);

const dialogflowClient = new DialogflowClient(dialogflowClientConfig);
const webhookHandler = new EventHandler(lineClient, dialogflowClient);


app.post('/', async(req, res) => {

  const event = get(req, ['body', 'events', '0']);
  const userId = get(event, ['source', 'userId']);
  console.log(event);

  //Handle event as normal.
  await webhookHandler.handleEvent(event);

  /**
     * Context Saving from Firebase
     */

  //Get the contexts from dialogflow
  let contexts = await dialogflowClient.listContext(userId);
  contexts = contexts.map((x) => ({"name": x.name, "lifespanCount": x.lifespanCount}));
  console.log('contexts', contexts);


  res.send('');
});

app
.listen(process.env.PORT || DEFAULT_PORT);
