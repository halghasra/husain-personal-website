import React from "react"
import * as styles from "../styles/sheet.module.css"

// The ruled notebook sheet: a narrow margin column for catalogue data, a main column for text.
export const Sheet = ({ children, className = "" }) => (
  <div className={`${styles.sheet} ${className}`}>{children}</div>
)

export const Row = ({ margin, children, className = "", as: Tag = "div", wide = false }) => (
  <Tag className={`${styles.row} ${wide ? styles.rowWide : ""} ${className}`}>
    <div className={styles.margin}>{margin}</div>
    <div className={styles.main}>{children}</div>
  </Tag>
)

export const PageHead = ({ margin, title, children }) => (
  <Row as="header" margin={margin} className={styles.pageHead}>
    <h1 className={styles.pageTitle}>{title}</h1>
    {children && <div className={styles.pageLede}>{children}</div>}
  </Row>
)

export const Section = ({ margin, title, children, className = "" }) => (
  <Row as="section" margin={margin} className={`${styles.section} ${className}`}>
    {title && <h2 className={styles.sectionTitle}>{title}</h2>}
    {children}
  </Row>
)

// A question set like a theorem in a paper: bold small-caps label, italic statement, then remarks.
export const Problem = ({ label, tag, statement, children }) => (
  <div className={styles.problem}>
    <p className={styles.statement}>
      <span className={styles.problemLabel}>{label}</span>
      {tag && <> ({tag})</>}. {statement}
    </p>
    {children && (
      <p className={styles.remarks}>
        <i>Remarks.</i> {children}
        <span className={styles.qed} aria-hidden="true" />
      </p>
    )}
  </div>
)

export { styles as sheetStyles }
