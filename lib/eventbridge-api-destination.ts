import { Stack, StackProps } from "aws-cdk-lib";
import { CfnApiDestination, CfnConnection, CfnRule, EventBus } from "aws-cdk-lib/aws-events";
import { AccountPrincipal, PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

export class EventBridgeApiDestinationStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
 
    const connection = new CfnConnection(this, 'ConnectionForAPIInEventBridge', {
      authorizationType: 'API_KEY',
      authParameters: {
        apiKeyAuthParameters: {
          apiKeyName: 'x-api-key',
          apiKeyValue: 'YOUR_API_KEY_HERE',
        },
      },
      name: 'ConnectionForAPIInEventBridge',
    });

    const apiDestination = new CfnApiDestination(this, 'ConnectionToApiDestination', {
      connectionArn: connection.attrArn,
      httpMethod: 'POST',
      invocationEndpoint: 'https://www.google.com/',
      invocationRateLimitPerSecond: 2,
      name: 'ConnectionToApiDestination',
    });

    const invokeRole = new Role(this, 'EventBridgeApiInvokeRole', {
      assumedBy: new ServicePrincipal('events.amazonaws.com'),
    });

    invokeRole.addToPolicy(new PolicyStatement({
      actions: ['events:InvokeApiDestination'],
      resources: [apiDestination.attrArn],
    }));

    const eventBus = new EventBus(this, 'EventBusForApiDestination', {
      eventBusName: 'event-bust-with-destination',
    });

    
        const eventBridgeRole = new Role(this, 'ApiDestinationEventBridgeRole', {
          roleName: 'ApiDestinationEventBridgeRole',
          assumedBy: new AccountPrincipal(this.account),
          description: 'Role to be assumed to publish to EventBridge for API Destination',
        });
    
          eventBridgeRole.addToPolicy(new PolicyStatement({
          actions: ['events:PutEvents'],
          resources: [eventBus.eventBusArn],
        }));

    new CfnRule(this, 'EventBridgeRuleForApiDestination', {
      eventBusName: eventBus.eventBusName,
      eventPattern: {
        source: ['testing.api'],
        detailType: ['baseUrl'],
      },
      targets: [{
        arn: apiDestination.attrArn,
        id: 'EventBridgeRuleForApiDestinationTarget',
        roleArn: invokeRole.roleArn,
      }],
    });
}
}