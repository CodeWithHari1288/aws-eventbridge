package com.eventbridge.api;


import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.sqs.SqsClient;
import software.amazon.awssdk.services.sqs.model.SendMessageRequest;
import software.amazon.awssdk.services.sts.StsClient;
import software.amazon.awssdk.services.sts.auth.StsAssumeRoleCredentialsProvider;

public class AbacSqsController {


        public static void main(String[] args) {
            String roleArn = "arn:aws:iam::<account>:role/AbacSqsRole";
            String sqsUrl = "https://sqs.us-east-1.amazonaws.com/<account>/sqs-abac-queue";

            StsClient client = StsClient.builder().region(Region.US_EAST_1).build();

            StsAssumeRoleCredentialsProvider credentials = StsAssumeRoleCredentialsProvider.builder()
                    .refreshRequest(r -> r
                            .roleArn(roleArn)
                            .roleSessionName("learning"))
                    .stsClient(client)
                    .build();

            SqsClient sqsClient = SqsClient.builder()
                    .region(software.amazon.awssdk.regions.Region.US_EAST_1)
                    .credentialsProvider(credentials)
                    .build();

            sqsClient.sendMessage(SendMessageRequest.builder()
                    .queueUrl(sqsUrl)
                    .messageBody("{\"Test\":\"Sending to SQS from DEV\",\"dummy\":\"DEV\"}")
                    .build());
            sqsClient.sendMessage(SendMessageRequest.builder()
                    .queueUrl(sqsUrl)
                    .messageBody("{\"Test\":\"Sending to SQS from QA\",\"dummy\":\"QA\"}")
                    .build());
            sqsClient.sendMessage(SendMessageRequest.builder()
                    .queueUrl(sqsUrl)
                    .messageBody("{\"Test\":\"Sending to SQS from QA\",\"dummy\":\"QA\"}")
                    .build());

            System.out.println("✅ Message sent using ABAC-based role");
        }
    }

