provider "aws" {
  region = "eu-west-2"
}

// DynamoDB table
resource "aws_dynamodb_table" "user_table" {
  name         = "user-table"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "UserId"

  attribute {
    name = "UserId"
    type = "S"
  }
}

// Lambda function
resource "aws_lambda_function" "user_lambda" {
  function_name = "user_lambda"
  handler       = "index.handler"
  runtime       = "nodejs14.x"
  role          = aws_iam_role.lambda_exec.arn

  filename = "./lambda/lambda_function_payload.zip"

  environment {
    variables = {
      DYNAMODB_TABLE = aws_dynamodb_table.user_table.name
    }
  }
}

// IAM role for Lambda
resource "aws_iam_role" "lambda_exec" {
  name = "user_lambda_exec"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_exec" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  role       = aws_iam_role.lambda_exec.name
}
