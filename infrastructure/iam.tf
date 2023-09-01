// ------------------- IAM role for Lambda ------------------- //
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

// Attatch Policy to Role --
resource "aws_iam_role_policy_attachment" "lambda_exec" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  role       = aws_iam_role.lambda_exec.name
}

// ------------------- DynamoDB Access Policy ------------------- //
resource "aws_iam_policy" "dynamoDBFullAccessPolicy" {
  name = "DynamoDBFullAccessPolicy"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = "dynamodb:*"
        Resource = "arn:aws:dynamodb:eu-west-2:900332192728:table/user_table"
      }
    ]
  })
}

// Attatch Policy to Role --
resource "aws_iam_policy_attachment" "dynamoDBFullAccessAttachment" {
  name       = "dynamoDBFullAccessAttachment"
  policy_arn = aws_iam_policy.dynamoDBFullAccessPolicy.arn
  roles      = [aws_iam_role.lambda_exec.name]
}
