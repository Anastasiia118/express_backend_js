import { setDB, db } from "../src/db/db";
import { PostDBType, CreatePostType } from "../src/types/post_types";
import { req } from "./test-helpers";
import { dataset1 } from "./datasets";
import { SETTINGS } from "../src/settings";
import { postsCollection, runDb } from "../src/db/mongoDb";

import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient, ObjectId } from "mongodb";

let mongoServer: MongoMemoryServer;
let clientMongo:  MongoClient;
 
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  const uri = mongoServer.getUri()
  clientMongo = (await runDb(uri)) as MongoClient
  if(!clientMongo) {
    throw new Error("Error connecting to database")
  }
})
afterAll(async () => {
  await clientMongo.close()
  await mongoServer.stop()

})

describe(SETTINGS.PATH.POSTS + "/", () => {
  let posts: any[];
  let blogs: any[];
  beforeEach(async () => {
    await clientMongo.db(SETTINGS.DB_NAME).collection(SETTINGS.PATH.POSTS).deleteMany({})
    await clientMongo.db(SETTINGS.DB_NAME).collection(SETTINGS.PATH.BLOGS).deleteMany({})
    await clientMongo.db(SETTINGS.DB_NAME).collection(SETTINGS.PATH.BLOGS).insertMany([
      { name: 'Blog 1', description: 'Description 1', websiteUrl: 'http://blog1.com' },
      { name: 'Blog 2', description: 'Description 2', websiteUrl: 'http://blog2.com' },
      { name: 'Blog 3', description: 'Description 3', websiteUrl: 'http://blog3.com' }
    ])
    blogs = await clientMongo.db(SETTINGS.DB_NAME).collection(SETTINGS.PATH.BLOGS).find().toArray()
    await clientMongo.db(SETTINGS.DB_NAME).collection(SETTINGS.PATH.POSTS).insertMany([
      {  title: "Post 1", shortDescription: "Short description 1", content: "Content 1", blogId: blogs[0]._id.toString(), blogName: "Blog 1" },
      {  title: "Post 2", shortDescription: "Short description 2", content: "Content 2", blogId: blogs[1]._id.toString(), blogName: "Blog 2" },
      {  title: "Post 3", shortDescription: "Short description 3", content: "Content 3", blogId: blogs[2]._id.toString(), blogName: "Blog 3" },
    ]);
    posts = await clientMongo.db(SETTINGS.DB_NAME).collection(SETTINGS.PATH.POSTS).find().toArray();
  });

  const buff2 = Buffer.from(SETTINGS.AUTHORIZATION, 'utf8')
  const auth = `Basic ${buff2.toString('base64')}`

  it("should get not empty array", async () => {
    const res = await req.get(SETTINGS.PATH.POSTS + "/").expect(200);

    expect(res.body.data.length).toBe(3);
  });

  it("should return 404 if post not found", async () => {
    const response = await req.get(`${SETTINGS.PATH.POSTS}/100000000000000000000000`);
    expect(response.status).toBe(404);
  });

  it("should create post", async () => {
    const newPost: CreatePostType = {
      title: "Post 4",
      shortDescription: "Short description 4",
      content: "Content 4",
      blogId: blogs[0]._id.toString(),
    };
    const response = await req.post(SETTINGS.PATH.POSTS)
    .send(newPost)
    .set({'Authorization': auth});
    expect(response.status).toBe(201);
    expect(response.body).toEqual(expect.objectContaining(newPost));
  });

  it("should update post", async () => {
    const updatedPost: Partial<PostDBType> = {
      title: "Post 1 Updated",
      content: "Content 1 Updated",
      shortDescription: "Short description 1 Updated",
      blogId: blogs[0]._id.toString(),
    };
    const postId= posts[0]._id.toString();
    const response = await req.put(`${SETTINGS.PATH.POSTS}/${postId}`)
    .send(updatedPost)
    .set({'Authorization': auth});
    expect(response.status).toBe(204);
  });
  it("should delete post", async () => {
    const postId= posts[0]._id.toString();
    const response = await req.delete(`${SETTINGS.PATH.POSTS}/${postId}`)
    .set({'Authorization': auth});
    expect(response.status).toBe(204);
  });

})
