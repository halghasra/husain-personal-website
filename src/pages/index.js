import React from 'react';
import { Link } from 'gatsby';
import Layout from '../components/layout';

const IndexPage = () => {
  return (
    <Layout>
      <h1>Welcome to Husain Alghasra's Personal Website</h1>
      <section>
        <h2>Latest Blog Posts</h2>
        {/* We'll add a list of blog posts here later */}
      </section>
      <section>
        <h2>Latest Lessons</h2>
        {/* We'll add a list of lessons here later */}
      </section>
      <section>
        <h2>Favorites</h2>
        {/* We'll add a list of favorite posts/lessons here later */}
      </section>
    </Layout>
  );
};

export default IndexPage;