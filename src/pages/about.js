import React from 'react';
import Layout from '../components/Layout';
import * as styles from '../styles/about.module.css';

const AboutPage = () => {
  return (
    <Layout>
      <div className={styles.aboutHeader}>
        <h1>Who I Am (And How I Got Here)</h1>
      </div>
      <div className={styles.aboutContent}>
        <p>I don’t remember the moment I fell in love with technology. It wasn’t some grand epiphany, no lightning-strike realisation. It was just there, like breathing—woven into the way I saw the world.</p>
        <p>Maybe it started when my father bought me my first computer as a birthday gift—a machine that felt like a portal to another universe. Or maybe it was that night in 2002, when I fell asleep and missed Argentina’s opening match against Nigeria in the World Cup. I woke up too late, grabbed the newspaper, and realised I had no way of knowing the score <strong>when it actually happened</strong>. What if there was a way to see football results instantly?</p>
        <p>So, I built one.</p>
        <p>I didn’t know anything about making websites, but I learned. I threw together a simple page in HTML and started updating it with match scores as I watched them. It wasn’t fancy, and it wasn’t a hit, but it served its purpose. More importantly, it <strong>showed me something I’d never forget</strong>: I could teach myself anything if I needed to.</p>
        <p>That’s the pattern my life has followed ever since. An idea gets stuck in my head, and suddenly, I <em>have</em> to chase it. I have to tinker, to push, to break things apart and rebuild them better.</p>

        <h2>Breaking Things to Make Them Better</h2>
        <p>When I stepped into the world of <strong>software development</strong>, I wasn’t just looking for a career—I wanted to <strong>make a change</strong>. I’ve always believed that no matter how rigid, how deeply entrenched a system is, it can be torn down and rebuilt into something better.</p>
        <p>The insurance industry? It’s just one example. I’ve worked in places where change was something that happened <strong>slowly—painfully slowly</strong>. Where innovation was a buzzword, not a reality. Where ideas sat in meetings instead of making it into the world.</p>
        <p>I hated that.</p>
        <p>So I decided to do what I’ve always done: <strong>take something monolithic, break it apart, and build something new from its ashes.</strong></p>
        <p>Today, I’m not just working in insurance tech—I’m reshaping it. I’m building the <strong>insurance platform of the future</strong>, one that doesn’t just improve what exists but <strong>redefines how the entire industry operates</strong>. And I’m not stopping there. I don’t just want to be part of change—I want to be the <strong>disruption</strong>.</p>
        <p>One day, I want to look back and say, with absolute certainty, <strong>I changed this industry for the better.</strong></p>

        <h2>Why I Never Stop Learning</h2>
        <p>Even outside of work, I’m drawn to <strong>new ideas, complex problems, and impossible questions</strong>. I don’t just love technology—I love understanding it <strong>at its core</strong>. Not just how things work, but <em>why</em> they work.</p>
        <p>I thrive on the <strong>intersection of theory and reality</strong>. I dive into research papers, <strong>tearing through ideas</strong> to understand them at a fundamental level—then I think, <em>How do I take this and make it real?</em></p>
        <p>This website reflects that. It’s not just about what I do, but what I think about. The concepts that fascinate me. The problems that keep me up at night. The endless pursuit of <strong>learning, questioning, and creating.</strong></p>

        <h2>What This Place Is (And What It Isn’t)</h2>
        <p>This isn’t some neatly packaged, marketable personal brand. It’s not a blog that exists for clicks. It’s <strong>just me</strong>, documenting what I build, what I think about, and the ideas that won’t leave my head.</p>
        <ul>
          <li>Sometimes it’s about the <strong>systems I’m designing</strong>.</li>
          <li>Sometimes it’s about <strong>a concept I just learned</strong>.</li>
          <li>Sometimes it’s just <strong>a thought, a question, a spark that might turn into something bigger</strong>.</li>
        </ul>
        <p>If you’re here, maybe you’re like me. Maybe you see something old and think, <em>this could be so much better</em>. Maybe you’ve never been satisfied with “just the way things are.” Maybe, like me, you don’t just want to <strong>exist in an industry</strong>—you want to <strong>change it</strong>.</p>
        <p>If that’s the case, welcome. We might have a lot to talk about.</p>

        <blockquote>
          <p>"The reasonable man adapts himself to the world: the unreasonable one persists in trying to adapt the world to himself. Therefore all progress depends on the unreasonable man."</p>
          <footer>— George Bernard Shaw</footer>
        </blockquote>
      </div>
    </Layout>
  );
};

export default AboutPage;
