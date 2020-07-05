import {
  SET_ALL_POSTS,
  LOAD_MORE_POSTS,
  ADD_POST,
  EDIT_POST,
  EDIT_EXPANDED_POST,
  UPDATE_POST,
  UPDATE_EXPANDED_POST,
  UPDATE_POST_IMAGE,
  UPDATE_EXPANDED_POST_IMAGE,
  CANCEL_POST_UPDATE,
  CANCEL_EXPANDED_POST_UPDATE,
  SET_EXPANDED_POST
} from './actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case SET_ALL_POSTS:
      return {
        ...state,
        posts: action.posts,
        hasMorePosts: Boolean(action.posts.length)
      };
    case LOAD_MORE_POSTS:
      return {
        ...state,
        posts: [...(state.posts || []), ...action.posts],
        hasMorePosts: Boolean(action.posts.length)
      };
    case ADD_POST:
      return {
        ...state,
        posts: [action.post, ...state.posts]
      };
    case EDIT_POST:
    case CANCEL_POST_UPDATE:
      const clonedPosts = [...state.posts]
      const targetPostIndex = clonedPosts.findIndex(p => p.id === action.post.id);
      const newPost = { ...clonedPosts[targetPostIndex] }

      newPost.inEdit = action.type === EDIT_POST;
      clonedPosts[targetPostIndex] = newPost;

      return { ...state, posts: clonedPosts }
    case UPDATE_POST:
      const updatedPosts = [...state.posts]
      const postIndex = updatedPosts.findIndex(p => p.id === action.postId);
      const updatedPost = { ...updatedPosts[postIndex], ...action.postUpdate }

      updatedPosts[postIndex] = updatedPost;
      updatedPost.inEdit = false;

      return { ...state, posts: updatedPosts }
    case UPDATE_POST_IMAGE: {
      const clonedPosts = [...state.posts];
      const postIndex = clonedPosts.findIndex(p => p.id === action.postId);
      const post = clonedPosts[postIndex];

      const updatedPost = { ...post, image: action.image }
      clonedPosts[postIndex] = updatedPost;

      return { ...state, posts: clonedPosts }
    }
    case EDIT_EXPANDED_POST:
    case CANCEL_EXPANDED_POST_UPDATE:
      const expandedPost = { ...state.expandedPost }
      expandedPost.inEdit = action.type === EDIT_EXPANDED_POST;

      return { ...state, expandedPost }
    case UPDATE_EXPANDED_POST: {
      const expandedPost = { ...state.expandedPost, ...action.postUpdate }
      expandedPost.inEdit = false;

      return { ...state, expandedPost }
    }
    case UPDATE_EXPANDED_POST_IMAGE: {
      const expandedPost = { ...state.expandedPost, image: { ...action.image }}

      return { ...state, expandedPost }
    }
    case SET_EXPANDED_POST:
      return {
        ...state,
        expandedPost: action.post
      };
    default:
      return state;
  }
};
