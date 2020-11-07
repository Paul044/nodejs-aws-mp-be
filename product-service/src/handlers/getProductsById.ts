import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from 'aws-lambda';
import 'source-map-support/register';
import productList from '../productList.json';
import type { Product } from '../models/product';

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    let response;
    const { productId } = event.pathParameters;
    const product: Product = productList.find((el) => el.id === productId);
    if (product) {
      response = {
        statusCode: 200,
        body: JSON.stringify(product, null, 2),
        headers: {
          'Access-Control-Allow-Origin': '*', // Required for CORS support to work
          'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
        },
      };
    } else {
      response = {
        statusCode: 404,
        body: JSON.stringify(
          { message: `Product with ${productId} not found` },
          null,
          2,
        ),
        headers: {
          'Access-Control-Allow-Origin': '*', // Required for CORS support to work
          'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
        },
      };
    }
    return response;
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }, null, 2),
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
      },
    };
  }
};
