package com.smartcity.service;

import com.smartcity.dto.DashboardSummaryDto;
import com.smartcity.dto.ForecastDto;
import com.smartcity.dto.ResourceDemandDto;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final ForecastService forecastService;
    private final ResourceService resourceService;

    public DashboardService(ForecastService forecastService, ResourceService resourceService) {
        this.forecastService = forecastService;
        this.resourceService = resourceService;
    }

    public DashboardSummaryDto getDashboardSummary(Integer forecastYear) {
        if (forecastYear == null) forecastYear = 2030;

        List<ForecastDto> forecasts = forecastService.getAllForecasts(forecastYear);
        List<ResourceDemandDto> demands = resourceService.getAllResourceDemands(forecastYear);

        double latestTotalPop = forecasts.stream().mapToDouble(ForecastDto::getLatestKnownPopulation).sum();
        double forecastTotalPop = forecasts.stream().mapToDouble(ForecastDto::getPredictedPopulation).sum();
        double avgGrowthPct = forecasts.stream().mapToDouble(ForecastDto::getGrowthPercentage).average().orElse(0.0);

        double totalWater = demands.stream().mapToDouble(ResourceDemandDto::getWaterDemandLpd).sum();
        double totalElec = demands.stream().mapToDouble(ResourceDemandDto::getElectricityDemandKwhDay).sum();
        double totalBeds = demands.stream().mapToDouble(ResourceDemandDto::getHealthcareBedsRequired).sum();
        double totalSeats = demands.stream().mapToDouble(ResourceDemandDto::getEducationSeatsRequired).sum();

        List<ForecastDto> highGrowth = forecasts.stream()
                .sorted((a, b) -> Double.compare(b.getGrowthPercentage(), a.getGrowthPercentage()))
                .limit(5)
                .collect(Collectors.toList());

        DashboardSummaryDto summary = new DashboardSummaryDto();
        summary.setTotalZones(15);
        summary.setLatestTotalPopulation(Math.round(latestTotalPop * 100.0) / 100.0);
        summary.setForecastTotalPopulation(Math.round(forecastTotalPop * 100.0) / 100.0);
        summary.setAverageGrowthPercentage(Math.round(avgGrowthPct * 100.0) / 100.0);
        summary.setTotalWaterDemandLpd(Math.round(totalWater * 100.0) / 100.0);
        summary.setTotalElectricityDemandKwhDay(Math.round(totalElec * 100.0) / 100.0);
        summary.setTotalHealthcareBedsRequired(Math.round(totalBeds * 100.0) / 100.0);
        summary.setTotalEducationSeatsRequired(Math.round(totalSeats * 100.0) / 100.0);
        summary.setHighGrowthZones(highGrowth);
        summary.setCapacityNotice("Resource capacity data is not currently available.");
        return summary;
    }
}
