package com.smartcity.controller;

import com.smartcity.dto.ForecastDto;
import com.smartcity.service.ForecastService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/forecast")
@CrossOrigin(origins = "*")
public class ForecastController {

    private final ForecastService forecastService;

    public ForecastController(ForecastService forecastService) {
        this.forecastService = forecastService;
    }

    @GetMapping("/zone/{zoneId}")
    public ResponseEntity<ForecastDto> getForecastForZone(@PathVariable Integer zoneId,
                                                          @RequestParam(defaultValue = "2030") Integer forecastYear) {
        return ResponseEntity.ok(forecastService.getForecastForZone(zoneId, forecastYear));
    }

    @GetMapping("/all")
    public ResponseEntity<List<ForecastDto>> getAllForecasts(@RequestParam(defaultValue = "2030") Integer forecastYear) {
        return ResponseEntity.ok(forecastService.getAllForecasts(forecastYear));
    }

    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> getMetrics() {
        return ResponseEntity.ok(forecastService.getModelMetrics());
    }
}
