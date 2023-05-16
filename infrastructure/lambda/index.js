const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE
  };

  try {
    const data = await dynamoDB.scan(params).promise();
    const items = data.Items;

    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials" : true 
      },
      body: JSON.stringify(items)
    };

    return response;
  } catch (error) {
    console.error('Error fetching table items:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error fetching table items' })
    };
  }
};