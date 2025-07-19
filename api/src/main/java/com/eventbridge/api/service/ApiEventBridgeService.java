package com.eventbridge.api.service;

import org.springframework.stereotype.Service;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.eventbridge.EventBridgeClient;
import software.amazon.awssdk.services.eventbridge.model.*;
import software.amazon.awssdk.services.sts.StsClient;
import software.amazon.awssdk.services.sts.auth.StsAssumeRoleCredentialsProvider;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class ApiEventBridgeService {

    private final EventBridgeClient eventBridgeClient;

    public ApiEventBridgeService() {

        StsClient client = StsClient.builder().region(Region.US_EAST_1).build();

        StsAssumeRoleCredentialsProvider credentials = StsAssumeRoleCredentialsProvider.builder()
                .refreshRequest(r -> r
                        .roleArn("arn:aws:iam::<account>:role/EventBridgeRole")
                        .roleSessionName("learning"))
                .stsClient(client)
                .build();

        this.eventBridgeClient = EventBridgeClient.builder()
                .credentialsProvider(credentials)
                .region(Region.US_EAST_1)
                .build();

    }

    public void sendCustomEvent() {

        List<String> string = Arrays.asList("Learning","AWS Event Bridge","for certification");
        PutEventsRequestEntry entry = PutEventsRequestEntry.builder()
                .eventBusName("sqs-event-bus") // replace with your EventBus
                .source("restapp.detail")
                .detailType("detail.created")
                .detail("{\"TestId\": \"" + String.join(" ",string) + "\", \"TestString\": \"Publish to AWS\"}")
                .time(Instant.now())
                .build();

        PutEventsRequest request = PutEventsRequest.builder()
                .entries(entry)
                .build();

        PutEventsResponse response = eventBridgeClient.putEvents(request);
    }
}
