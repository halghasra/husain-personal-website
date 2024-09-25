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
        <p>Hello, and thank you for stepping into my world of relentless inquiry and exploration. I'm Husain, and this blog is a testament to the power of questioning—a space where thoughts are voiced, and curiosity is the compass guiding every venture.</p>
        
        <p>Throughout my life, I've been captivated by the profound questions that shape us: the ones that challenge our beliefs, the ones that make us ponder our existence, and the ones that push us to explore beyond the boundaries of our current understanding. I've come to realise that it's these questions, the ones we dare to ask in our quietest moments, that carve our paths and define who we are.</p>
        
        <p>Here, you'll find me unraveling the tapestry of ideas, diving into the pages of both books and cutting-edge research, and sharing insights on everything that sparks a thought. I invite you to join me on this journey of discovery and introspection. Let's question, learn, and grow together.</p>

        <h2>My Day-to-Day: Shaping the Future of Insurance</h2>
        <p>In the bustling heart of London, I step into my role as a Product Manager with Aventum Group, a company at the forefront of insurance innovation. It's here, among the hustle and excitement of one of the most innovative insurance groups globally, that I spend my weekdays from nine to five.</p>
        
        <p>Our mission is clear yet ambitious: transform the insurance landscape through technology. Working alongside a creative team of developers, we're on a mission to build and deliver advanced platforms. These aren't just any platforms; they're the kind that revolutionise how our business operates worldwide, making our work exciting and genuinely impactful.</p>
        
        <p>Every day presents a fresh chance to make a difference, push beyond the ordinary, and help shape what's next for us at Aventum Group. It's about genuine innovation—creating solutions that transform the way our team works from the inside out.</p>
        
        <p>This is my professional world, where I'm lucky enough to combine my love for technology with the drive to make a difference. It's not just about being part of the industry's evolution but actively pushing it forward, one day at a time.</p>

        <h2>My Academic Side: A Deep Dive into Computer Science</h2>
        <p>Outside the office, my fascination with technology doesn't slow down; it shifts gears. I'm deeply interested in how the field of computer science continues to evolve and what it means for our future. My particular focus? Deep learning, quantum computing, edge computing, and artificial intelligence. These areas are not just academic interests; they're windows to new possibilities, showing us how technology can understand and interact with the world in ways we're just beginning to imagine.</p>
        
        <p>It's thrilling to see how these technologies can transform our approach to everyday problems, create smarter solutions, and even change how we perceive the world. For me, it's about more than just keeping up with the latest trends or theories. It's about understanding how these advancements can be applied in practical, meaningful ways to make a real difference.</p>
        
        <p>On this website, I share my journey through the vast landscape of computer science. You'll find my take on recent research, the potential of emerging technologies, and why I think these developments matter. My goal is to spark curiosity in you—whether you're a student just starting out, a fellow tech enthusiast, or simply someone intrigued by the future of technology.</p>
        
        <p>I'm here to share what I learn, offer insights, and maybe, just maybe, inspire a few of you to dive into the fascinating world of computer science yourself. Let's explore together how technology is shaping our world and how we can be part of that change.</p>

        <blockquote>
          <h2>"When you change the way you look at things, the things you look at change"</h2>
          <footer>— Wayne Dyer</footer>
        </blockquote>

        <h2>Connect With Me</h2>
        <p>I'm always eager to connect with like-minded individuals and learn from others. Feel free to reach out to me on X.com at J0se1n.</p>
      </div>
    </Layout>
  );
};

export default AboutPage;