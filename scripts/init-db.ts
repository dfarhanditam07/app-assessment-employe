import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local');
}

async function initDb() {
  const client = new MongoClient(uri as string);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('situational_leadership');
    
    // Buat collection users jika belum ada
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    if (!collectionNames.includes('users')) {
      await db.createCollection('users');
      console.log('Created users collection');
    }

    // Buat index untuk NIK
    await db.collection('users').createIndex({ nik: 1 }, { unique: true });
    console.log('Created index on NIK');

    // Insert admin user jika belum ada
    const adminUser = {
      nik: 'admin',
      password: 'admin123', // Dalam produksi, password harus di-hash
      nama: 'Administrator',
      role: 'admin',
      unit_kerja: 'IT'
    };

    try {
      await db.collection('users').insertOne(adminUser);
      console.log('Created admin user');
    } catch (error: any) {
      if (error.code === 11000) {
        console.log('Admin user already exists');
      } else {
        throw error;
      }
    }

    console.log('Database initialization completed');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await client.close();
  }
}

initDb(); 