import * as cdk from 'aws-cdk-lib';
import * as events from 'aws-cdk-lib/aws-events';
import { CloudWatchLogGroup, SqsQueue } from 'aws-cdk-lib/aws-events-targets';
import { CfnDiscoverer } from 'aws-cdk-lib/aws-eventschemas';
import { AccountPrincipal, PolicyStatement, Role } from 'aws-cdk-lib/aws-iam';
import { LogGroup } from 'aws-cdk-lib/aws-logs';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AwsEventbridgeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

 
    const eventBus = new events.EventBus(this, 'EventBusLearning', {
      eventBusName: 'sqs-event-bus',
    });

    // new CfnDiscoverer(this, 'EnablingDiscoveryforEventBridge', {
    //   description: 'Enable schema discovery on custom sqs-event-bus',
    //   sourceArn: eventBus.eventBusArn,
    //   crossAccount: false 
    // });

    const queue = new Queue(this, 'EventQueue', {
      queueName: 'eventbridge-queue',
    });

    const rule = new events.Rule(this, 'EventRule', {
      eventBus,
      eventPattern: {
        source: ['restapp.detail'],
        detailType: ['detail.created'],
      },
    });

    
    const eventBridgeRole = new Role(this, 'EventBridgeRole', {
      roleName: 'EventBridgeRole',
      assumedBy: new AccountPrincipal(this.account),
      description: 'Role to be assumed to publish to EventBridge',
    });

      eventBridgeRole.addToPolicy(new PolicyStatement({
      actions: ['events:PutEvents'],
      resources: [eventBus.eventBusArn],
    }));
  
    const logGroup = new LogGroup(this, 'AWSEventBusLogs', {
      logGroupName: '/aws/events/eventbridge-logs',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });


    rule.addTarget(new SqsQueue(queue));
    rule.addTarget(new CloudWatchLogGroup(logGroup));

  }
}
