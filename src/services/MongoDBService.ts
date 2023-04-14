import mongoose, { mongo } from "mongoose";

const {
    MONGO_HOST,
    MONGO_PORT,
    MONGO_DATABASE,
    MONGO_SERVER_SELECTION_TIMEOUT
} = process.env;

class MongoDBService {

    private mongoOptions = {
        serverSelectionTimeoutMS: Number(MONGO_SERVER_SELECTION_TIMEOUT) || 5000
    }

    constructor() {
        this.connectDB();
    }

    getMongoose() {
        return mongoose;
    }

    getSchema() {
        return mongoose.Schema;
    }

    isConnected(): boolean {
        return mongoose.connections.length > 1;
    }

    connectDB() {
        try {
            if(!this.isConnected()) {
                mongoose.connect(`mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`, this.mongoOptions)
                .then( () => {
                    console.log('Mongodb is connected. ');
                    
                })
                .catch(err => {
                    console.log('Mongodb connection is failed. ',err);
                })
            }
            else {
                console.log('MongoDB Client is already connected to database');
                
            }
        }
        catch(err) {
            console.log('MongodbService.connectDB error: ',err);
        }
    }


    async disconnect() {
        try {
            await mongoose.connection.close(true);
        }
        catch(err) {
            console.log('MongoDBService.disconnect() is failed. ', err);
            
        }
    }
}

export default new MongoDBService();