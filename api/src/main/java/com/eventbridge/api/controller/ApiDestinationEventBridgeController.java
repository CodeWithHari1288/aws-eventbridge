package com.eventbridge.api.controller;

import com.eventbridge.api.service.ApiDestinationEventBridgeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/eventsApiDestination")
public class ApiDestinationEventBridgeController {

       private final ApiDestinationEventBridgeService eventBridgeService;

        public ApiDestinationEventBridgeController(ApiDestinationEventBridgeService eventBridgeService) {
            this.eventBridgeService = eventBridgeService;
        }

        @PostMapping("/publishToAwsEventDestination")
        public ResponseEntity<String> sendEvent() {
            eventBridgeService.sendCustomEvent();
            return ResponseEntity.ok("Publish Event Bridge to APIDestination");
        }
    }
