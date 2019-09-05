#!/usr/bin/env node

const AWS = require("aws-sdk")
const dynamodb = new AWS.DynamoDB({'region': 'us-east-1'})

const params = {
  TableName : "Dailies",
  KeySchema: [
    { AttributeName: "pk", KeyType: "HASH" },  //Partition key
    { AttributeName: "date", KeyType: "RANGE" }  //Sort key
  ],
  AttributeDefinitions: [
    { AttributeName: "pk", AttributeType: "S" },
    { AttributeName: "date", AttributeType: "S" }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 10, 
    WriteCapacityUnits: 10
  }
}

dynamodb.createTable(params, function(err, data) {
  if (err) {
    console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2))
  } else {
    console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2))
  }
})
