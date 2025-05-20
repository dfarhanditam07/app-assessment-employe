import { MongoClient, MongoClientOptions } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options: MongoClientOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

if (!uri) {
  throw new Error('[MongoDB] MONGODB_URI tidak ditemukan di environment variable (.env.local)');
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Gunakan global ini hanya di development
const globalWithMongo = global as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

if (process.env.NODE_ENV === 'development') {
  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // Production: hindari penggunaan global
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
