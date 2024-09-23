import React from 'react';
import Layout from '../components/Layout';
import * as styles from '../styles/about.module.css';

const AboutPage = () => {
  return (
    <Layout>
      <div className={styles.aboutHeader}>
        <h1>About Husain Alghasra</h1>
        <p>Passionate about technology, computer science, and sharing knowledge</p>
      </div>
      <div className={styles.aboutContent}>
        <p>Welcome to my personal website. Here you'll find a collection of my thoughts, experiences, and learnings in the world of technology and beyond.</p>
        <h2>My Background</h2>
        <p>I am a Product Manager with over 11 years of experience in insurance software. My journey in tech started when I got my first computer back in the 1990s, when I was only 8 years old.</p>
        <h2>What I Do</h2>
        <ul>
          <li>Product Management</li>
          <li>AI Research</li>
          <li>Software Engineering</li>
        </ul>
        <h2>My Mission</h2>
        <p>Is to share knowledge and make it accessible to everyone</p>
        <h2>Connect With Me</h2>
        <p>I'm always eager to connect with like-minded individuals and learn from others. Feel free to reach out to me on X.com at J0se1n.</p>
      </div>
    </Layout>
  );
};

export default AboutPage;