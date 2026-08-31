package com.smartcity.controller;

import com.smartcity.dto.DashboardSummaryDto;
import com.smartcity.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryDto> getSummary(@RequestParam(defaultValue = "2030") Integer forecastYear) {
        return ResponseEntity.ok(dashboardService.getDashboardSummary(forecastYear));
    }
}
