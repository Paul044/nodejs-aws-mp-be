import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import { Client } from 'pg';
import dbOptions from '../dbConfig';

console.log('DB CONFIG::', dbOptions);

const getAllProductsQuery = `
select 
  p.id, p.title, p.description, p.price, s.count 
from 
  products p 
left join stocks s 
 ON id = product_id
`;

const defaultHeaders = {
  'Access-Control-Allow-Origin': '*', // Required for CORS support to work
  'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
};

export const handler: APIGatewayProxyHandler = async (): Promise<
  APIGatewayProxyResult
> => {
  console.log('getProductList handler, no arguments');
  const client = new Client(dbOptions);
  try {
    await client.connect();
    const { rows: data } = await client.query(getAllProductsQuery);
    console.log('DB response::', data);
    return {
      statusCode: 200,
      body: JSON.stringify(data, null, 2),
      headers: defaultHeaders,
    };
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
