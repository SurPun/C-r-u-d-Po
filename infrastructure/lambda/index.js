const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const tableName = process.env.DYNAMODB_TABLE;

  let response;
  try {
    switch (event.httpMethod) {
      // READ DATA
      case 'GET':
        const getParams = {
          TableName: tableName
        };
        const data = await dynamoDB.scan(getParams).promise();
        const items = data.Items;
        response = {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": "*", // Required for CORS support to work
            "Access-Control-Allow-Credentials": true
          },
          body: JSON.stringify(items)
        };
        break;
      
      // CREATE DATA
      case 'PUT':
        const requestJSON = JSON.parse(event.body);
        const putParams = {
          TableName: tableName,
          Item: {
            Email: requestJSON.Email, 
            FirstName: requestJSON.FirstName,
            LastName: requestJSON.LastName,
            Github: requestJSON.GitHub
          }
        };
        await dynamoDB.put(putParams).promise();
        response = {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": "*", // Required for CORS support to work
            "Access-Control-Allow-Credentials": true
          },
          body: JSON.stringify({ message: `Put item ${requestJSON.Email}` })
        };
        break;
        
        //UPDATE DATA
        case 'PATCH':
          const editJSON = JSON.parse(event.body);
          const email = editJSON.Email;
        
          // Create the update expression and expression attribute values
          let updateExpression = 'set';
          let expressionAttributeValues = {};
          for (const key in editJSON) {
            if (key !== 'Email') {
              updateExpression += ` ${key} = :${key},`;
              expressionAttributeValues[`:${key}`] = editJSON[key];
            }
          }
          updateExpression = updateExpression.slice(0, -1);
        
          // Update the item in DynamoDB
          const updateParams = {
            TableName: tableName,
            Key: {
              Email: email
            },
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'UPDATED_NEW'
          };
          await dynamoDB.update(updateParams).promise();
          response = {
            statusCode: 200,
            headers: {
              "Access-Control-Allow-Origin": "*", // Required for CORS support to work
              "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({ message: `Updated item ${email}` })
          };
          break;
        
        //DELETE DATA
        case 'DELETE':
          const deleteRequestJSON = JSON.parse(event.body);
          const deleteParams = {
            TableName: tableName,
            Key: {
              Email: deleteRequestJSON.Email
            }
          };
          await dynamoDB.delete(deleteParams).promise();
          response = {
            statusCode: 200,
            headers: {
              "Access-Control-Allow-Origin": "*", // Required for CORS support to work
              "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({ message: `Deleted item ${deleteRequestJSON.Email}` })
          };
          break;
      
      default:
        response = {
          statusCode: 400,
          body: JSON.stringify({ message: `Invalid httpMethod: ${event}` }),
        };
    }
    return response;
  } catch (error) {
  console.error('Error:', error);
  return {
    statusCode: 500,
    body: JSON.stringify({ message: 'Error processing request', error: error })
  };
}
};
