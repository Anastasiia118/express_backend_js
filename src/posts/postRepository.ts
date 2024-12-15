import { PostDBType, CreatePostType, PostOutputType } from '../db/post_types'
import { db } from '../db/db'

export const postRepository = {
  create(input: CreatePostType): { error?: string, id?: string } {
    const relatedBlog = db.blogs.find(b => b.id === input.blogId) 
    const newPost: PostDBType = {
      ...input,
      id: Math.random().toString(36).substring(2, 12),
      blogName: relatedBlog?.name || '',
    }
    db.posts = [...db.posts, newPost]
    return newPost
  },
  find(id: string): PostDBType | undefined {
    return db.posts.find(p => p.id === id)
  },
  findForOutput(id: string): { error?: string, id?: string } {
    const post = this.find(id)
    if (!post) {
      return {error : 'Post not found'}
    }
    return post
  },
  getPosts(): PostDBType[] {
    return db.posts
  },
  update(input: Partial<PostDBType>, id: String): { error?: string, id?: string } {
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
  delete(id: string): { error?: string, id?: string } {
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
  mapToOutput(post: PostDBType): PostOutputType {
    return {
      id: post.id,
      title: post.title,
    }
  }
}