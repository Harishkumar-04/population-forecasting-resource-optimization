package com.smartcity.dto;

public class ResourceDemandDto {
    private Integer zoneId;
    private String zoneCode;
    private String zoneName;
    private Integer forecastYear;
    private Double population;
    private Double waterDemandLpd;
    private Double electricityDemandKwhDay;
    private Double healthcareBedsRequired;
    private Double educationSeatsRequired;
    private Double priorityScore;
    private String priorityLevel;
    private String capacityNotice = "Resource capacity data is not currently available.";

    public ResourceDemandDto() {}

    public Integer getZoneId() { return zoneId; }
    public void setZoneId(Integer zoneId) { this.zoneId = zoneId; }

    public String getZoneCode() { return zoneCode; }
    public void setZoneCode(String zoneCode) { this.zoneCode = zoneCode; }

    public String getZoneName() { return zoneName; }
    public void setZoneName(String zoneName) { this.zoneName = zoneName; }

    public Integer getForecastYear() { return forecastYear; }
    public void setForecastYear(Integer forecastYear) { this.forecastYear = forecastYear; }

    public Double getPopulation() { return population; }
    public void setPopulation(Double population) { this.population = population; }

    public Double getWaterDemandLpd() { return waterDemandLpd; }
    public void setWaterDemandLpd(Double waterDemandLpd) { this.waterDemandLpd = waterDemandLpd; }

    public Double getElectricityDemandKwhDay() { return electricityDemandKwhDay; }
    public void setElectricityDemandKwhDay(Double electricityDemandKwhDay) { this.electricityDemandKwhDay = electricityDemandKwhDay; }

    public Double getHealthcareBedsRequired() { return healthcareBedsRequired; }
    public void setHealthcareBedsRequired(Double healthcareBedsRequired) { this.healthcareBedsRequired = healthcareBedsRequired; }

    public Double getEducationSeatsRequired() { return educationSeatsRequired; }
    public void setEducationSeatsRequired(Double educationSeatsRequired) { this.educationSeatsRequired = educationSeatsRequired; }

    public Double getPriorityScore() { return priorityScore; }
    public void setPriorityScore(Double priorityScore) { this.priorityScore = priorityScore; }

    public String getPriorityLevel() { return priorityLevel; }
    public void setPriorityLevel(String priorityLevel) { this.priorityLevel = priorityLevel; }

    public String getCapacityNotice() { return capacityNotice; }
    public void setCapacityNotice(String capacityNotice) { this.capacityNotice = capacityNotice; }
}
