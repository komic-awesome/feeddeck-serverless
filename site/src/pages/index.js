import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { useStaticQuery, graphql } from "gatsby"
import './index.sass'

const NAMESPACE_AND_LABEL = {
  '3dm': '3DM',
  '17173': '17173',
  'gamersky': '游民星空',
  'duowan': '多玩',
}

const NAMESPACE_AND_URL = {
  '3dm': 'https://www.3dmgame.com',
  '17173': 'https://www.17173.com',
  'gamersky': 'https://www.gamersky.com',
  'duowan': 'http://www.duowan.com',
}

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
        <h2>
          <a className="daily-title-link"
            rel="noopener noreferrer"
            target="_blank"
            href={ NAMESPACE_AND_URL[daily.pk] }>
            { NAMESPACE_AND_LABEL[daily.pk] }
          </a>
        </h2>
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
      <SEO title="首页"/>
      { nodes.map(({ node }, index) => ( <DailyBlock key={index} daily={node}/> )) }
    </Layout>
  )
}

export default IndexPage
