import { BlogDBType, CreateBlogType, BlogOutputType } from '../db/blog_types'
import { blogsCollection, postsCollection } from '../db/mongoDb'
import { db } from '../db/db'
import { ObjectId } from 'mongodb';


export const blogRepository = {
  async create(newBlog: BlogDBType): Promise<BlogDBType> {
    const result = await blogsCollection.insertOne(newBlog);
    return { ...newBlog, id: result.insertedId.toString() };
  },
  async find(id: string): Promise<BlogDBType | undefined> {
    const blog = await blogsCollection.findOne({ _id: new ObjectId(id) });
    return blog ? { ...blog, id: blog._id.toString() } : undefined;
  },
  async findForOutput(id: string): Promise<{ error?: string; id?: string; }> {
    const blog = await this.find(id)
    if (!blog) { 
      return { error: 'Blog not found' } 
    }
    return blog
  },
  async getBlogs(): Promise<BlogDBType[]> {
    const blogs = await blogsCollection.find().toArray();
    return blogs.map(blog => ({ ...blog, id: blog._id.toString() }));
  },
  // async update(input: Partial<BlogDBType>, id: String): Promise<{ error?: string; id?: string; }> {
  //   const blog = db.blogs.find(b => b.id === id)
  //   if (!blog) {
  //     return { error: 'Blog not found' }
  //   }
  //   const updatedBlog = {
  //     ...blog,
  //     ...input
  //   }

  //   try {
  //     db.blogs = db.blogs.map(b => b.id === id ? updatedBlog : b)
  //   } catch (e: any) {
  //     // log
  //     return { error: e.message }
  //   }
  //   return blog;
  // },
  async update(input: Partial<BlogDBType>, id: string): Promise<{ error?: string; id?: string; }> {
    const result = await blogsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: input }
    );
    if (result.matchedCount === 0) {
        return { error: 'Blog not found' };
    }
    const updatedBlog = await this.find(id);
    return updatedBlog ? { id: updatedBlog.id } : { error: 'Blog not found' };
  },
  // async delete(id: string): Promise<{ error?: string, id?: string }> {
  //   const blog = db.blogs.find(b => b.id === id)
  //   if (!blog) {
  //     return { error: 'Blog not found' }
  //   }

  //   try {
  //     db.blogs = db.blogs.filter(b => b.id !== id)
  //   } catch (e: any) {
  //     // log
  //     return { error: e.message }
  //   }

  //   return blog;
  // },
  async delete(id: string): Promise<{ error?: string; id?: string }> {
    const result = await blogsCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
        return { error: 'Blog not found' };
    }
    return { id };
  },
  // async mapToOutput(blog: BlogDBType): Promise<BlogOutputType> {
  //   return {
  //     id: blog.id,
  //     name: blog.name,
  //   }
  // }
};