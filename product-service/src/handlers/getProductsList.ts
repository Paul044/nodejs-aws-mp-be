import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import productList from '../productList.json';
import type { ProductList } from '../models/product';
import getAgeByName from '../services/agify/methods/getAgeByName';

export const handler: APIGatewayProxyHandler = async () => {
  try {
    const productsArray: ProductList = productList;

    const products = await Promise.all(
      productsArray.map(async (product) => {
        try {
          const age = await getAgeByName(product.title);
          const mappedProduct = {
            ...product,
            title: `${product.title}, ${age} y.o.`,
          };
          return mappedProduct;
        } catch (error) {
          return product;
        }
      }),
    );
    return {
      statusCode: 200,
      body: JSON.stringify(products, null, 2),
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
      },
    };
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
