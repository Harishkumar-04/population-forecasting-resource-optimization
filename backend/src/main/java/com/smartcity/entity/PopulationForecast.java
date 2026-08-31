package com.smartcity.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "population_forecast", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"zone_id", "forecast_year"})
})
public class PopulationForecast {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "zone_id", nullable = false)
    private UrbanZone zone;

    @Column(name = "forecast_year", nullable = false)
    private Integer forecastYear;

    @Column(name = "latest_known_population", nullable = false)
    private Double latestKnownPopulation;

    @Column(name = "predicted_population", nullable = false)
    private Double predictedPopulation;

    @Column(name = "population_change", nullable = false)
    private Double populationChange;

    @Column(name = "growth_percentage", nullable = false)
    private Double growthPercentage;

    @Column(name = "model_used", nullable = false)
    private String modelUsed = "Hybrid LSTM + XGBoost";

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public PopulationForecast() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public UrbanZone getZone() { return zone; }
    public void setZone(UrbanZone zone) { this.zone = zone; }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
