import { BlogDBType, CreateBlogType, BlogOutputType } from '../db/blog_types'
import { db } from '../db/db'

export const blogRepository = {
  async create(input: CreateBlogType): Promise<{ error?: string; id?: string }> {
    const newBlog: BlogDBType = {
      ...input,
      id: Math.random().toString(36).substring(2, 12),
    }

    try {
      db.blogs = [...db.blogs, newBlog]
    } catch (e: any) {
      // log
      return { error: e.message }
    }
    return newBlog 
  },
  async find(id: string): Promise<BlogDBType | undefined> {
    return db.blogs.find(p => p.id === id)
  },
  async findForOutput(id: string): Promise<{ error?: string; id?: string; }> {
    const blog = await this.find(id)
    if (!blog) { 
      return { error: 'Blog not found' } 
    }
    return blog
  },
  async getBlogs(): Promise<BlogDBType[]> {
    return db.blogs
  },
  async update(input: Partial<BlogDBType>, id: String): Promise<{ error?: string; id?: string; }> {
    const blog = db.blogs.find(b => b.id === id)
    if (!blog) {
      return { error: 'Blog not found' }
    }
    const updatedBlog = {
      ...blog,
      ...input
    }

    try {
      db.blogs = db.blogs.map(b => b.id === id ? updatedBlog : b)
    } catch (e: any) {
      // log
      return { error: e.message }
    }
    return blog;
  },
  async delete(id: string): Promise<{ error?: string, id?: string }> {
    const blog = db.blogs.find(b => b.id === id)
    if (!blog) {
      return { error: 'Blog not found' }
    }

    try {
      db.blogs = db.blogs.filter(b => b.id !== id)
    } catch (e: any) {
      // log
      return { error: e.message }
    }

    return blog;
  },
  async mapToOutput(blog: BlogDBType): Promise<BlogOutputType> {
    return {
      id: blog.id,
      name: blog.name,
    }
  }
}