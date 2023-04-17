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

    constructor() {}

    getMongoose() {
        return mongoose;
    }

    getSchema() {
        return mongoose.Schema;
    }

    isConnected(): boolean {
        return mongoose.connections.length > 1;
    }

    async connectDB() {
        try {
            if(!this.isConnected()) {
                await mongoose.connect(`mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`, this.mongoOptions)
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
    
    async clearCollections(): Promise<void> {
        try{
            const db = this.getMongoose().connection.db;       
            const coll = await db.listCollections().toArray();
            
            coll.map( col => col.name).forEach( async ( name ) => {
                db.dropCollection(name)
            })
        }
        catch(err) {
            console.log('MongoSBService.clearCollections() is failed. ',err);
        }
    
    }
}

export default new MongoDBService();