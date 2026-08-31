package com.smartcity.dto;

import java.util.List;

public class DashboardSummaryDto {
    private int totalZones;
    private double latestTotalPopulation;
    private double forecastTotalPopulation;
    private double averageGrowthPercentage;
    private double totalWaterDemandLpd;
    private double totalElectricityDemandKwhDay;
    private double totalHealthcareBedsRequired;
    private double totalEducationSeatsRequired;
    private List<ForecastDto> highGrowthZones;
    private String capacityNotice = "Resource capacity data is not currently available.";

    public DashboardSummaryDto() {}

    public int getTotalZones() { return totalZones; }
    public void setTotalZones(int totalZones) { this.totalZones = totalZones; }

    public double getLatestTotalPopulation() { return latestTotalPopulation; }
    public void setLatestTotalPopulation(double latestTotalPopulation) { this.latestTotalPopulation = latestTotalPopulation; }

    public double getForecastTotalPopulation() { return forecastTotalPopulation; }
    public void setForecastTotalPopulation(double forecastTotalPopulation) { this.forecastTotalPopulation = forecastTotalPopulation; }

    public double getAverageGrowthPercentage() { return averageGrowthPercentage; }
    public void setAverageGrowthPercentage(double averageGrowthPercentage) { this.averageGrowthPercentage = averageGrowthPercentage; }

    public double getTotalWaterDemandLpd() { return totalWaterDemandLpd; }
    public void setTotalWaterDemandLpd(double totalWaterDemandLpd) { this.totalWaterDemandLpd = totalWaterDemandLpd; }

    public double getTotalElectricityDemandKwhDay() { return totalElectricityDemandKwhDay; }
    public void setTotalElectricityDemandKwhDay(double totalElectricityDemandKwhDay) { this.totalElectricityDemandKwhDay = totalElectricityDemandKwhDay; }

    public double getTotalHealthcareBedsRequired() { return totalHealthcareBedsRequired; }
    public void setTotalHealthcareBedsRequired(double totalHealthcareBedsRequired) { this.totalHealthcareBedsRequired = totalHealthcareBedsRequired; }

    public double getTotalEducationSeatsRequired() { return totalEducationSeatsRequired; }
    public void setTotalEducationSeatsRequired(double totalEducationSeatsRequired) { this.totalEducationSeatsRequired = totalEducationSeatsRequired; }

    public List<ForecastDto> getHighGrowthZones() { return highGrowthZones; }
    public void setHighGrowthZones(List<ForecastDto> highGrowthZones) { this.highGrowthZones = highGrowthZones; }

    public String getCapacityNotice() { return capacityNotice; }
    public void setCapacityNotice(String capacityNotice) { this.capacityNotice = capacityNotice; }
}
