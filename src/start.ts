import express from 'express'
import { configureEnvFile } from './utils/EnvConfig.js';

configureEnvFile()

const app = express();
const { PORT } = process.env;

import { main } from './app.js';
import MongoDBService from './services/MongoDBService.js';

app.listen( PORT, async () => {
    main(); 
    console.log("listening on port " + process.env.PORT);
})

app.get('/', (req , res) => {
    res.status(200).send("Welcome to Gmail API with Nodejs");
})