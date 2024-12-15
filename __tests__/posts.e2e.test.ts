import { setDB, db } from "../src/db/db";
import { PostDBType, CreatePostType } from "../src/db/post_types";
import { req } from "./test-helpers";
import { dataset1 } from "./datasets";
import { SETTINGS } from "../src/settings";

describe(SETTINGS.PATH.POSTS + "/", () => {
  beforeEach(async () => {
    setDB(dataset1);
  });

  const buff2 = Buffer.from(SETTINGS.AUTHORIZATION, 'utf8')
  const auth = `Basic ${buff2.toString('base64')}`

  it("should get empty array", async () => {
    setDB();

    const res = await req.get(SETTINGS.PATH.POSTS + "/").expect(404);
  });

  it("should get not empty array", async () => {
    const res = await req.get(SETTINGS.PATH.POSTS + "/").expect(200);

    expect(res.body.length).toBe(3);
    expect(res.body[0]).toEqual(dataset1.posts[0]);
  });

  it("should return post by id", async () => {
    const response = await req.get(`${SETTINGS.PATH.POSTS}/1`);
    expect(response.status).toBe(200);
    expect(response.body.title).toEqual(db.posts[0]["title"]);
  });

  it("should return 404 if post not found", async () => {
    const response = await req.get(`${SETTINGS.PATH.POSTS}/100`);
    expect(response.status).toBe(404);
  });

  it("should create post", async () => {
    const newPost: CreatePostType = {
      title: "Post 4",
      shortDescription: "Short description 4",
      content: "Content 4",
      blogId: "1",
    };
    const response = await req.post(SETTINGS.PATH.POSTS)
    .send(newPost)
    .set({'Authorization': auth});
    expect(response.status).toBe(201);
    expect(db.posts).toContainEqual(expect.objectContaining(newPost));
  });

  it("should update post", async () => {
    const updatedPost: Partial<PostDBType> = {
      id: "1",
      title: "Post 1 Updated",
      content: "Content 1 Updated",
    };
    const response = await req.put(`${SETTINGS.PATH.POSTS}/1`)
    .send(updatedPost)
    .set({'Authorization': auth});
    expect(response.status).toBe(204);
    expect(db.posts).toContainEqual(expect.objectContaining(updatedPost));
  });
  it("should delete post", async () => {
    const response = await req.delete(`${SETTINGS.PATH.POSTS}/1`)
    .set({'Authorization': auth});
    expect(response.status).toBe(204);
    expect(db.posts).not.toContainEqual(expect.objectContaining({ id: "1" }));
  });

})
