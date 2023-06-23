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
import {
  bucket,
  sesFeedbackBounce,
  sesFeedbackComplaint,
  sesFeedbackDelivery,
  shared,
} from './shared';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
export class SharedStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Set up a bucket
    const bucket = new s3.Bucket(this, `s3Bucket`, {
      accessControl: s3.BucketAccessControl.PUBLIC_READ,
      encryption: s3.BucketEncryption.S3_MANAGED,
      cors: [
        {
          allowedMethods: [
            s3.HttpMethods.GET,
            s3.HttpMethods.POST,
            s3.HttpMethods.HEAD,
            s3.HttpMethods.PUT,
            s3.HttpMethods.DELETE,
          ],
          allowedOrigins: ['*'],
        },
      ],
    });

    const sesFeedbackDelivery = new sns.Topic(this, `sesFeedbackDelivery`);
    const sesFeedbackBounce = new sns.Topic(this, `sesFeedbackBounce`);
    const sesFeedbackComplaint = new sns.Topic(this, `sesFeedbackComplaint`);

    shared.bucket = bucket;
    shared.sesFeedbackDelivery = sesFeedbackDelivery;
    shared.sesFeedbackBounce = sesFeedbackBounce;
    shared.sesFeedbackComplaint = sesFeedbackComplaint;

    const emailIdentity = new aws_ses.EmailIdentity(this, `jujobstest`, {
      identity: aws_ses.Identity.email('jujobstest@gmail.com'),
    });
    // const emailIdentity2 = new aws_ses.EmailIdentity(this, `develtestbot`, {
    //   identity: aws_ses.Identity.email('develtestbot@gmail.com'),
    // });
  }
}
