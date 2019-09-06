import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { useStaticQuery, graphql } from "gatsby"
import './index.sass'

const HotLink = ({ link }) => {
  return (
    <h3 className="info-tit">
      <a className="hot-link"
        rel="noopener noreferrer"
        href={link.url}
        target="_blank">
        { link.title }
      </a>
    </h3>
  )
}

const SubLinks = ({ links }) => {
  let items = links
    .map((link, index) => (<a href={link.url} key={index} target="_blank" rel="noopener noreferrer"> { link.title } </a>))

  items.splice(1, 0, '|')

  return (
    <p className="sub-links">
      { items }
    </p>
  )
}

const DailyBlock = ({ daily }) => {
  const items = daily.links.reduce(
    (accumulator, link) => {
      if (link.isHot) {
        accumulator.push({
          type: 'hot',
          payload: link
        })

        return accumulator
      }

      const previous = accumulator[accumulator.length - 1]

      if (previous.type === 'sublinks') {
        previous.payload.push(link)
      } else {
        accumulator.push(
          {
            type: 'sublinks',
            payload: [
              link
            ]
          }
        )
      }

      return accumulator
    },
    []
  )

  return (
    <div className="daily-block">
      <div className="hd">
        <h2>{ daily.pk }</h2>
      </div>

      <div className="bd">
        {
          items.map(
            (item, index) => {
              if (item.type === 'hot') {
                return (
                  <HotLink link={item.payload} key={index} />
                )
              }

              return (
                <SubLinks links={item.payload} key={index} />
              )
            }
          )
        }
      </div>
    </div>
  )
}

const IndexPage = () => {
  const data = useStaticQuery(graphql`
    query {
      allDailies {
        edges {
          node {
            id
            links {
              isHot
              title
              url
            }
            pk
          }
        }
      }
    }
  `)

  const nodes = data.allDailies.edges || []

  return (
    <Layout>
      <SEO title="Home" />
      { nodes.map(({ node }, index) => ( <DailyBlock key={index} daily={node}/> )) }
    </Layout>
  )
}

export default IndexPage
