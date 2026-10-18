import { useStaticQuery, graphql } from "gatsby"

// Every published notebook entry, oldest first. An entry's catalogue number (N° 1, N° 2, ...)
// is its position in that order, so the numbers record the order the entries were written.
export const useCatalogue = () => {
  const data = useStaticQuery(graphql`
    query CatalogueQuery {
      allMarkdownRemark(
        filter: {
          fields: { slug: { regex: "/^/(blog|notes|essays|research-seeds|paper-notes|builds)/" } }
          frontmatter: { status: { ne: "draft" } }
        }
        sort: [{ frontmatter: { date: ASC } }, { frontmatter: { title: ASC } }]
      ) {
        nodes {
          fields { slug }
          frontmatter {
            title
            type
            tags
            year: date(formatString: "YYYY")
          }
        }
      }
    }
  `)

  const entries = data.allMarkdownRemark.nodes.map((n, i) => ({
    n: i + 1,
    slug: n.fields.slug,
    title: n.frontmatter.title,
    type: n.frontmatter.type || "note",
    tags: n.frontmatter.tags || [],
    year: n.frontmatter.year,
  }))
  const numberOf = {}
  entries.forEach(e => { numberOf[e.slug] = e.n })

  return {
    entries,
    total: entries.length,
    firstYear: entries[0]?.year,
    lastYear: entries[entries.length - 1]?.year,
    numberOf: slug => numberOf[slug],
  }
}
