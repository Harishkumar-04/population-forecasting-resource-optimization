package com.smartcity.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "resource_demand", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"zone_id", "forecast_year"})
})
public class ResourceDemand {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "zone_id", nullable = false)
    private UrbanZone zone;

    @Column(name = "forecast_year", nullable = false)
    private Integer forecastYear;

    @Column(nullable = false)
    private Double population;

    @Column(name = "water_demand_lpd", nullable = false)
    private Double waterDemandLpd;

    @Column(name = "electricity_demand_kwh_day", nullable = false)
    private Double electricityDemandKwhDay;

    @Column(name = "healthcare_beds_required", nullable = false)
    private Double healthcareBedsRequired;

    @Column(name = "education_seats_required", nullable = false)
    private Double educationSeatsRequired;

    public ResourceDemand() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public UrbanZone getZone() { return zone; }
    public void setZone(UrbanZone zone) { this.zone = zone; }

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
}
