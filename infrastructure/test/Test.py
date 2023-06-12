from pprint import pprint
import unittest
import boto3
from botocore.exceptions import ClientError
from moto import mock_dynamodb

# @mock_dynamodb is used as a decorator
@mock_dynamodb
class TestDatabaseFunctions(unittest.TestCase):

    def setUp(self):
        """
        Create database resource and mock table
        """
        self.dynamodb = boto3.resource('dynamodb', region_name='eu-west-2')

        from DynamoDB import create_user_table
        self.table = create_user_table(self.dynamodb)

    def tearDown(self):
        """
        Delete database resource and mock table
        """
        self.table.delete()
        self.dynamodb = None

    def test_table_exists(self):
        """
        Test if our mock table is ready
        """
        self.assertIn('user_table', self.table.name)
    
    """
    Test Put Method
    """
    def test_put_user(self):
        from Put import put_user

        result = put_user("jd@outlook.com", "John", "Doe", "jd2023", self.dynamodb)

        self.assertEqual(200, result['ResponseMetadata']["HTTPStatusCode"])

    """
    Test Read Method
    """
    def test_get_user(self):
        from Put import put_user
        from Get import get_user

        put_user("jd@outlook.com", "John", "Doe", "jd2023", self.dynamodb)
        result = get_user("jd@outlook.com", self.dynamodb)

        self.assertEqual("jd@outlook.com", result['Email'])
        self.assertEqual("John", result["FirstName"])
        self.assertEqual("Doe", result["LastName"])
        self.assertEqual("jd2023", result["Github"])

if __name__ == '__main__':
    unittest.main()
