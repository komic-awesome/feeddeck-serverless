const AWS = require("aws-sdk")
const cheerio = require('cheerio')
const axios = require('axios')
const docClient = new AWS.DynamoDB.DocumentClient()

function recordDailyToDynamodb({ namespace, links }) {
  const now = new Date()
  const params = {
    TableName: 'Dailies',
    Item:{
      pk: namespace,
      date: now.toISOString(),
      links,
    }
  }

  return new Promise((resolve, reject) => {
    docClient.put(params, function(err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

module.exports.crawl17173 = async event => {
  const resp = await axios.get("https://www.17173.com")
  const $ = cheerio.load(resp.data)

  const links = $('.pn-fs .mod-fs-info .todaytop a').map((index, element) => {
    element = $(element)

    return {
      title: element.text(),
      url: element.attr('href'),
      isHot: element.hasClass('c-red'),
    }
  }).get()

  await recordDailyToDynamodb({
    namespace: '17173',
    links,
  })

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: links,
        input: event,
      },
      null,
      2
    ),
  }
}

module.exports.crawl3dm = async event => {
  const resp = await axios.get("https://www.3dmgame.com")
  const $ = cheerio.load(resp.data)

  const links = $('.Min2_M .bt_wrap a').map((index, element) => {
    element = $(element)

    return {
      title: element.text(),
      url: element.attr('href'),
      isHot: element.hasClass('bt_a'),
    }
  }).get()

  await recordDailyToDynamodb({
    namespace: '3dm',
    links,
  })

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: links,
        input: event,
      },
      null,
      2
    ),
  }
}

module.exports.gamersky = async event => {
  const resp = await axios.get('https://www.gamersky.com')
  const $ = cheerio.load(resp.data)

  const links = $('.Mid1Mcon .bgx a').map((index, element) => {
    element = $(element)

    return {
      title: element.text(),
      url: element.attr('href'),
      isHot: element.hasClass('t'),
    }
  }).get()

  await recordDailyToDynamodb({
    namespace: 'gamersky',
    links,
  })

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: links,
        input: event,
      },
      null,
      2
    ),
  }
}
