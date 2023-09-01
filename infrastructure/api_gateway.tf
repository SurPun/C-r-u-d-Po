# -------------------------------------- //
# --------- OPENAPI APIGATEWAY ---------//
# -------------------------------------- //

data "template_file" "openapi" {
  template = file("../api/openapi.yaml")
}

resource "aws_api_gateway_rest_api" "user_api" {
  name        = "user-api"
  description = "Employee API"
  body        = data.template_file.openapi.rendered
}

resource "aws_api_gateway_deployment" "user_deployment" {
  depends_on  = [aws_api_gateway_rest_api.user_api]
  rest_api_id = aws_api_gateway_rest_api.user_api.id
  stage_name  = "dev"
}
