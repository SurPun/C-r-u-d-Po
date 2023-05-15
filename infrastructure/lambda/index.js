const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE
  };

  try {
    const data = await dynamoDB.scan(params).promise();
    const items = data.Items;

    console.log('Items:', items);

    return {
      statusCode: 200,
      body: JSON.stringify(items)
    };
  } catch (error) {
    console.error('Error fetching table items:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error fetching table items' })
    };
  }
};
