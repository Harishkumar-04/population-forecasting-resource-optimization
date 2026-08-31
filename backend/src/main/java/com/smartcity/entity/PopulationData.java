package com.smartcity.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "population_data", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"year", "zone_id"})
})
public class PopulationData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer year;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "zone_id", nullable = false)
    private UrbanZone zone;

    @Column(nullable = false)
    private Double population;

    @Column(name = "built_up_surface_m2", nullable = false)
    private Double builtUpSurfaceM2;

    @Column(name = "night_light", nullable = false)
    private Double nightLight;

    @Column(name = "built_up_source", nullable = false)
    private String builtUpSource;

    @Column(name = "night_light_source", nullable = false)
    private String nightLightSource;

    @Column(name = "is_training_period", nullable = false)
    private Boolean isTrainingPeriod = true;

    public PopulationData() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public UrbanZone getZone() { return zone; }
    public void setZone(UrbanZone zone) { this.zone = zone; }

    public Double getPopulation() { return population; }
    public void setPopulation(Double population) { this.population = population; }

    public Double getBuiltUpSurfaceM2() { return builtUpSurfaceM2; }
    public void setBuiltUpSurfaceM2(Double builtUpSurfaceM2) { this.builtUpSurfaceM2 = builtUpSurfaceM2; }

    public Double getNightLight() { return nightLight; }
    public void setNightLight(Double nightLight) { this.nightLight = nightLight; }

    public String getBuiltUpSource() { return builtUpSource; }
    public void setBuiltUpSource(String builtUpSource) { this.builtUpSource = builtUpSource; }

    public String getNightLightSource() { return nightLightSource; }
    public void setNightLightSource(String nightLightSource) { this.nightLightSource = nightLightSource; }

    public Boolean getIsTrainingPeriod() { return isTrainingPeriod; }
    public void setIsTrainingPeriod(Boolean isTrainingPeriod) { this.isTrainingPeriod = isTrainingPeriod; }
}
