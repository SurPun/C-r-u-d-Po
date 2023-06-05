provider "aws" {
  region = "eu-west-2"
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

// Lambda permission
resource "aws_lambda_permission" "allow_api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.user_lambda.arn
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.user_api.execution_arn}/*/*/user"
}
