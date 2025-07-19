import { Stack, StackProps } from "aws-cdk-lib";
import { CfnDiscoverer } from "aws-cdk-lib/aws-eventschemas";
import { Construct } from "constructs";

export class EventBridgeSchemaDiscovererStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

// Discoverer to monitor default event bus for new schema
    const discoverer = new CfnDiscoverer(this, 'EventBridgeDiscoverer', {
      sourceArn: `arn:aws:events:${this.region}:${this.account}:event-bus/sqs-event-bus`,
      description: 'Event Bridge Discoverer',
      crossAccount: false
    });
  }
}