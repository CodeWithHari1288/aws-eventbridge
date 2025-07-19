import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import * as aws_lambda from "aws-cdk-lib/aws-lambda";
import { CfnPipe } from "aws-cdk-lib/aws-pipes";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";
import path = require("path");

export class LambdaEventbridgeStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
   
    const sourceQueue = new Queue(this, 'SourceQ', {
      visibilityTimeout: Duration.seconds(60),
      queueName: 'sqs-pipe-lambda'
    });

    const targetLambda = new aws_lambda.Function(this, 'TargetLambda', {
      functionName: 'sqsPipeLambdaAsTarget',
      runtime: aws_lambda.Runtime.NODEJS_18_X,      
      code :  aws_lambda.Code.fromAsset(path.join(__dirname,'/../lambda')),
      handler : "lambda_handler.handler"
    });

    const pipeRole = new Role(this, 'PipeRole', {
      assumedBy: new ServicePrincipal('pipes.amazonaws.com'),
    });

    sourceQueue.grantConsumeMessages(pipeRole);
    targetLambda.grantInvoke(pipeRole);

    new CfnPipe(this, 'Pipes', {
      roleArn: pipeRole.roleArn,
      source: sourceQueue.queueArn,
      sourceParameters: {
        sqsQueueParameters: {
          batchSize: 1,
        },
      },
      target: targetLambda.functionArn,
      targetParameters: {
        inputTemplate: `{
                  "messageId": <$.messageId>,
                  "body": <$.body>
                 }`,
      },
    });

  }
}
 