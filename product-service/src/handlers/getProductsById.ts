import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from 'aws-lambda';
import 'source-map-support/register';
import { Client } from 'pg';

import dbOptions from '../dbConfig';

console.log('DB CONFIG::', dbOptions);

const getProductByIdQuery = `
select 
  p.id, p.title, p.description, p.price, s.count 
from 
  products p 
left join stocks s 
 ON id = product_id
where id = $1
`;

const defaultHeaders = {
  'Access-Control-Allow-Origin': '*', // Required for CORS support to work
  'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
};

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const client = new Client(dbOptions);
  try {
    const { productId } = event.pathParameters;
    console.log('getProductsById handler, parameters:', event.pathParameters);
    await client.connect();
    const {
      rows: [product],
    } = await client.query(getProductByIdQuery, [productId]);
    console.log('DB response::', product);
    let response;
    if (product) {
      response = {
        statusCode: 200,
        body: JSON.stringify(product, null, 2),
        headers: defaultHeaders,
      };
    } else {
      console.log('Product no found');
      response = {
        statusCode: 404,
        body: JSON.stringify(
          { message: `Product with ${productId} not found` },
          null,
          2,
        ),
        headers: defaultHeaders,
      };
    }

    return response;
  } catch (error) {
    console.error('Error during database request executing:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }, null, 2),
      headers: defaultHeaders,
    };
  } finally {
    console.log('DB closing connection');
    client.end();
  }
};
