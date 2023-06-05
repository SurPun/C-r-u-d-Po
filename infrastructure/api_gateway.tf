// ------------------- API Gateway ------------------- //
resource "aws_api_gateway_rest_api" "user_api" {
  name        = "user-api"
  description = "Employee API"
}

// ------------------- API Gateway Resources ------------------- //
resource "aws_api_gateway_resource" "user_resource" {
  rest_api_id = aws_api_gateway_rest_api.user_api.id
  parent_id   = aws_api_gateway_rest_api.user_api.root_resource_id
  path_part   = "user"
}

// ------------------- CREATE Method ------------------- //
resource "aws_api_gateway_method" "user_create_method" {
  rest_api_id   = aws_api_gateway_rest_api.user_api.id
  resource_id   = aws_api_gateway_resource.user_resource.id
  http_method   = "POST"
  authorization = "NONE"
}

// API Gateway Integration with Lambda --
resource "aws_api_gateway_integration" "user_create_integration" {
  rest_api_id = aws_api_gateway_rest_api.user_api.id
  resource_id = aws_api_gateway_resource.user_resource.id
  http_method = aws_api_gateway_method.user_create_method.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.user_lambda.invoke_arn
}

// ------------------- GET Method ------------------- //
resource "aws_api_gateway_method" "user_get_method" {
  rest_api_id   = aws_api_gateway_rest_api.user_api.id
  resource_id   = aws_api_gateway_resource.user_resource.id
  http_method   = "GET"
  authorization = "NONE"
}

// API Gateway Integration with Lambda --
resource "aws_api_gateway_integration" "user_get_integration" {
  rest_api_id = aws_api_gateway_rest_api.user_api.id
  resource_id = aws_api_gateway_resource.user_resource.id
  http_method = aws_api_gateway_method.user_get_method.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.user_lambda.invoke_arn
}

// ------------------- PATCH Method ------------------- //
resource "aws_api_gateway_method" "user_patch_method" {
  rest_api_id   = aws_api_gateway_rest_api.user_api.id
  resource_id   = aws_api_gateway_resource.user_resource.id
  http_method   = "PATCH"
  authorization = "NONE"
}

// API Gateway Integration with Lambda --
resource "aws_api_gateway_integration" "user_patch_integration" {
  rest_api_id = aws_api_gateway_rest_api.user_api.id
  resource_id = aws_api_gateway_resource.user_resource.id
  http_method = aws_api_gateway_method.user_patch_method.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.user_lambda.invoke_arn
}

// ------------------- DELETE Method ------------------- //
resource "aws_api_gateway_method" "user_delete_method" {
  rest_api_id   = aws_api_gateway_rest_api.user_api.id
  resource_id   = aws_api_gateway_resource.user_resource.id
  http_method   = "DELETE"
  authorization = "NONE"
}

// API Gateway Integration with Lambda --
resource "aws_api_gateway_integration" "user_delete_integration" {
  rest_api_id = aws_api_gateway_rest_api.user_api.id
  resource_id = aws_api_gateway_resource.user_resource.id
  http_method = aws_api_gateway_method.user_delete_method.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.user_lambda.invoke_arn
}

// ------------------- API Deployment (How do i deploy this without console?) ------------------- //
resource "aws_api_gateway_deployment" "user_deployment" {
  depends_on  = [aws_api_gateway_integration.user_create_integration]
  rest_api_id = aws_api_gateway_rest_api.user_api.id
  stage_name  = "dev"
}
