import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal, Comment as CommentUI, Header } from 'semantic-ui-react';
import moment from 'moment';
import { likePost, dislikePost, toggleExpandedPost, addComment } from 'src/containers/Thread/actions';
import Post from 'src/components/Post';
import Comment from 'src/components/Comment';
import AddComment from 'src/components/AddComment';
import Spinner from 'src/components/Spinner';

const ExpandedPost = ({
  post,
  userId,
  sharePost,
  editPost: edit,
  updatePost: update,
  updatePostImage: updateImage,
  cancelPostUpdate: cancelUpdate,
  uploadImage: uploadImage,
  likePost: like,
  dislikePost: dislike,
  toggleExpandedPost: toggle,
  addComment: add
}) => (
  <Modal dimmer="blurring" centered={false} open onClose={() => toggle()}>
    {post
      ? (
        <Modal.Content>
          <Post
            post={post}
            isEditable={post.user.id === userId}
            inEdit={post.inEdit}
            editPost={edit}
            updatePost={(id, postUpdate) => update(postUpdate)}
            updatePostImage={(id, image) => updateImage(image)}
            cancelPostUpdate={cancelUpdate}
            uploadImage={uploadImage}
            likePost={like}
            dislikePost={dislike}
            toggleExpandedPost={toggle}
            sharePost={sharePost}
          />
          <CommentUI.Group style={{ maxWidth: '100%' }}>
            <Header as="h3" dividing>
              Comments
            </Header>
            {post.comments && post.comments
              .sort((c1, c2) => moment(c1.createdAt).diff(c2.createdAt))
              .map(comment => <Comment key={comment.id} comment={comment} />)}
            <AddComment postId={post.id} addComment={add} />
          </CommentUI.Group>
        </Modal.Content>
      )
      : <Spinner />}
  </Modal>
);

ExpandedPost.propTypes = {
  post: PropTypes.objectOf(PropTypes.any).isRequired,
  userId: PropTypes.string.isRequired,
  editPost: PropTypes.func.isRequired,
  updatePost: PropTypes.func.isRequired,
  updatePostImage: PropTypes.func.isRequired,
  cancelPostUpdate: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
  toggleExpandedPost: PropTypes.func.isRequired,
  likePost: PropTypes.func.isRequired,
  dislikePost: PropTypes.func.isRequired,
  addComment: PropTypes.func.isRequired,
  sharePost: PropTypes.func.isRequired
};

const mapStateToProps = rootState => ({
  post: rootState.posts.expandedPost,
  userId: rootState.profile.user.id
});

const actions = { likePost, dislikePost, toggleExpandedPost, addComment };

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExpandedPost);
