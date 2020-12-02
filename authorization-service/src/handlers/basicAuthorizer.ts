import type { APIGatewayAuthorizerHandler } from 'aws-lambda';
import 'source-map-support/register';

const generatePolicy = (
  principalId: string,
  resource: string,
  effect: string,
) => {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };
};

export const handler: APIGatewayAuthorizerHandler = (event, _context, cb) => {
  console.log('Event: ', event);

  if (event.type !== 'TOKEN') {
    cb('Unauthorized');
    return;
  }

  try {
    const token = event.authorizationToken;
    const encodedCreds = token.split(' ')[1];
    const plainCreds = Buffer.from(encodedCreds, 'base64').toString('utf-8');

    const [username, password] = plainCreds.split(':');

    console.log('Credentials: ', plainCreds);

    const storedUserPassword = process.env[username];

    const isAuthorized = storedUserPassword && storedUserPassword === password;

    const effect = isAuthorized ? 'Allow' : 'Deny';

    const policy = generatePolicy('import', event.methodArn, effect);

    cb(null, policy);
  } catch (error) {
    console.error(error);

    cb('Unauthorized');
  }
};
