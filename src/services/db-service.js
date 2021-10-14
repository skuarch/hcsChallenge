import { MongoClient } from 'mongodb';
import { getEnvironment } from '../env/index.js';

const env = getEnvironment(process.argv[2]);
const connectionUrl = env.connectionUrl;
const databaseName = env.databaseName;

export const openDBConnection = async () => {
  const mongoClient = new MongoClient(connectionUrl);
  const connection = await connectDb(mongoClient);
  const database = mongoClient.db(databaseName);

  const mongo = {
    connection: connection,
    database: database,
    mongoClient: mongoClient
  };
  return mongo;
}

const connectDb = async (mongoClient) => {
  if (mongoClient) {
    return await mongoClient.connect()
      .catch(console.log);
  } else {
    console.log('undefinied mongoClient');
  }
}
