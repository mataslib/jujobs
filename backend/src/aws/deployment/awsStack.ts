import {
  aws_iam as iam,
  aws_sns as sns,
  aws_sns_subscriptions as snsSubscriptions,
  Duration,
  Stack,
  StackProps,
  aws_ses,
} from 'aws-cdk-lib';
import {CfnFunction, Runtime, Tracing} from 'aws-cdk-lib/aws-lambda';
import {
  NodejsFunction,
  NodejsFunctionProps,
} from 'aws-cdk-lib/aws-lambda-nodejs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import {LogGroup, RetentionDays} from 'aws-cdk-lib/aws-logs';

import {CorsHttpMethod, HttpApi} from '@aws-cdk/aws-apigatewayv2-alpha';
import {HttpLambdaIntegration} from '@aws-cdk/aws-apigatewayv2-integrations-alpha';

import {Construct} from 'constructs';
import {lambdas} from './lambdaDefinitions';

import {join} from 'path';
import {CfnStage} from 'aws-cdk-lib/aws-apigatewayv2';
import {shared} from './shared';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
export class AwsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: [
          'aws-sdk', // Use the 'aws-sdk' available in the Lambda runtime
        ],
      },
      // will install npm deps from package-lock.json
      // depsLockFilePath: join(__dirname, "lambdas", "package-lock.json"),
      runtime: Runtime.NODEJS_16_X,
    };

    // Create an API Gateway resource

    const httpApi = new HttpApi(this, `HttpApi${process.env.STAGE_ENV}`, {
      corsPreflight: {
        allowOrigins: ['*'],
        allowHeaders: ['*'],
        allowMethods: [CorsHttpMethod.ANY],
      },
    });

    // Enable access logging https://www.kevinwmcconnell.com/cdk/http-api-logs-with-cdk
    const apiAccessLog = new LogGroup(
      this,
      `ApiAccessLog${process.env.STAGE_ENV}`,
      {
        retention: RetentionDays.THREE_MONTHS,
      }
    );
    const cfnStage = httpApi.defaultStage!.node.defaultChild as CfnStage;
    cfnStage.accessLogSettings = {
      destinationArn: apiAccessLog.logGroupArn,
      format: JSON.stringify({
        requestId: '$context.requestId',
        userAgent: '$context.identity.userAgent',
        sourceIp: '$context.identity.sourceIp',
        requestTime: '$context.requestTime',
        httpMethod: '$context.httpMethod',
        path: '$context.path',
        status: '$context.status',
        responseLength: '$context.responseLength',
        'authorizer.error': '$context.authorizer.error',
        'error.message': '$context.error.message',
        'integration.error': '$context.integration.error',
        'integration.latency': '$context.integration.latency',
        'integration.integrationStatus':
          '$context.integration.integrationStatus',
        'integration.status': '$context.integration.status',
      }),
    };

    const lambdaFunctions: {[key: string]: NodejsFunction} = {};

    // let self = this;
    for (const key in lambdas) {
      // skip some lambda in case of manual troubleshooting
      // (if skipped, will delete lambda on deploy)
      if ([''].includes(key)) {
        continue;
      }

      const lambda = lambdas[key as keyof typeof lambdas];

      const lambdaFunction = new NodejsFunction(this, lambda.id, {
        entry: join(__dirname, '..', 'lambdas', lambda.file),
        ...nodeJsFunctionProps,
        environment: {
          NODE_OPTIONS: '--enable-source-maps',
          // env variable must be specified ot be overridable when local testing,
          MONGODB_URI:
            'mongodb+srv://root:root@cluster0.rturq.mongodb.net/default?retryWrites=true&w=majority',
        },
        bundling: {
          sourceMap: true,
          // sourceMapMode: SourceMapMode.INLINE,
          sourcesContent: false,
          minify: true,
          environment: {
            NODE_ENV: 'development',
            NODE_OPTIONS: '--enable-source-maps',
          },
        },
        timeout: Duration.seconds(10),
        tracing: Tracing.ACTIVE,
        logRetention: RetentionDays.THREE_MONTHS,
      });

      (lambdaFunction.node.defaultChild as CfnFunction).overrideLogicalId(
        // .env referencuju podle tohodle logicalId, kdyz chci davat env vars hodnoty.
        lambda.logicalId
      );
      // const lambdaIntegration = new LambdaIntegration(lambdaFunction, {
      //   proxy: true,
      // });
      if ('api' in lambda) {
        const lambdaIntegration = new HttpLambdaIntegration(
          lambda.id,
          lambdaFunction
        );
        httpApi.addRoutes({
          path: lambda.api.path,
          methods: [lambda.api.method],
          integration: lambdaIntegration,
        });
      }

      lambdaFunctions[key] = lambdaFunction;
    }

    lambdaFunctions['registerAdvertiser'].addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'ses:SendEmail',
          'ses:SendRawEmail',
          'ses:SendTemplatedEmail',
        ],
        resources: ['*'],
      })
    );
    lambdaFunctions['requestForgottenPassword'].addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'ses:SendEmail',
          'ses:SendRawEmail',
          'ses:SendTemplatedEmail',
        ],
        resources: ['*'],
      })
    );
    lambdaFunctions['requestEmailChange'].addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'ses:SendEmail',
          'ses:SendRawEmail',
          'ses:SendTemplatedEmail',
        ],
        resources: ['*'],
      })
    );

    shared.bucket.grantPut(lambdaFunctions.updateAdvertiserProfile);
    shared.bucket.grantPutAcl(lambdaFunctions.updateAdvertiserProfile);
    shared.sesFeedbackDelivery.addSubscription(
      new snsSubscriptions.LambdaSubscription(lambdaFunctions['sesFeedback'])
    );
    shared.sesFeedbackBounce.addSubscription(
      new snsSubscriptions.LambdaSubscription(lambdaFunctions['sesFeedback'])
    );
    shared.sesFeedbackComplaint.addSubscription(
      new snsSubscriptions.LambdaSubscription(lambdaFunctions['sesFeedback'])
    );
  }
}
