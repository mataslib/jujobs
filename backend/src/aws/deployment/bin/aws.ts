#!/usr/bin/env node
import {App} from 'aws-cdk-lib';
import {AwsStack} from '../awsStack';
import {SharedStack} from '../sharedStack';

const app = new App();

if (!['PREVIEW', 'PRODUCTION'].includes(process.env.STAGE_ENV)) {
  throw new Error('STAGE_ENV must be PREVIEW|PRODUCTION');
}

const sharedStack = new SharedStack(app, `SharedStack`, {
  env: {
    //   account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'eu-west-1',
  },
});

const awsStack = new AwsStack(app, `AwsStack${process.env.STAGE_ENV}`, {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  env: {
    //   account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'eu-west-1',
  },

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  // env: { account: '123456789012', region: 'us-east-1' },

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});
