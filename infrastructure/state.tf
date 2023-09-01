# Backend Tfstate, uncomment to use after bucket creation
# terraform {
#  backend "s3" {
#    bucket         = "sp-crud-tfstate"
#    key            = "terraform.tfstate"
#    region         = "eu-west-2"
#    encrypt        = true
#    kms_key_id     = "alias/sp-crud-key"
#    dynamodb_table = "sp-crud-tf-lock"
#  }
# }

# KMS Key & Alias to allow for the encryption of the state bucket
resource "aws_kms_key" "terraform-bucket-key" {
 description             = "This key is used to encrypt bucket objects"
 deletion_window_in_days = 10
 enable_key_rotation     = true
}

resource "aws_kms_alias" "key-alias" {
 name          = "alias/sp-crud-key"
 target_key_id = aws_kms_key.terraform-bucket-key.key_id
}

# S3 Bucket to store tf.state file
resource "aws_s3_bucket" "terraform-state" {
 bucket = "sp-crud-tfstate"
}

# S3 Versioning = Enabled
resource "aws_s3_bucket_versioning" "terraform-state-versioning" {
  bucket = aws_s3_bucket.terraform-state.id
  versioning_configuration {
    status = "Enabled"
  }
}

# S3 Public Access = Blocked
resource "aws_s3_bucket_public_access_block" "block" {
 bucket = aws_s3_bucket.terraform-state.id

 block_public_acls       = true
 block_public_policy     = true
 ignore_public_acls      = true
 restrict_public_buckets = true
}

# DynamoDB Lock Prevention to prevent two team members from writing to the state file at the same time.
resource "aws_dynamodb_table" "terraform-state" {
 name           = "sp-crud-tf-lock"
 read_capacity  = 20
 write_capacity = 20
 hash_key       = "LockID"

 attribute {
   name = "LockID"
   type = "S"
 }
}