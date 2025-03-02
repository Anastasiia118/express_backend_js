
import { MongoClient, Db, Collection } from 'mongodb';
import {BlogDBType} from '../db/blog_types'
import {PostDBType} from '../db/post_types'
import {SETTINGS} from '../settings'
import * as dotenv from 'dotenv'
dotenv.config()

export let blogsCollection: Collection<BlogDBType>
export let postsCollection: Collection<PostDBType>

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
export async function runDb(url: string): Promise<boolean> {
    let client = new MongoClient(url);
    let db = client.db(SETTINGS.DB_NAME);

    blogsCollection = db.collection<BlogDBType>(SETTINGS.PATH.BLOGS);
    postsCollection = db.collection<PostDBType>(SETTINGS.PATH.POSTS);
    try {
        await client.connect();
        await db.command({ ping: 1 });

        // await blogsCollection.insertOne({
        //   name: 'Blog 1',
        //   description: 'Description 1',
        //   websiteUrl: 'http://blog1.com'
        // });

        // await postsCollection.insertOne({
        //   title: 'Post 1',
        //   shortDescription: 'Short description 1',
        //   content: 'Content 1',
        //   blogId: '1',
        //   blogName: ''
        // });
        
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        return true
    } catch (e) {
        console.error(e)
        await client.close();
        return false
    }
}
