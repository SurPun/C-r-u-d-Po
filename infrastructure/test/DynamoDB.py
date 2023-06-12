from pprint import pprint
import boto3

# Create DynamoDB table 'user_table' with the primary-key (Email)
def create_user_table(dynamodb=None):
    if not dynamodb:
        dynamodb = boto3.resource('dynamodb', endpoint_url='http://localhost:8000')

    table = dynamodb.create_table(
        TableName='user_table',
        KeySchema=[
            {
                'AttributeName': 'Email',
                'KeyType': 'HASH'
            }
        ],
        AttributeDefinitions=[
            {
                'AttributeName': 'Email',
                'AttributeType': 'S'
            }
        ],
        ProvisionedThroughput={
            'ReadCapacityUnits': 1,
            'WriteCapacityUnits': 1
        }
    )

    # Wait until the table exists.
    table.meta.client.get_waiter('table_exists').wait(TableName='user_table')
    assert table.table_status == 'ACTIVE'

    return table

if __name__ == '__main__':
    user_table = create_user_table()
    print("Table status:", user_table.table_status)