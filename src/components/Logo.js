import React, { useState } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import * as styles from '../styles/logo.module.css';

const Logo = () => {
    const [isHovered, setIsHovered] = useState(false);
    const data = useStaticQuery(graphql`
        query {
            file(relativePath: { eq: "logo.png" }) {
                childImageSharp {
                    gatsbyImageData(width: 200, placeholder: BLURRED)
                }
            }
        }
    `);

    const logoImage = getImage(data.file);

    return (
        <div 
      className={`${styles.logoContainer} ${isHovered ? styles.hovered : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <GatsbyImage image={logoImage} alt="HG Logo" />
    </div>
    );
};

export default Logo;