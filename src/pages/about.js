import React from 'react';
import Layout from '../components/Layout';
import * as styles from '../styles/about.module.css';

const AboutPage = () => {
  return (
    <Layout>
      <div className={styles.aboutHeader}>
        <h1>Welcome to My Personal Exploration</h1>
        <p>The Journey Begins with a Question</p>
      </div>
      <div className={styles.aboutContent}>
        <p>Hi there, and thanks for visiting my world of endless inquiry and exploration. I'm Husain, a lifelong learner and passionate explorer of all things tech and beyond. This blog is my space to voice thoughts, ask questions, and let curiosity guide every step.</p>
        <p>From a young age, I've been captivated by questions that challenge our beliefs and push us to think deeper. These quiet moments of wondering shape who we are and carve our unique paths.</p>
        <p>On this site, you'll find me weaving through ideas, diving into books and the latest research, and sharing insights on everything that sparks my curiosity. I invite you to join me on this adventure of discovery and growth. Let's question, learn, and evolve together.</p>

        <h2>My Dual Worlds: Professional and Personal Passions</h2>
        <h3>Shaping the Future of Insurance</h3>
        <p>Living in the vibrant city of London, I work as a Product Manager at Aventum Group, a leader in insurance innovation. Every weekday from nine to five, I collaborate with a creative team of engineers to build advanced platforms that transform the insurance industry. Our mission is to revolutionize how insurance operates worldwide, making our work both exciting and impactful.</p>
        <p>Being part of Aventum Group allows me to blend my love for technology with a drive to make meaningful changes. It's not just about keeping up with the industry—it's about pushing it forward, one innovative solution at a time.</p>

        <h3>A Lifelong Passion for Learning</h3>
        <p>Outside of work, my love for technology continues to grow. I'm deeply engaged in computer science, focusing on areas like deep learning, quantum computing, edge computing, and artificial intelligence. These fields aren't just academic interests—they're gateways to new possibilities, showing us how technology can interact with the world in amazing ways.</p>
        <p>I believe in applying these advancements in practical, meaningful ways to solve real-world problems. On this website, I share my journey through the vast landscape of computer science, offering insights into recent research and emerging technologies. My goal is to ignite your curiosity, whether you're a student, a fellow tech enthusiast, or someone fascinated by the future of technology.</p>

        <h2>A Glimpse into My Journey</h2>
        <h3>From a Young Explorer to a Tech Enthusiast</h3>
        <p>When I was seven, my father gifted me my first computer. Although we didn't get our first modem until a few years later, my curiosity wasn't dampened. By nine, during the 2002 World Cup, I built my first website to share my love for football, specifically my favorite team, Argentina, and my favorite player, Pablo Aimar. Watching matches live online was a thrill, and I wanted to make it easier for others to follow along in real-time.</p>
        <p>As a child, I dreamed of building a time machine. I scoured the streets for discarded electronics, tearing them apart and trying to piece them together. While my attempts ended in a small home fire and a shift away from hardware, they cemented my passion for computers, electronics, and technology.</p>
        <p>My second dream was to create the largest database of everything—relationships, family trees, cars, mobile phone brands, and more. I've always been fascinated by finding patterns and meaningful connections within vast datasets. Graduating high school at 16 and continuing my studies in computer science have allowed me to pursue these passions further.</p>
        <p>Today, with over a decade of experience in the software development industry within insurance, I continue to build innovative solutions that redefine how insurance is underwritten. Living in London, my favorite city in the world, I balance my professional life with ongoing studies and a relentless desire to learn and share knowledge.</p>

        <blockquote>
          <p>"When you change the way you look at things, the things you look at change."</p>
          <footer>— Wayne Dyer —</footer>
        </blockquote>
      </div>
    </Layout>
  );
};

export default AboutPage;