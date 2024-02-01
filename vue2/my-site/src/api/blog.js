import request from "@/utils/request";

/**
 * 获取博客列表数据
 */
export async function getBlogs(page = 1, limit = 10, categoryid = -1) {
	return await request.get("/api/blog", {
		params: {
			page,
			limit,
			categoryid,
		},
	});
}

/**
 * 获取博客分类
 */
export async function getBlogTypes() {
	return await request.get("/api/blogtype");
}


/**
 * 获取博客详情
 */

export function getBlogDetail(blogId) {
	return request.get(`/api/blog/${blogId}`);
}

/**
 * 获取博客评论
 */

export function getBlogComments(blogId, page = 1, limit = 10) {
	return  request.get('/api/comment', {
		// 通过params选项设置query参数
		params: {
			blogId,
			page,
			limit,
		},
	});
}

/**
 * 提交评论
 */
export function postComment(commentInfo) {
	return request.post("/api/comment",commentInfo);
}
