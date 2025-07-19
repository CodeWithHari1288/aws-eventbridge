import { Stack, StackProps } from "aws-cdk-lib";
import { Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { CfnSchedule } from "aws-cdk-lib/aws-scheduler";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";
import path = require("path");

export class EventBridgeSchedulerStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const eventSchedulerLambda = new lambda.Function(this, 'LambdaForEventScheduler', {
        functionName: 'lambda-eventbridge-scheduler',
        runtime: lambda.Runtime.NODEJS_18_X,      
        code :  lambda.Code.fromAsset(path.join(__dirname,'/../lambda')),
        handler : "lambda_scheduler_handler.handler"
    });

    const eventSchedulerQueue = new Queue(this, 'EventSchedulerQueue',{
        queueName: 'queue-eventbridge-scheduler'
    });

    const schedulerRole = new Role(this, 'SchedulerRole', {
      assumedBy: new ServicePrincipal('scheduler.amazonaws.com'),
    });

    eventSchedulerLambda.grantInvoke(schedulerRole);

    eventSchedulerQueue.grantSendMessages(schedulerRole);

    new CfnSchedule(this, 'EventSchedulerLambda', {
      flexibleTimeWindow: { mode: 'OFF' },
      scheduleExpression: 'rate(30 days)',
      target: {
        arn: eventSchedulerLambda.functionArn,
        roleArn: schedulerRole.roleArn,
        input: JSON.stringify({ trigger: 'lambda-scheduled-from-eventbridge' }),
      },
      name: 'EventSchedulerToLambdaOneMin',
    });

    new CfnSchedule(this, 'EventSchedulerSQS', {
      flexibleTimeWindow: { mode: 'OFF' },
      scheduleExpression: 'rate(30 days)',
      target: {
        arn: eventSchedulerQueue.queueArn,
        roleArn: schedulerRole.roleArn,
        input: JSON.stringify({ message: 'Learning AWS'}),
      },
      name: 'SQSToEventSchedulerOneMin',
    });

}
}