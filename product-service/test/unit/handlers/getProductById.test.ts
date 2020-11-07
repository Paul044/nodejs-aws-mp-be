import { APIGatewayProxyEvent } from 'aws-lambda';
import utils from 'aws-lambda-test-utils';
import { handler } from '../../../src/handlers/getProductsById';

describe('getProductsById', () => {
  it('should return correct item when correct id provided', async () => {
    const event: APIGatewayProxyEvent = utils.mockEventCreator.createAPIGatewayEvent(
      {
        pathParameters: { productId: '7567ec4b-b10c-48c5-9345-fc73c48a80aa' },
      },
    ) as APIGatewayProxyEvent;
    expect.assertions(1);
    const response = await handler(event, null, null);
    if (response) {
      const data = JSON.parse(response.body);
      expect(data).toEqual({
        count: 4,
        description: 'Pasha',
        id: '7567ec4b-b10c-48c5-9345-fc73c48a80aa',
        price: 2.4,
        title: 'Pasha',
      });
    }
  });

  it('should return return correct response status when product were found', async () => {
    const event: APIGatewayProxyEvent = utils.mockEventCreator.createAPIGatewayEvent(
      {
        pathParameters: { productId: '7567ec4b-b10c-48c5-9345-fc73c48a80aa' },
      },
    ) as APIGatewayProxyEvent;
    expect.assertions(1);
    const response = await handler(event, null, null);
    if (response) {
      expect(response.statusCode).toEqual(200);
    }
  });

  it('should return error when provided product id is missing', async () => {
    const event: APIGatewayProxyEvent = utils.mockEventCreator.createAPIGatewayEvent(
      {
        pathParameters: { productId: 'sss' },
      },
    ) as APIGatewayProxyEvent;
    expect.assertions(1);
    const response = await handler(event, null, null);
    if (response) {
      const data = JSON.parse(response.body);
      expect(data).toEqual({
        message: 'Product with sss not found',
      });
    }
  });

  it('should return return correct response status when product was not found', async () => {
    const event: APIGatewayProxyEvent = utils.mockEventCreator.createAPIGatewayEvent(
      {
        pathParameters: { productId: 'sss' },
      },
    ) as APIGatewayProxyEvent;
    expect.assertions(1);
    const response = await handler(event, null, null);
    if (response) {
      expect(response.statusCode).toEqual(404);
    }
  });
});
