from pprint import pprint
import unittest
import boto3
from botocore.exceptions import ClientError
from moto import mock_dynamodb

# @mock_dynamodb2 is used as a decorator
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

    """
    Test Update Method
    """
    def test_update_user(self):
        from Put import put_user
        from Get import get_user
        from Update import update_user

        put_user("jd@outlook.com", "John", "Doe", "jd2023", self.dynamodb)
        update_user("jd@outlook.com", "Suraj", "Pun", "SurPun", self.dynamodb)
        result = get_user("jd@outlook.com", self.dynamodb)

        self.assertEqual("jd@outlook.com", result['Email'])
        self.assertEqual("Suraj", result["FirstName"])
        self.assertEqual("Pun", result["LastName"])
        self.assertEqual("SurPun", result["Github"])

    """
    Test Delete Method
    """
    def test_delete_user(self):
        from Put import put_user
        from Get import get_user
        from Update import update_user
        from Delete import delete_user

        put_user("jd@outlook.com", "John", "Doe", "jd2023", self.dynamodb)
        
        """
        # Scan Items in Table After Put
        """
        # response = self.table.scan()
        # items = response['Items']
        # print('Put_User Success, Total Items in Table:', len(items))

        delete_user("jd@outlook.com", self.dynamodb)

        """
        # Scan Items in Table After Del
        """
        response2 = self.table.scan()
        items2 = response2['Items']
        # print('Del_User Success, Total Items in Table:', len(items2))

        result = len(items2)

        self.assertEqual(0, result)

if __name__ == '__main__':
    unittest.main()
