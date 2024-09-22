import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import * as styles from '../styles/author-bio.module.css';

const AuthorBio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
        childImageSharp {
          gatsbyImageData(width: 50, height: 50, layout: FIXED)
        }
      }
      site {
        siteMetadata {
          author {
            name
            summary
          }
          social {
            twitter
          }
        }
      }
    }
  `);

  const author = data.site.siteMetadata?.author;
  const social = data.site.siteMetadata?.social;
  const avatar = getImage(data.avatar);

  return (
    <div className={styles.bioContainer}>
      {avatar && (
        <GatsbyImage
          image={avatar}
          alt={author?.name || ''}
          className={styles.avatar}
        />
      )}
      {author?.name && (
        <p>
          Written by <strong>{author.name}</strong>
          {author?.summary && ` ${author.summary}`}
          {social?.twitter && (
            <>
              {' '}
              <a href={`https://twitter.com/${social.twitter}`}>
                You should follow them on Twitter
              </a>
            </>
          )}
        </p>
      )}
    </div>
  );
};

export default AuthorBio;