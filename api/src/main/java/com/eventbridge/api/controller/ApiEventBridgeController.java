 package com.eventbridge.api.controller;


 import com.eventbridge.api.service.ApiEventBridgeService;
 import org.springframework.http.ResponseEntity;
 import org.springframework.web.bind.annotation.PostMapping;
 import org.springframework.web.bind.annotation.RequestMapping;
 import org.springframework.web.bind.annotation.RestController;

 @RestController
 @RequestMapping("/events")
 public class ApiEventBridgeController {

    private final ApiEventBridgeService eventBridgeService;

    public ApiEventBridgeController(ApiEventBridgeService eventBridgeService) {
        this.eventBridgeService = eventBridgeService;
    }

    @PostMapping("/publishToAws")
    public ResponseEntity<String> sendEvent() {
        eventBridgeService.sendCustomEvent();
        return ResponseEntity.ok("Publish Event Bridge to AWS");
    }
 }
