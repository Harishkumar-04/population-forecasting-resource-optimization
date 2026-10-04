package com.smartcity.controller;

import com.smartcity.service.ResearchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/research")
@CrossOrigin(origins = "*")
public class ResearchController {

    private final ResearchService researchService;

    public ResearchController(ResearchService researchService) {
        this.researchService = researchService;
    }

    @GetMapping("/paper-results")
    public ResponseEntity<Map<String, Object>> getPaperResults(
            @RequestParam(required = false, defaultValue = "0") Integer zoneId) {
        return ResponseEntity.ok(researchService.getPaperResults(zoneId));
    }
}
