import { PostDBType, CreatePostType, PostOutputType } from '../db/post_types'
import { db } from '../db/db'
import { postsCollection } from '../db/mongoDb';
import { ObjectId } from 'mongodb';

export const postRepository = {
  async create(input: CreatePostType): Promise<{ error?: string; id: string; }> {
    const relatedBlog = db.blogs.find(b => b.id === input.blogId) 
    const newPost: PostDBType = {
      ...input,
      blogName: relatedBlog?.name || '',
    }
    const result  = await postsCollection.insertOne(newPost)
    return {...newPost, id: result.insertedId.toString()}
  },
  async find(id: string): Promise<PostDBType | undefined> {
    const post = await postsCollection.findOne({ _id: new ObjectId(id) })
    return post ? { ...post, id: post._id.toString() } : undefined
  },
  async findForOutput(id: string): Promise<{ error?: string; id?: string; }> {
    const post = await this.find(id)
    if (!post) {
      return {error : 'Post not found'}
    }
    return post
  },
  async getPosts(): Promise<PostDBType[]> {
    return db.posts
  },
  async update(input: Partial<PostDBType>, id: String): Promise<{ error?: string; id?: string; }> {
    const post = db.posts.find(p => p.id === id)
    if (!post) {
      return { error: 'Post not found' }
    }
    const updatedPost = {
      ...post,
      ...input
    }

    try {
      db.posts = db.posts.map(p => p.id === id ? updatedPost : p)
    } catch (e: any) {
      // log
      return { error: e.message }
    }
    return post;
  },
  async delete(id: string): Promise<{ error?: string; id?: string; }> {
    const post = db.posts.find(p => p.id === id)
    if (!post) {
      return { error: 'Post not found' }
    }

    try {
      db.posts = db.posts.filter(p => p.id !== id)
    } catch (e: any) {
      // log
      return { error: e.message }
    }
    return post;
  },
  async mapToOutput(post: PostDBType): Promise<PostOutputType> {
    return {
      id: post.id,
      title: post.title,
    }
  }
}