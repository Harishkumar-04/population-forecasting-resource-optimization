package com.smartcity.controller;

import com.smartcity.dto.DataSummaryDto;
import com.smartcity.entity.PopulationData;
import com.smartcity.entity.UrbanZone;
import com.smartcity.service.DataService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/data")
@CrossOrigin(origins = "*")
public class DataController {

    private final DataService dataService;

    public DataController(DataService dataService) {
        this.dataService = dataService;
    }

    @GetMapping("/summary")
    public ResponseEntity<DataSummaryDto> getSummary() {
        return ResponseEntity.ok(dataService.getDataSummary());
    }

    @GetMapping("/zones")
    public ResponseEntity<List<UrbanZone>> getZones() {
        return ResponseEntity.ok(dataService.getAllZones());
    }

    @GetMapping("/years")
    public ResponseEntity<List<Integer>> getYears() {
        return ResponseEntity.ok(dataService.getAllYears());
    }

    @GetMapping("/records")
    public ResponseEntity<List<PopulationData>> getRecords(@RequestParam(required = false) Integer zoneId) {
        if (zoneId != null) {
            return ResponseEntity.ok(dataService.getRecordsByZone(zoneId));
        }
        return ResponseEntity.ok(dataService.getAllRecords());
    }

    @PostMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateDataset() {
        return ResponseEntity.ok(dataService.getQualityReport());
    }

    @GetMapping("/quality")
    public ResponseEntity<Map<String, Object>> getQuality() {
        return ResponseEntity.ok(dataService.getQualityReport());
    }
}
