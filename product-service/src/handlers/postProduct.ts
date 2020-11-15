import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from 'aws-lambda';
import 'source-map-support/register';
import Joi from 'joi';
import { Client } from 'pg';
import dbOptions from '../dbConfig';

console.log('DB CONFIG::', dbOptions);

const postProduct = ` 
  with ans1 as (
    insert into products(title, description, price) 
    values($1, $2, $3)
    returning id
  )
  insert into stocks (product_id, count)
  values (
    (select id from ans1), $4
  )
  returning product_id;
 `;

const defaultHeaders = {
  'Access-Control-Allow-Origin': '*', // Required for CORS support to work
  'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
};

const requestSchema = Joi.object({
  count: Joi.number().integer().min(0).required(),
  description: Joi.string().required(),
  price: Joi.number().integer().min(0).required(),
  title: Joi.string().required(),
});

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const client = new Client(dbOptions);
  try {
    const data: {
      price: number;
      count: string;
      description: string;
      title: string;
    } = JSON.parse(event.body);
    console.log('postProduct handler, parameters:', data);

    const { error } = requestSchema.validate(data);
    if (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: error.message }, null, 2),
        headers: defaultHeaders,
      };
    }

    await client.connect();
    const {
      rows: [product],
    } = await client.query(postProduct, [
      data.title,
      data.description,
      data.price,
      data.count,
    ]);
    const productId = product?.product_id;
    console.log('DB response::', productId);
    return {
      statusCode: 200,
      body: JSON.stringify(
        { message: `Prodcut with ${productId} created` },
        null,
        2,
      ),
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
