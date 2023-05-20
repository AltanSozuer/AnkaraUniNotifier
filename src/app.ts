import express from 'express'
import cors from 'cors';
const app = express();

import { configureEnvFile } from './utils/EnvConfig';
configureEnvFile()

app.use(express.json())
app.use(cors({
    origin: 'http://localhost:19006'
}))
import configureAllRoutes from './routes/index';
configureAllRoutes(app);

export default app;