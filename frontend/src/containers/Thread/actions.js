import * as postService from 'src/services/postService';
import * as commentService from 'src/services/commentService';
import {
  ADD_POST,
  EDIT_POST,
  EDIT_EXPANDED_POST,
  UPDATE_POST,
  UPDATE_EXPANDED_POST,
  UPDATE_POST_IMAGE,
  UPDATE_EXPANDED_POST_IMAGE,
  CANCEL_POST_UPDATE,
  CANCEL_EXPANDED_POST_UPDATE,
  LOAD_MORE_POSTS,
  SET_ALL_POSTS,
  SET_EXPANDED_POST
} from './actionTypes';

const setPostsAction = posts => ({
  type: SET_ALL_POSTS,
  posts
});

const addMorePostsAction = posts => ({
  type: LOAD_MORE_POSTS,
  posts
});

const addPostAction = post => ({
  type: ADD_POST,
  post
});

const editPostAction = post => ({
  type: EDIT_POST,
  post
});

const editExpandedPostAction = post => ({
  type: EDIT_EXPANDED_POST,
  post
});

const updatePostAction = (postId, postUpdate) => ({
  type: UPDATE_POST,
  postId,
  postUpdate
});

const updateExpandedPostAction = (postUpdate) => ({
  type: UPDATE_EXPANDED_POST,
  postUpdate
});

const updatePostImageAction = (postId, image) => ({
  type: UPDATE_POST_IMAGE,
  postId,
  image
});

const updateExpandedPostImageAction = (image) => ({
  type: UPDATE_EXPANDED_POST_IMAGE,
  image
});

const cancelPostUpdateAction = post => ({
  type: CANCEL_POST_UPDATE,
  post
});

const cancelExpandedPostUpdateAction = post => ({
  type: CANCEL_EXPANDED_POST_UPDATE,
  post
});

const setExpandedPostAction = post => ({
  type: SET_EXPANDED_POST,
  post
});

export const loadPosts = filter => async dispatch => {
  const posts = await postService.getAllPosts(filter);
  dispatch(setPostsAction(posts));
};

export const loadMorePosts = filter => async (dispatch, getRootState) => {
  const { posts: { posts } } = getRootState();
  const loadedPosts = await postService.getAllPosts(filter);
  const filteredPosts = loadedPosts
    .filter(post => !(posts && posts.some(loadedPost => post.id === loadedPost.id)));
  dispatch(addMorePostsAction(filteredPosts));
};

export const applyPost = postId => async dispatch => {
  const post = await postService.getPost(postId);
  dispatch(addPostAction(post));
};

export const addPost = post => async dispatch => {
  const { id } = await postService.addPost(post);
  const newPost = await postService.getPost(id);
  dispatch(addPostAction(newPost));
};

export const toggleExpandedPost = postId => async dispatch => {
  const post = postId ? await postService.getPost(postId) : undefined;
  dispatch(setExpandedPostAction(post));
};

export const editPost = post => async dispatch => {
  dispatch(editPostAction(post));
}

export const editExpandedPost = post => async dispatch => {
  dispatch(editExpandedPostAction(post));
}

export const updatePost = (postId, postUpdate) => async (dispatch, getRootState) => {
  dispatch(updatePostAction(postId, postUpdate));

  const rootState = getRootState();
  const posts = rootState.posts.posts;

  const updatedPost = posts.find(p => p.id === postId);
  const result = await postService.updatePost(postId, updatedPost);
  dispatch(updatePostAction(postId, result));
}

export const updateExpandedPost = (postUpdate) => async (dispatch, getRootState) => {
  dispatch(updateExpandedPostAction(postUpdate));

  const rootState = getRootState();
  const expandedPost = rootState.posts.expandedPost;

  const result = await postService.updatePost(expandedPost.id, expandedPost);
  dispatch(updateExpandedPostAction(result));
  dispatch(updatePostAction(result.id, result));
}

export const updatePostImage = (postId, image) => async dispatch => {
  dispatch(updatePostImageAction(postId, image));
}

export const updateExpandedPostImage = image => async dispatch => {
  dispatch(updateExpandedPostImageAction(image));
}

export const cancelPostUpdate = post => async dispatch => {
  dispatch(cancelPostUpdateAction(post));
}

export const cancelExpandedPostUpdate = post => async dispatch => {
  dispatch(cancelExpandedPostUpdateAction(post));
}

export const likePost = postId => async (dispatch, getRootState) => {
  const result = await postService.likePost(postId);
  const diff = result?.id ? 1 : -1; // if ID exists then the post was liked, otherwise - like was removed
  const dislikeDiff = result?.isLikeChanged ? -1 : 0;

  const mapLikes = post => ({
    ...post,
    likeCount: Number(post.likeCount) + diff, // diff is taken from the current closure
    dislikeCount: Number(post.dislikeCount) + dislikeDiff
  });

  const { posts: { posts, expandedPost } } = getRootState();
  const updated = posts.map(post => (post.id !== postId ? post : mapLikes(post)));

  dispatch(setPostsAction(updated));

  if (expandedPost && expandedPost.id === postId) {
    dispatch(setExpandedPostAction(mapLikes(expandedPost)));
  }
};

export const dislikePost = postId => async (dispatch, getRootState) => {
  const result = await postService.dislikePost(postId);
  const diff = result?.id ? 1 : -1; // if ID exists then the post was disliked, otherwise - dislike was removed
  const likeDiff = result?.isLikeChanged ? -1 : 0;

  const mapDislikes = post => ({
    ...post,
    dislikeCount: Number(post.dislikeCount) + diff, // diff is taken from the current closure
    likeCount: Number(post.likeCount) + likeDiff
  });

  const { posts: { posts, expandedPost } } = getRootState();
  const updated = posts.map(post => (post.id !== postId ? post : mapDislikes(post)));

  dispatch(setPostsAction(updated));

  if (expandedPost && expandedPost.id === postId) {
    dispatch(setExpandedPostAction(mapDislikes(expandedPost)));
  }
};

export const addComment = request => async (dispatch, getRootState) => {
  const { id } = await commentService.addComment(request);
  const comment = await commentService.getComment(id);

  const mapComments = post => ({
    ...post,
    commentCount: Number(post.commentCount) + 1,
    comments: [...(post.comments || []), comment] // comment is taken from the current closure
  });

  const { posts: { posts, expandedPost } } = getRootState();
  const updated = posts.map(post => (post.id !== comment.postId
    ? post
    : mapComments(post)));

  dispatch(setPostsAction(updated));

  if (expandedPost && expandedPost.id === comment.postId) {
    dispatch(setExpandedPostAction(mapComments(expandedPost)));
  }
};
