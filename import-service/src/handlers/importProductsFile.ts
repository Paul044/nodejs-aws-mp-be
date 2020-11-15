import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import { S3 } from "aws-sdk";

const defaultHeaders = {
  'Access-Control-Allow-Origin': '*', // Required for CORS support to work
  'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
};


export const handler: APIGatewayProxyHandler = async (event, _context) => {
  const fileName = event.queryStringParameters.name;
  const path = `uploaded/${fileName}`;

  const s3 = new S3({ region: "us-east-1" });
  const params = {
    Bucket: "import-bucket-aws",
    Key: path,
    Expires: 3600,
    ContentType: "text/csv"
  };

  let res;
  try {
    res = await s3.getSignedUrl('putObject', params);
  } finally {
  }

  return {
    statusCode: 200,
    body: res,
    headers: defaultHeaders,
  };
};
