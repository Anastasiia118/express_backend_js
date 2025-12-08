"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostSortFields = exports.getPostViewModel = exports.PostSortField = void 0;
exports.mapToPostsListPaginatedOutput = mapToPostsListPaginatedOutput;
var PostSortField;
(function (PostSortField) {
    PostSortField["Title"] = "title";
    PostSortField["CreatedAt"] = "createdAt";
    PostSortField["BlogName"] = "blogName";
})(PostSortField || (exports.PostSortField = PostSortField = {}));
function mapToPostsListPaginatedOutput(posts, meta) {
    return {
        pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
        page: meta.pageNumber,
        pageSize: meta.pageSize,
        totalCount: meta.totalCount,
        items: posts
    };
}
const getPostViewModel = (post) => {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
    };
};
exports.getPostViewModel = getPostViewModel;
exports.PostSortFields = {
    title: 'title',
    createdAt: 'createdAt',
    blogName: 'blogName'
};
