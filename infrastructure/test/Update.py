from pprint import pprint
import boto3

def update_user(Email, FirstName, LastName, Github, dynamodb=None):
    if not dynamodb:
        dynamodb = boto3.resource('dynamodb', endpoint_url="http://localhost:8000")

    table = dynamodb.Table('user_table')

    response = table.update_item(
        Key={
            'Email': Email
        },
        UpdateExpression='SET FirstName = :val1, LastName = :val2, Github = :val3',
        ExpressionAttributeValues={
            ':val1': FirstName,
            ':val2': LastName,
            ':val3': Github
        }
    )
    return response

