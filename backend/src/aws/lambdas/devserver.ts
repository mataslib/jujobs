import bodyParser from 'body-parser';
import express from 'express';
import {readFile} from 'fs';
import {lambdas} from '../deployment/lambdaDefinitions';
import cors from 'cors';
import * as url from 'url';
import type {APIGatewayProxyEventV2} from 'aws-lambda';
// const __filename = url.fileURLToPath(import.meta.url);
// const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import lambdasEnv from './env.json';

console.log('devserver.ts');

// Two different Lambda handlers
// const { api } = require("../src/api");
// const { login } = "../src/login";
// const envFilePath = `${__dirname}/env.json`;
// let lambdasEnv;
// readFile(envFilePath, `utf-8`, (err, data) => {
//   if (err) {
//     console.error(err);
//     throw err;
//   }
//   const json = JSON.parse(data);
//   lambdasEnv = json;
// });

(async () => {
  const app = express();

  app.use(
    cors({
      // takes care of preflight request
      // so my wrapper endpoint is not executed twice!
      // (once for preflight and once for actual request)
      preflightContinue: false,
      optionsSuccessStatus: 200,
    })
  ); // allow all cors
  app.use(bodyParser.json());
  app.use(bodyParser.text());
  // app.use(bodyParser.raw());

  for (const name in lambdas) {
    const lambda = lambdas[name];
    if (!lambda?.api) {
      continue;
    }

    app[lambda.api.method.toLowerCase()](
      awsPathToExpressPath(lambda.api.path),
      lambdaProxyWrapper(name)
    );
  }

  app.listen(9999, () => console.info('Server running on port 9999...'));
})();

// sam local start-api reads env variables for lambdas from env.json

function lambdaProxyWrapper(lambdaName) {
  return async (req, res) => {
    console.log(new Date().toString());

    process.env = {
      ...process.env,
      ...lambdasEnv[lambdaName],
    };
    const handler = await import(`./${lambdaName}`);

    // fast solution, lambdas expedcts string as body
    // but express (bodyParser.text()) transforms empty body into {} for some reason
    // bit hacky since stringified "{}" is not same as "",
    // however I can't know here if .text() or .json() was used,
    // if empty body or body with empty json was passed
    // should be fixed in bodyParser v2:
    // https://github.com/expressjs/body-parser/issues/318
    const body =
      typeof req.body === 'string' ? req.body : JSON.stringify(req.body ?? '');

    const caseSenstiveHeaders = {};
    for (
      let headerIdx = 0, valueIdx = 1;
      headerIdx < req.rawHeaders.length;
      headerIdx += 2, valueIdx += 2
    ) {
      caseSenstiveHeaders[req.rawHeaders[headerIdx]] = req.rawHeaders[valueIdx];
    }

    // Here we convert the request into a Lambda event
    const event: APIGatewayProxyEventV2 = {
      // httpMethod: req.method,
      queryStringParameters: req.query,
      pathParameters: {
        ...req.params,
      },
      rawQueryString: req._parsedUrl.query,
      headers: caseSenstiveHeaders,
      body: body,
    };

    const response = await handler.handler(event, null);
    res.status(response.statusCode);
    res.set(response.headers);

    return res.send(response.body);
    // return res.json(JSON.parse(response.body));
  };
}

function awsPathToExpressPath(awsPath) {
  return awsPath.replace(/\{([^}]+)\}/g, ':$1');
}
