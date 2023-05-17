import { configureEnvFile } from './utils/EnvConfig';
configureEnvFile()

import MongoDBService from './services/MongoDBService.js';
import app from './app.js';

const { PORT } = process.env;

app.listen( PORT, async () => {
    await MongoDBService.connectDB();
    console.log("listening on port " + process.env.PORT);
})

app.get('/', (req , res) => {
    res.status(200).send("Welcome to Gmail API with Nodejs");
})