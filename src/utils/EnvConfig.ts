import path from "path";
import dotenv from 'dotenv'

export function configureEnvFile(): void {
    let envPath = '';
    if(process.env.APP_STATE) {
        envPath = path.resolve( __dirname, `../../.env.${process.env.APP_STATE}`);
        dotenv.config({ path: envPath })
    }    
    else throw new Error('APP_STATE variable is not given in scripts.');
}