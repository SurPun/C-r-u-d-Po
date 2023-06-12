from pprint import pprint
import boto3
from botocore.exceptions import ClientError

def put_user(Email, FirstName, LastName, Github, dynamodb=None):
    if not dynamodb:
        dynamodb = boto3.resource('dynamodb', endpoint_url="http://localhost:8000")

    table = dynamodb.Table('user_table')
    response = table.put_item(
        Item={
            'Email': Email,
            'FirstName': FirstName,
            'LastName': LastName,
            'Github': Github
        }
    )
    return response

if __name__ == '__main__':
    user_resp = put_user("jd@outlook.com", "John",
                           "Doe", "jd2023")
    print("Put user succeeded:")
    pprint(user_resp, sort_dicts=False)