from pprint import pprint
import boto3
from botocore.exceptions import ClientError

def get_user(Email, dynamodb=None):
    if not dynamodb:
        dynamodb = boto3.resource('dynamodb', endpoint_url="http://localhost:8000")

    table = dynamodb.Table('user_table')

    try:
        response = table.get_item(Key={'Email': Email})
    except ClientError as e:
        print(e.response['Error']['Message'])
    else:
        return response['Item']
    
if __name__ == '__main__':
    user = get_user("jd@outlook.com")
    if user:
        print("Get user succeeded")
        pprint(user, sort_dicts=False) 