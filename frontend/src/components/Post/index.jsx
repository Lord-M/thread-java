import React from 'react';
import PropTypes from 'prop-types';
import { Card, TextArea, Image, Label, Icon } from 'semantic-ui-react';
import moment from 'moment';

import EditPost from './../EditPost'
import styles from './styles.module.scss';

const Post = ({ post, isEditable, inEdit, editPost, updatePost, updatePostImage, cancelPostUpdate, uploadImage, likePost, dislikePost, toggleExpandedPost, sharePost }) => {
  const {
    id,
    image,
    body,
    user,
    likeCount,
    dislikeCount,
    commentCount,
    createdAt,
    updatedAt
  } = post;
  const updated = updatedAt && (Date.parse(updatedAt) !== Date.parse(createdAt));
  const date = moment(updated ? updatedAt : createdAt).fromNow();
  return (
    <Card style={{ width: '100%' }}>
      {image && <Image src={image.link} wrapped ui={false} />}
      <Card.Content>
        <Card.Meta>
          <span className={isEditable ? "date-editable-post" : "date"}>
            {updated ? "updated by" : "posted by"}
            {' '}
            {user.username}
            {' - '}
            {date}
          </span>
          {isEditable && (
            <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => editPost(post)}>
              <Icon name="edit" />
            </Label>
          )}
        </Card.Meta>
        <Card.Description>
          {inEdit ? (
            <EditPost post={post} uploadImage={uploadImage} updatePost={updatePost} updatePostImage={updatePostImage} cancelPostUpdate={cancelPostUpdate} />
          ) : (body)
          }
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => likePost(id)}>
          <Icon name="thumbs up" />
          {likeCount}
        </Label>
        <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => dislikePost(id)}>
          <Icon name="thumbs down" />
          {dislikeCount}
        </Label>
        <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => toggleExpandedPost(id)}>
          <Icon name="comment" />
          {commentCount}
        </Label>
        <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => sharePost(id)}>
          <Icon name="share alternate" />
        </Label>
      </Card.Content>
    </Card>
  );
};

Post.propTypes = {
  post: PropTypes.objectOf(PropTypes.any).isRequired,
  isEditable: PropTypes.bool,
  inEdit: PropTypes.bool,
  editPost: PropTypes.func.isRequired,
  updatePost: PropTypes.func.isRequired,
  updatePostImage: PropTypes.func.isRequired,
  cancelPostUpdate: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
  likePost: PropTypes.func.isRequired,
  dislikePost: PropTypes.func.isRequired,
  toggleExpandedPost: PropTypes.func.isRequired,
  sharePost: PropTypes.func.isRequired
};

export default Post;
