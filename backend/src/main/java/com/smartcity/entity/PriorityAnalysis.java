package com.smartcity.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "priority_analysis", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"zone_id", "forecast_year"})
})
public class PriorityAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "zone_id", nullable = false)
    private UrbanZone zone;

    @Column(name = "forecast_year", nullable = false)
    private Integer forecastYear;

    @Column(name = "priority_score", nullable = false)
    private Double priorityScore;

    @Column(name = "priority_level", nullable = false, length = 20)
    private String priorityLevel; // 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'

    @Column(name = "growth_factor", nullable = false)
    private Double growthFactor;

    @Column(name = "demand_factor", nullable = false)
    private Double demandFactor;

    @Column(name = "density_factor", nullable = false)
    private Double densityFactor;

    @Column(name = "contributing_factors", columnDefinition = "TEXT")
    private String contributingFactors;

    public PriorityAnalysis() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public UrbanZone getZone() { return zone; }
    public void setZone(UrbanZone zone) { this.zone = zone; }

    public Integer getForecastYear() { return forecastYear; }
    public void setForecastYear(Integer forecastYear) { this.forecastYear = forecastYear; }

    public Double getPriorityScore() { return priorityScore; }
    public void setPriorityScore(Double priorityScore) { this.priorityScore = priorityScore; }

    public String getPriorityLevel() { return priorityLevel; }
    public void setPriorityLevel(String priorityLevel) { this.priorityLevel = priorityLevel; }

    public Double getGrowthFactor() { return growthFactor; }
    public void setGrowthFactor(Double growthFactor) { this.growthFactor = growthFactor; }

    public Double getDemandFactor() { return demandFactor; }
    public void setDemandFactor(Double demandFactor) { this.demandFactor = demandFactor; }

    public Double getDensityFactor() { return densityFactor; }
    public void setDensityFactor(Double densityFactor) { this.densityFactor = densityFactor; }

    public String getContributingFactors() { return contributingFactors; }
    public void setContributingFactors(String contributingFactors) { this.contributingFactors = contributingFactors; }
}
