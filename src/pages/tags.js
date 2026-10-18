import React, { useEffect, useState } from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import EntryList from '../components/EntryList'
import { Sheet, Row, PageHead, sheetStyles as sheet } from '../components/Sheet'
import * as styles from '../styles/tags.module.css'

const TagsPage = ({ data, location }) => {
  const allTags = data.tagsGroup.group
  const allPosts = data.allMarkdownRemark.nodes
  const [selectedTag, setSelectedTag] = useState(null)

  // Tag links on notes point here as /tags?tag=Name
  useEffect(() => {
    const tag = new URLSearchParams(location?.search || '').get('tag')
    if (tag && allTags.some(t => t.fieldValue === tag)) setSelectedTag(tag)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location?.search])

  const filteredPosts = selectedTag
    ? allPosts.filter(post => post.frontmatter.tags && post.frontmatter.tags.includes(selectedTag))
    : allPosts

  return (
    <Layout>
      <SEO title="Tags" description="Browse every topic covered across the notebook." />
      <Sheet>
        <PageHead
          title="Tags."
          margin={<><b>Index</b><br />{allTags.length} tags</>}
        >
          <p>Browse all topics covered across the notebook.</p>
        </PageHead>

        <Row margin={<b>Tag</b>} className={styles.filterRow}>
          <div className={sheet.filters} role="group" aria-label="Filter by tag">
            <button
              type="button"
              aria-pressed={!selectedTag}
              className={`${sheet.filter} ${!selectedTag ? sheet.filterActive : ''}`}
              onClick={() => setSelectedTag(null)}
            >
              all<sup>{allPosts.length}</sup>
            </button>
            {allTags.map(tag => (
              <button
                key={tag.fieldValue}
                type="button"
                aria-pressed={selectedTag === tag.fieldValue}
                className={`${sheet.filter} ${selectedTag === tag.fieldValue ? sheet.filterActive : ''}`}
                onClick={() => setSelectedTag(tag.fieldValue)}
              >
                {tag.fieldValue.toLowerCase()}<sup>{tag.totalCount}</sup>
              </button>
            ))}
          </div>
        </Row>

        <div className={styles.results}>
          <Row margin={<b>{filteredPosts.length} entries</b>}>
            <h2 className={styles.resultsTitle}>{selectedTag ? `#${selectedTag}` : 'Everything'}</h2>
          </Row>
          <EntryList posts={filteredPosts} />
        </div>
      </Sheet>
    </Layout>
  )
}

export default TagsPage

export const pageQuery = graphql`
  query {
    tagsGroup: allMarkdownRemark(limit: 2000, filter: { frontmatter: { status: { ne: "draft" } } }) {
      group(field: { frontmatter: { tags: SELECT } }) {
        fieldValue
        totalCount
      }
    }
    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      filter: { frontmatter: { status: { ne: "draft" } } }
    ) {
      nodes {
        excerpt(pruneLength: 160)
        fields {
          slug
        }
        frontmatter {
          date(formatString: "D MMM YYYY")
          title
          type
          summary
          tags
        }
      }
    }
  }
`
