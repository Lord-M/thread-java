import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Segment, Container, TextArea, Button, Icon, Image } from 'semantic-ui-react';

import * as imageService from 'src/services/imageService';

import styles from './styles.module.scss';

const EditPost = ({
  post,
  updatePost,
  updatePostImage,
  uploadImage,
  cancelPostUpdate
}) => {
  const [body, setBody] = useState(post.body);
  const [image, setImage] = useState(post.image);
  const [isUploading, setIsUploading] = useState(false);

  const handleChangeImage = async ({ target }) => {
    setIsUploading(true);
    try {
      const postImage = await uploadImage(target.files[0]);
      updatePostImage(post.id, postImage);
      setImage(postImage);
    } finally {
      // TODO: show error
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (evt) => {
    updatePostImage(post.id, undefined);
    setImage(undefined);
  }

  const handleUndoPostUpdate = () => {
    cancelPostUpdate(post);
  }

  const handleUpdatePost = () => {
    updatePost(post.id, { body, image });
  }

  return (
    <div className="form ui">
      <div className={styles.textAreaContainer}>
        <TextArea
          name="body"
          value={body}
          placeholder="Update post"
          onChange={ev => setBody(ev.target.value)}
        />
      </div>
      <div className={styles.buttonsContainerRoot}>
        <div className={styles.buttonsContainer}>
          <Button color="teal" icon labelPosition="left" as="label" loading={isUploading} disabled={isUploading}>
            <Icon name="image" />
            Change image
            <input name="image" type="file" onChange={handleChangeImage} hidden />
          </Button>
          <Button color="yellow" icon labelPosition="left" as="label" onClick={handleRemoveImage}>
            <Icon name="trash" />
            Remove image
          </Button>
        </div>

        <div className={styles.buttonsContainerRight}>
          <Button color="red" icon labelPosition="left" as="label" onClick={handleUndoPostUpdate}>
            <Icon name="remove" />
            Cancel
          </Button>
          <Button color="blue" icon labelPosition="left" as="label" onClick={handleUpdatePost}>
            <Icon name="check" />
            Update
          </Button>
        </div>
      </div>
    </div>
  );
};

EditPost.propTypes = {
  post: PropTypes.object.isRequired,
  updatePost: PropTypes.func.isRequired,
  updatePostImage: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
  cancelPostUpdate: PropTypes.func.isRequired
};

export default EditPost;
