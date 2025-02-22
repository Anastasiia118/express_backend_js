
import { MongoClient, Db, ServerApiVersion, Collection } from 'mongodb';
import {BlogDBType} from '../db/blog_types'
import {SETTINGS} from '../settings'
import * as dotenv from 'dotenv'
dotenv.config()

export let blogsCollection: Collection<BlogDBType>

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
export async function runDb(url: string): Promise<boolean> {
    let client = new MongoClient(url);
    let db = client.db(SETTINGS.DB_NAME);

    blogsCollection = db.collection<BlogDBType>(SETTINGS.PATH.BLOGS);
    try {
        await client.connect();
        await db.command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        return true
    } catch (e) {
        console.error(e)
        await client.close();
        return false
    }
}
