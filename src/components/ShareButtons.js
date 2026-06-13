import React, { useState } from 'react';
import {
  TwitterShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  EmailShareButton,
  RedditShareButton,
  WhatsappShareButton,
} from 'react-share';
import { FaXTwitter, FaFacebook, FaLinkedin, FaReddit, FaWhatsapp, FaEnvelope, FaLink } from 'react-icons/fa6';
import * as styles from '../styles/share-buttons.module.css';

const ShareButtons = ({ url, title, description }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className={styles.shareButtons}>
      <TwitterShareButton url={url} title={title} className={styles.shareButton}>
        <FaXTwitter size={20} aria-label="Share on X" />
      </TwitterShareButton>
      <FacebookShareButton url={url} quote={description} className={styles.shareButton}>
        <FaFacebook size={20} aria-label="Share on Facebook" />
      </FacebookShareButton>
      <LinkedinShareButton url={url} title={title} summary={description} className={styles.shareButton}>
        <FaLinkedin size={20} aria-label="Share on LinkedIn" />
      </LinkedinShareButton>
      <RedditShareButton url={url} title={title} className={styles.shareButton}>
        <FaReddit size={20} aria-label="Share on Reddit" />
      </RedditShareButton>
      <WhatsappShareButton url={url} title={title} className={styles.shareButton}>
        <FaWhatsapp size={20} aria-label="Share on WhatsApp" />
      </WhatsappShareButton>
      <EmailShareButton url={url} subject={title} body={description} className={styles.shareButton}>
        <FaEnvelope size={20} aria-label="Share via Email" />
      </EmailShareButton>
      <button
        onClick={handleCopyLink}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', transition: 'all 0.2s ease' }}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.transform = 'scale(1.05)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.transform = 'scale(1)'; }}
        title="Copy link to clipboard"
        aria-label="Copy link to clipboard"
      >
        <FaLink size={20} />
      </button>
    </div>
  );
};

export default ShareButtons;