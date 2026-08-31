package com.smartcity.controller;

import com.smartcity.service.GisService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/gis")
@CrossOrigin(origins = "*")
public class GisController {

    private final GisService gisService;

    public GisController(GisService gisService) {
        this.gisService = gisService;
    }

    @GetMapping("/zones")
    public ResponseEntity<Map<String, Object>> getGisZones(@RequestParam(defaultValue = "2030") Integer forecastYear) {
        return ResponseEntity.ok(gisService.getGisZonesWithData(forecastYear));
    }
}
