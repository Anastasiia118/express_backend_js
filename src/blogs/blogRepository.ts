import { BlogDBType, CreateBlogType, BlogOutputType } from '../db/blog_types'
import { blogsCollection, postsCollection } from '../db/mongoDb'
import { db } from '../db/db'
import { ObjectId, WithId } from 'mongodb';

const getBlogViewModel = (blog: WithId<BlogDBType>): BlogOutputType => {
  return {
    id: blog._id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
  }
}


export const blogRepository = {
  async create(input: CreateBlogType): Promise<{error?: string; id?: string}> {
    const createdAt = new Date().toISOString();
    const newBlog: BlogDBType = {
      ...input,
      createdAt,
      isMembership: false,
    };
    const result = await blogsCollection.insertOne(newBlog);
    const insertedId = result.insertedId.toString();
    const { _id, ...blogWithoutId } = newBlog;
    return { ...blogWithoutId, id: insertedId };
  },
  async find(id: string): Promise<WithId<BlogDBType> | undefined> {
    const blog = await blogsCollection.findOne({ _id: new ObjectId(id) });
    return blog ? blog : undefined;
  },
  async findForOutput(id: string): Promise<{ error?: string; id?: string; }> {
    const blog = await this.find(id)
    if (!blog || !ObjectId.isValid(id)) { 
      return { error: 'Blog not found' } 
    }
    return getBlogViewModel(blog);
  },
  async getBlogs(): Promise<BlogDBType[]> {
    const blogs = await blogsCollection.find().toArray();
    return blogs.map(blog => {
      const { _id, ...blogWithoutId } = blog;
      return { ...blogWithoutId, id: blog._id.toString() };
    });
  },
  async update(input: Partial<BlogDBType>, id: string): Promise<{ error?: string; id?: string; }> {
    const result = await blogsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: input }
    );
    if (result.matchedCount === 0) {
        return { error: 'Blog not found' };
    }
    const updatedBlog = await this.find(id);
    return updatedBlog ? { id: updatedBlog._id.toString() } : { error: 'Blog not found' };
  },
  async delete(id: string): Promise<{ error?: string; id?: string }> {
    try {
      const result = await blogsCollection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) {
          return { error: 'Blog not found' };
      }
    } catch(e: any) {
      return { error: e.message };
    }
    return { id };
  },
};