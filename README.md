# Crud-Appp
A Simple Crud Application using AWS Api gateway, dynamodb &amp; lambda

Sprint 1

The application should be able to :

- [x] Create data
- [x] Read data
- [x] Update data
- [x] Delete data

Stretch Goal :

- [x] Style Frontend

Sprint 2

- [x] Refactor
- [x] Change lambda function from JS to Python
- [x] Testing

Sprint 3

- [x] Use OpenApi
- [x] Terraform State (S3)

# Common Issues

## CROS-Headers

After the API Gateway resource is created by terraform, there is a manual step that is required in order for the API to work. 

Firstly - We need to enable CORS for the API Gateway using AWS console, in the console click the API Gateway then the resource (in this case /user), in resource details we enable CORS by ticking all 5 methods (DELETE, GET, OPTION, PATCH, POST).

After saving the CORS and enabling it, we then need to deploy the api to the stage. When we run terraform apply, it creates all the infrastructure as well as the stage "dev".

Lastly we just need to update the api key in script.js with our api gateway url.

- API Gateway - stages - dev - copy invoke URL, then add "/user" which is our api endpoint , it should look something like this:

`https://u4eaceastb.execute-api.eu-west-2.amazonaws.com/dev/user`

