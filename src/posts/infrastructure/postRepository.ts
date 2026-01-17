import { query } from 'express-validator';
import { PostDBType, CreatePostType, PostOutputType, PostQueryInput, getPostViewModel } from '../post_types'
import { db } from '../../db/db'
import { postsCollection } from '../../db/mongoDb';
import { ObjectId, WithId } from 'mongodb';

export const postRepository = {
  async create(input: CreatePostType, blogName: string): Promise<PostOutputType | { error: string }> {
    try {
      const newPost: PostDBType = {
        ...input,
        createdAt: new Date().toISOString(),
        blogName
      };
      const result = await postsCollection.insertOne({ ...newPost });
      const insertedId = result.insertedId.toString();
      const { _id, ...postWithoutId } = newPost;
      const post = { ...postWithoutId, id: insertedId }
      return post;
    } catch (e: any) {
      return { error: e.message };
    }
  },
  async find(id: string): Promise<WithId<PostDBType> | undefined> {
    if (!ObjectId.isValid(id)) {
      return undefined;
    }
    const post = await postsCollection.findOne({ _id: new ObjectId(id) })
    return post ? post : undefined
  },
  async findForOutput(id: string): Promise<{ error?: string; id?: string; }> {
    const post = await this.find(id)
    if (!post || !ObjectId.isValid(id)) {
      return { error: 'Post not found' }
    }
    return getPostViewModel(post)
  },
  async getPosts(query: PostQueryInput): Promise<{ posts: PostOutputType[]; totalCount: number }> {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    } = query;

    const skip = (pageNumber - 1) * pageSize;
    const filter: any = {};

    const posts = await postsCollection
      .find(filter)
      .skip(skip)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection })
      .toArray();
    const totalCount = await postsCollection.countDocuments(filter);
    return { 
      posts: posts.map(post =>getPostViewModel(post)), 
      totalCount 
    };
  },
  async update(input: Partial<PostDBType>, id: string): Promise<{ error?: string; id?: string; }> {
    const result = await postsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: input }
    )
    if (result.matchedCount === 0) {
      return { error: 'Post not found' }
    }
    const updatedPost = await this.find(id);
    return updatedPost ? { id: updatedPost._id.toString() } : { error: 'Post not found' }
  },
  async delete(id: string): Promise<{ error?: string; id?: string; }> {
    try {
      const result = await postsCollection.deleteOne({ _id: new ObjectId(id) })
      if (result.deletedCount === 0) {
        return { error: 'Post not found' }
      }
    } catch (e: any) {
      return { error: e.message }
    }
    return { id };
  },
}