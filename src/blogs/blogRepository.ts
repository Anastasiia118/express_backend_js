import { BlogDBType, CreateBlogType, BlogOutputType } from '../db/blog_types'
import { db } from '../db/db'

export const blogRepository = {
  create(input: CreateBlogType): { error?: string, id?: string } {
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
  find(id: string): BlogDBType | undefined {
    return db.blogs.find(p => p.id === id)
  },
  findForOutput(id: string): { error?: string, id?: string } {
    const blog = this.find(id)
    if (!blog) { 
      return { error: 'Blog not found' } 
    }
    return blog
  },
  getBlogs(): BlogDBType[] {
    return db.blogs
  },
  update(input: Partial<BlogDBType>, id: String): { error?: string, id?: string } {
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
  delete(id: string): { error?: string, id?: string } {
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
  mapToOutput(blog: BlogDBType): BlogOutputType {
    return {
      id: blog.id,
      name: blog.name,
    }
  }
}