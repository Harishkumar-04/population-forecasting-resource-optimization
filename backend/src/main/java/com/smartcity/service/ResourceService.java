package com.smartcity.service;

import com.smartcity.dto.ForecastDto;
import com.smartcity.dto.ResourceDemandDto;
import com.smartcity.entity.ResourceParameters;
import com.smartcity.repository.ResourceParametersRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ResourceService {

    private final ForecastService forecastService;
    private final ResourceParametersRepository resourceParametersRepository;

    public ResourceService(ForecastService forecastService, ResourceParametersRepository resourceParametersRepository) {
        this.forecastService = forecastService;
        this.resourceParametersRepository = resourceParametersRepository;
    }

    public ResourceDemandDto getResourceDemandForZone(Integer zoneId, Integer forecastYear) {
        ForecastDto forecast = forecastService.getForecastForZone(zoneId, forecastYear);
        Double pop = forecast.getPredictedPopulation();

        // Standard planning factors
        double waterFactor = 135.0; // L/person/day
        double elecFactor = 3.5;    // kWh/person/day
        double healthFactor = 0.003; // beds/person (3 per 1000)
        double eduFactor = 0.05;    // seats/person (50 per 1000)

        Optional<ResourceParameters> wOpt = resourceParametersRepository.findByResourceType("water");
        if (wOpt.isPresent()) waterFactor = wOpt.get().getPlanningFactor();

        Optional<ResourceParameters> eOpt = resourceParametersRepository.findByResourceType("electricity");
        if (eOpt.isPresent()) elecFactor = eOpt.get().getPlanningFactor();

        Optional<ResourceParameters> hOpt = resourceParametersRepository.findByResourceType("healthcare");
        if (hOpt.isPresent()) healthFactor = hOpt.get().getPlanningFactor();

        Optional<ResourceParameters> edOpt = resourceParametersRepository.findByResourceType("education");
        if (edOpt.isPresent()) eduFactor = edOpt.get().getPlanningFactor();

        double waterDemand = pop * waterFactor;
        double elecDemand = pop * elecFactor;
        double healthBeds = pop * healthFactor;
        double eduSeats = pop * eduFactor;

        // Priority Score Calculation
        // Priority Score = (Growth % * 0.4) + (Population / 100000 * 0.4) + (Water Demand / 10000000 * 0.2)
        double growthPct = forecast.getGrowthPercentage();
        double growthFactor = Math.max(0.0, growthPct * 2.5);
        double densityFactor = (pop / 100000.0) * 5.0;
        double demandFactor = (waterDemand / 10000000.0) * 3.0;

        double priorityScore = Math.round((growthFactor * 0.4 + densityFactor * 0.35 + demandFactor * 0.25) * 100.0) / 100.0;

        String priorityLevel;
        if (priorityScore >= 35.0) priorityLevel = "CRITICAL";
        else if (priorityScore >= 25.0) priorityLevel = "HIGH";
        else if (priorityScore >= 15.0) priorityLevel = "MEDIUM";
        else priorityLevel = "LOW";

        ResourceDemandDto dto = new ResourceDemandDto();
        dto.setZoneId(forecast.getZoneId());
        dto.setZoneCode(forecast.getZoneCode());
        dto.setZoneName(forecast.getZoneName());
        dto.setForecastYear(forecastYear);
        dto.setPopulation(pop);
        dto.setWaterDemandLpd(Math.round(waterDemand * 100.0) / 100.0);
        dto.setElectricityDemandKwhDay(Math.round(elecDemand * 100.0) / 100.0);
        dto.setHealthcareBedsRequired(Math.round(healthBeds * 100.0) / 100.0);
        dto.setEducationSeatsRequired(Math.round(eduSeats * 100.0) / 100.0);
        dto.setPriorityScore(priorityScore);
        dto.setPriorityLevel(priorityLevel);
        dto.setCapacityNotice("Resource capacity data is not currently available.");
        return dto;
    }

    public List<ResourceDemandDto> getAllResourceDemands(Integer forecastYear) {
        List<ForecastDto> forecasts = forecastService.getAllForecasts(forecastYear);
        List<ResourceDemandDto> list = new ArrayList<>();
        for (ForecastDto f : forecasts) {
            list.add(getResourceDemandForZone(f.getZoneId(), forecastYear));
        }
        // Sort by priority score descending
        list.sort((a, b) -> Double.compare(b.getPriorityScore(), a.getPriorityScore()));
        return list;
    }

    public List<ResourceParameters> getPlanningParameters() {
        return resourceParametersRepository.findAll();
    }
}
