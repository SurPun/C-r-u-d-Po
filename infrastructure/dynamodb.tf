// ------------------- DynamoDB table ------------------- //
resource "aws_dynamodb_table" "user_table" {
  name         = var.dynamo_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "Email"

  attribute {
    name = "Email"
    type = "S"
  }
}
