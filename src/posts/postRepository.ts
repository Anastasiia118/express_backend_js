import { PostDBType, CreatePostType, PostOutputType } from '../db/post_types'
import { db } from '../db/db'

export const postRepository = {
  create(input: CreatePostType): { error?: string, id?: string } {
    const relatedBlog = db.blogs.find(b => b.id === input.blogId) 
    if (!relatedBlog) {
      return { error: 'Blog not found' }
    }
    const newPost: PostDBType = {
      ...input,
      id: Math.random().toString(36).substring(2, 12),
      blogName: relatedBlog.name,
    }

    try {
      db.posts = [...db.posts, newPost]
    } catch (e: any) {
      // log
      return { error: e.message }
    }

    return { id: newPost.id }
  },
  find(id: string): PostDBType | undefined {
    return db.posts.find(p => p.id === id)
  },
  findForOutput(id: string): null | PostOutputType {
    const post = this.find(id)
    if (!post) { return null }
    return this.mapToOutput(post)
  },
  getPosts(): PostDBType[] {
    return db.posts
  },
  mapToOutput(post: PostDBType): PostOutputType {
    return {
      id: post.id,
      title: post.title,
    }
  }
}