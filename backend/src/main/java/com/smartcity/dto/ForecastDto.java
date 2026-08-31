package com.smartcity.dto;

public class ForecastDto {
    private Integer zoneId;
    private String zoneCode;
    private String zoneName;
    private Integer forecastYear;
    private Double latestKnownPopulation;
    private Double predictedPopulation;
    private Double populationChange;
    private Double growthPercentage;
    private String modelUsed;

    public ForecastDto() {}

    public Integer getZoneId() { return zoneId; }
    public void setZoneId(Integer zoneId) { this.zoneId = zoneId; }

    public String getZoneCode() { return zoneCode; }
    public void setZoneCode(String zoneCode) { this.zoneCode = zoneCode; }

    public String getZoneName() { return zoneName; }
    public void setZoneName(String zoneName) { this.zoneName = zoneName; }

    public Integer getForecastYear() { return forecastYear; }
    public void setForecastYear(Integer forecastYear) { this.forecastYear = forecastYear; }

    public Double getLatestKnownPopulation() { return latestKnownPopulation; }
    public void setLatestKnownPopulation(Double latestKnownPopulation) { this.latestKnownPopulation = latestKnownPopulation; }

    public Double getPredictedPopulation() { return predictedPopulation; }
    public void setPredictedPopulation(Double predictedPopulation) { this.predictedPopulation = predictedPopulation; }

    public Double getPopulationChange() { return populationChange; }
    public void setPopulationChange(Double populationChange) { this.populationChange = populationChange; }

    public Double getGrowthPercentage() { return growthPercentage; }
    public void setGrowthPercentage(Double growthPercentage) { this.growthPercentage = growthPercentage; }

    public String getModelUsed() { return modelUsed; }
    public void setModelUsed(String modelUsed) { this.modelUsed = modelUsed; }
}
