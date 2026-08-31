package com.smartcity.controller;

import com.smartcity.dto.ResourceDemandDto;
import com.smartcity.entity.ResourceParameters;
import com.smartcity.service.ResourceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resource")
@CrossOrigin(origins = "*")
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @GetMapping("/demand/zone/{zoneId}")
    public ResponseEntity<ResourceDemandDto> getResourceDemandForZone(@PathVariable Integer zoneId,
                                                                      @RequestParam(defaultValue = "2030") Integer forecastYear) {
        return ResponseEntity.ok(resourceService.getResourceDemandForZone(zoneId, forecastYear));
    }

    @GetMapping("/demand")
    public ResponseEntity<List<ResourceDemandDto>> getAllResourceDemands(@RequestParam(defaultValue = "2030") Integer forecastYear) {
        return ResponseEntity.ok(resourceService.getAllResourceDemands(forecastYear));
    }

    @GetMapping("/parameters")
    public ResponseEntity<List<ResourceParameters>> getParameters() {
        return ResponseEntity.ok(resourceService.getPlanningParameters());
    }
}
