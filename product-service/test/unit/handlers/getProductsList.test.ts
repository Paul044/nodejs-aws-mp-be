import { APIGatewayProxyEvent } from 'aws-lambda';
import utils from 'aws-lambda-test-utils';
import { handler } from '../../../src/handlers/getProductsList';

const mockGetAgeByName = jest.fn();
jest.mock('../../../src/services/agify/methods/getAgeByName', () => {
  return (...data) => {
    mockGetAgeByName(...data);
  };
});

describe('getProductsById', () => {
  afterEach(() => jest.clearAllMocks());
  it('should return array of correct length', async () => {
    const event: APIGatewayProxyEvent = utils.mockEventCreator.createAPIGatewayEvent() as APIGatewayProxyEvent;
    expect.assertions(1);
    const response = await handler(event, null, null);
    if (response) {
      const data = JSON.parse(response.body);
      expect(data.length).toEqual(9);
    }
  });
  it('should call external api with existed item', async () => {
    const event: APIGatewayProxyEvent = utils.mockEventCreator.createAPIGatewayEvent() as APIGatewayProxyEvent;
    expect.assertions(1);
    const response = await handler(event, null, null);
    if (response) {
      expect(mockGetAgeByName).toBeCalledWith('Pasha');
    }
  });
  it('should not call external api with missing item', async () => {
    const event: APIGatewayProxyEvent = utils.mockEventCreator.createAPIGatewayEvent() as APIGatewayProxyEvent;
    expect.assertions(1);
    const response = await handler(event, null, null);
    if (response) {
      expect(mockGetAgeByName).not.toBeCalledWith('Jim');
    }
  });
});
