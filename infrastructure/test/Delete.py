from pprint import pprint
import boto3
from botocore.exceptions import ClientError

def delete_user(Email, dynamodb=None):
    if not dynamodb:
        dynamodb = boto3.resource('dynamodb', endpoint_url="http://localhost:8000")

    table = dynamodb.Table('user_table')

    response = table.delete_item(
        Key={
            'Email': Email
        }
    )

    return response
    