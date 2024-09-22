import React from 'react';
import {
  TwitterShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  TwitterIcon,
  FacebookIcon,
  LinkedinIcon,
} from 'react-share';
import * as styles from '../styles/share-buttons.module.css';

const ShareButtons = ({ url, title, description }) => {
  return (
    <div className={styles.shareButtons}>
      <TwitterShareButton url={url} title={title}>
        <TwitterIcon size={32} round />
      </TwitterShareButton>
      <FacebookShareButton url={url} quote={description}>
        <FacebookIcon size={32} round />
      </FacebookShareButton>
      <LinkedinShareButton url={url} title={title} summary={description}>
        <LinkedinIcon size={32} round />
      </LinkedinShareButton>
    </div>
  );
};

export default ShareButtons;