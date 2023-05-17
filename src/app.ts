import express from 'express'
const app = express();

import { configureEnvFile } from './utils/EnvConfig';
configureEnvFile()

app.use(express.json())

import configureAllRoutes from './routes/index';
configureAllRoutes(app);

export default app;