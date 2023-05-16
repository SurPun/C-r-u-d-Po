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

  filename = "./lambda/get_lambda.zip"

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

// DynamoDB Access Policy
resource "aws_iam_policy" "dynamoDBFullAccessPolicy" {
  name = "DynamoDBFullAccessPolicy"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = "dynamodb:*"
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_policy_attachment" "dynamoDBFullAccessAttachment" {
  name       = "dynamoDBFullAccessAttachment"
  policy_arn = aws_iam_policy.dynamoDBFullAccessPolicy.arn
  roles      = [aws_iam_role.lambda_exec.name]
}

// API Gateway
resource "aws_api_gateway_rest_api" "user_api" {
  name        = "user-api"
  description = "Employee API"
}

resource "aws_api_gateway_resource" "user_resource" {
  rest_api_id = aws_api_gateway_rest_api.user_api.id
  parent_id   = aws_api_gateway_rest_api.user_api.root_resource_id
  path_part   = "user"
}

resource "aws_api_gateway_method" "user_method" {
  rest_api_id   = aws_api_gateway_rest_api.user_api.id
  resource_id   = aws_api_gateway_resource.user_resource.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "user_integration" {
  rest_api_id = aws_api_gateway_rest_api.user_api.id
  resource_id = aws_api_gateway_resource.user_resource.id
  http_method = aws_api_gateway_method.user_method.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.user_lambda.invoke_arn
}

resource "aws_lambda_permission" "allow_api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.user_lambda.arn
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.user_api.execution_arn}/*/*/user"
}

resource "aws_api_gateway_deployment" "user_deployment" {
  depends_on  = [aws_api_gateway_integration.user_integration]
  rest_api_id = aws_api_gateway_rest_api.user_api.id
  stage_name  = "dev"
}
