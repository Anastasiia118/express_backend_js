
import { MongoClient, Db, Collection } from 'mongodb';
import {BlogDBType} from '../types/blog_types'
import {PostDBType} from '../types/post_types'
import {SETTINGS} from '../settings'
import * as dotenv from 'dotenv'
dotenv.config()

export let blogsCollection: Collection<BlogDBType>
export let postsCollection: Collection<PostDBType>

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
export async function runDb(url: string): Promise<MongoClient | false> {
    let client = new MongoClient(url);
    let db = client.db(SETTINGS.DB_NAME);

    blogsCollection = db.collection<BlogDBType>(SETTINGS.PATH.BLOGS);
    postsCollection = db.collection<PostDBType>(SETTINGS.PATH.POSTS);
    try {
        await client.connect();
        await db.command({ ping: 1 });
        
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        return client
    } catch (e) {
        console.error(e)
        await client.close();
        return false
    }
}

// export async function deleteDuplicates(url: string): Promise<void> {
//     let client = new MongoClient(url);
//     let db = client.db(SETTINGS.DB_NAME);

//     blogsCollection = db.collection<BlogDBType>(SETTINGS.PATH.BLOGS);
//     postsCollection = db.collection<PostDBType>(SETTINGS.PATH.POSTS);
//     try {
//         await client.connect();

//         // Delete duplicate blogs
//         const deleteBlogsResult = await blogsCollection.deleteMany({
//             name: 'Blog 1',
//             description: 'Description 1',
//             websiteUrl: 'http://blog1.com'
//         });
//         console.log(`Deleted ${deleteBlogsResult.deletedCount} duplicate blogs.`);

//         // Delete duplicate posts
//         const deletePostsResult = await postsCollection.deleteMany({
//             title: 'Post 1',
//             shortDescription: 'Short description 1',
//             content: 'Content 1',
//             blogId: '1',
//         });
//         console.log(`Deleted ${deletePostsResult.deletedCount} duplicate posts.`);
//     } finally {
//         await client.close();
//     }
// }
