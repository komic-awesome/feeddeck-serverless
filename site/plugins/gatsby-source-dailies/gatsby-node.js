const axios = require('axios')
const AWS = require('aws-sdk')
const _ = require('lodash')

function queryDailes() {
  const docClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' })
  const params = {
    TableName: 'Dailies'
  }

  return new Promise((resolve, reject) => {
    docClient.scan(params, function(err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(data.Items)
      }
    })
  })
}

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest }) => {
  const response = await queryDailes()
  const groups = _.groupBy(response, 'pk')
  const dailies = _.map(groups, (items) => {
    return _.last(items)
  })
  const { createNode } = actions

  dailies.forEach(daily => {
    const nodeContent = JSON.stringify(daily)
    const nodeMeta = {
      // the cat fact unique id is in _id
      id: createNodeId(`dailes-${daily.pk}`),
      parent: null,
      children: [],
      internal: {
        // this will be important in finding the node
        type: `Dailies`,
        content: nodeContent,
        contentDigest: createContentDigest(daily),
      },
    };
    const node = Object.assign({}, daily, nodeMeta)
    createNode(node)
  })
}
