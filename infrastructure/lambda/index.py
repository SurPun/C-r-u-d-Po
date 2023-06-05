# ------------ Modules ------------ //
import json
import os
import boto3

dynamodb = boto3.resource('dynamodb')

# ------------ Functions ------------ //

# Create --
def add_item(table, requestJSON):
    putParams = {
        'Item': {
            'Email': requestJSON['Email'],
            'FirstName': requestJSON['FirstName'],
            'LastName': requestJSON['LastName'],
            'Github': requestJSON['Github']
        }
    }
    # ** = unpacking operator
    table.put_item(**putParams)
    # {} = placeholder for .format value
    return {'message': 'Put item {}'.format(requestJSON['Email'])}


# Read -- 
def get_items(table):
    getParams = {
        'TableName': table.name
    }
    data = table.scan(**getParams)
    items = data['Items']
    return items

# Update --
def update_item(table, editJSON):
    email = editJSON['Email']
    updateExpression = 'set'
    expressionAttributeValues = {}
    for key in editJSON:
        if key != 'Email':
            updateExpression += ' {} = :{},'.format(key, key)
            expressionAttributeValues[':' + key] = editJSON[key]
    updateExpression = updateExpression[:-1]
    updateParams = {
        'Key': {
            'Email': email
        },
        'UpdateExpression': updateExpression,
        'ExpressionAttributeValues': expressionAttributeValues,
        'ReturnValues': 'UPDATED_NEW'
    }
    table.update_item(**updateParams)
    return {'message': 'Updated item {}'.format(email)}

# Delete --
def delete_item(table, deleteRequestJSON):
    deleteParams = {
        'Key': {
            'Email': deleteRequestJSON['Email']
        }
    }
    table.delete_item(**deleteParams)
    return {'message': 'Deleted item {}'.format(deleteRequestJSON['Email'])}

# ------------ Lambda Handler ------------ //
def handler(event, context):
    httpMethod = event['httpMethod']
    response = {}
    table = dynamodb.Table(os.environ['DYNAMODB_TABLE'])

    try:
        if httpMethod == 'GET':
            items = get_items(table)
            response = {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': True
                },
                'body': json.dumps(items)
            }
        elif httpMethod == 'POST':
            requestJSON = json.loads(event['body'])
            add_item(table, requestJSON)
            response = {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': True
                },
                'body': json.dumps(add_item(table, requestJSON))
            }
        elif httpMethod == 'PATCH':
            editJSON = json.loads(event['body'])
            update_item(table, editJSON)
            response = {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': True
                },
                'body': json.dumps(update_item(table, editJSON))
            }
        elif httpMethod == 'DELETE':
            deleteRequestJSON = json.loads(event['body'])
            delete_item(table, deleteRequestJSON)
            response = {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': True
                },
                'body': json.dumps(delete_item(table, deleteRequestJSON))
            }
        else:
            response = {
                'statusCode': 400,
                'body': json.dumps('Invalid HTTP method')
            }
    except Exception as e:
        response = {
            'statusCode': 500,
            'body': json.dumps('Internal server error')
        }
    return response