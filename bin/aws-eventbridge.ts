#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { AwsEventbridgeStack } from '../lib/aws-eventbridge-stack';
import { LambdaEventbridgeStack } from '../lib/lambda-eventbridge-stack';
import { EventBridgeSchedulerStack } from '../lib/eventbridge-scheduler';
import { EventBridgeApiDestinationStack } from '../lib/eventbridge-api-destination';
import { EventBridgeSchemaDiscovererStack } from '../lib/eventbridge-schema-discoverer';

const app = new cdk.App();
new AwsEventbridgeStack(app, 'AwsEventbridgeStack', {
  env: {
    account : process.env.CDK_DEFAULT_ACCOUNT,
    region : 'us-east-1'
}
});

new LambdaEventbridgeStack(app, 'LambdaEventbridgeStack', {
  env: {
    account : process.env.CDK_DEFAULT_ACCOUNT,
    region : 'us-east-1'
}
});

new EventBridgeSchedulerStack(app, 'EventBridgeSchedulerStack', {
  env: {
    account : process.env.CDK_DEFAULT_ACCOUNT,
    region : 'us-east-1'
}
})

new EventBridgeApiDestinationStack(app, 'EventBridgeApiDestination', {
  env: {
    account : process.env.CDK_DEFAULT_ACCOUNT,
    region : 'us-east-1'
}
})

new EventBridgeSchemaDiscovererStack(app, 'EventBridgeSchemaDiscoverer', {
  env: {
    account : process.env.CDK_DEFAULT_ACCOUNT,
    region : 'us-east-1'
}
})