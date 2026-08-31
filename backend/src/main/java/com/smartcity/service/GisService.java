package com.smartcity.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartcity.dto.ResourceDemandDto;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;

@Service
public class GisService {

    private final ResourceService resourceService;
    private final ObjectMapper objectMapper;

    public GisService(ResourceService resourceService) {
        this.resourceService = resourceService;
        this.objectMapper = new ObjectMapper();
    }

    public Map<String, Object> getGisZonesWithData(Integer forecastYear) {
        if (forecastYear == null) forecastYear = 2030;

        List<ResourceDemandDto> demands = resourceService.getAllResourceDemands(forecastYear);
        Map<Integer, ResourceDemandDto> demandMap = new HashMap<>();
        for (ResourceDemandDto d : demands) {
            demandMap.put(d.getZoneId(), d);
        }

        // Path to chennai_zones.geojson in data/gis/
        File geojsonFile = new File("data/gis/chennai_zones.geojson");
        if (!geojsonFile.exists()) {
            geojsonFile = new File("../data/gis/chennai_zones.geojson");
        }

        try {
            Map<String, Object> geojson = objectMapper.readValue(geojsonFile, Map.class);
            List<Map<String, Object>> features = (List<Map<String, Object>>) geojson.get("features");

            for (Map<String, Object> feature : features) {
                Map<String, Object> props = (Map<String, Object>) feature.get("properties");
                Integer zoneId = ((Number) props.get("zone_id")).intValue();

                ResourceDemandDto demand = demandMap.get(zoneId);
                if (demand != null) {
                    props.put("population", demand.getPopulation());
                    props.put("waterDemandLpd", demand.getWaterDemandLpd());
                    props.put("electricityDemandKwhDay", demand.getElectricityDemandKwhDay());
                    props.put("healthcareBedsRequired", demand.getHealthcareBedsRequired());
                    props.put("educationSeatsRequired", demand.getEducationSeatsRequired());
                    props.put("priorityScore", demand.getPriorityScore());
                    props.put("priorityLevel", demand.getPriorityLevel());
                    props.put("forecastYear", forecastYear);
                }
            }
            return geojson;
        } catch (Exception e) {
            System.err.println("Failed to read GeoJSON file: " + e.getMessage());
            throw new RuntimeException("Error reading GIS GeoJSON boundary file: " + e.getMessage());
        }
    }
}
