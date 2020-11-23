import { SQSHandler } from 'aws-lambda';
import 'source-map-support/register';
import Joi from 'joi';
import { Pool } from 'pg';
import dbOptions from '../dbConfig';
import { SNS } from 'aws-sdk';

const snsTopic= process.env.SNS_TOPIC;

const requestSchema = Joi.object({
  count: Joi.number().integer().min(0).required(),
  description: Joi.string().required(),
  price: Joi.number().integer().min(0).required(),
  title: Joi.string().required(),
});

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

export const handler: SQSHandler = async (event, _context) => {
  const sns = new SNS();
  // const client = new Client(dbOptions);
  const pool = new Pool(dbOptions);
  try {
    console.log('Catalog Batch Process event:', event);
    const productsResults = await Promise.all(
      event.Records.map(async (el) => {
        const data: {
          price: number;
          count: string;
          description: string;
          title: string;
        } = JSON.parse(el.body);

        console.log('Entity:', data);

        const { error } = requestSchema.validate(data);
        if (error) {
          throw error;
        }

        const client = await pool.connect();
        const {
          rows: [product],
        } = await client.query(postProduct, [
          data.title,
          data.description,
          data.price,
          data.count,
        ]);
        const productId = product?.product_id;
        client.release();
        console.log('DB response::', productId);
        return {product, ...data};
      }),
      
    );
    console.log('PASS results:::', productsResults);
    await sns.publish({
      Subject: "SNS NEW PRODUCTS MESSAGE::",
      Message: JSON.stringify(productsResults),
      MessageAttributes: {
        name: {
          DataType: 'String',
          StringValue: 'Pasha', // 
        },
      },
      TopicArn: snsTopic,
    })
        .promise();
    
  } catch (error) {
    console.error('Error during database request executing:', error);
  } finally {
    console.log('DB closing connection');
    // client.end();
    pool.end().then(() => console.log('pool has ended'));
  }
};
