import { postRepository } from '../infrastructure/postRepository';
import { PostDBType, CreatePostType, PostOutputType, PostQueryInput } from '../post_types'
import { blogRepository } from '../../blogs/infrastructure/blogRepository';

export const postsService = {
    async createPost(input: CreatePostType): Promise<{ error?: string; id?: string;}> {
        const relatedBlog = await blogRepository.findForOutput(input.blogId);
        if ('error' in relatedBlog) {
            return { error: 'Related blog not found' };
        }
        return await postRepository.create(input, relatedBlog.name);
    },
    async getPostById(id: string): Promise<{ error?: string; id?: string; }> {
        return await postRepository.findForOutput(id);
    },
    async getAllPosts(query: PostQueryInput): Promise<{ posts: PostOutputType[]; totalCount: number }> {
        return await postRepository.getPosts(query);
    },
    async updatePost(id: string, input: Partial<PostDBType>): Promise<{ error?: string; id?: string; }> {
        return await postRepository.update(input, id);
    },
    async deletePost(id: string): Promise<{ error?: string; id?: string; }> {
        return await postRepository.delete(id);
    }
}   