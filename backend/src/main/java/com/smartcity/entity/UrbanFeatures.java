package com.smartcity.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "urban_features", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"year", "zone_id"})
})
public class UrbanFeatures {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer year;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "zone_id", nullable = false)
    private UrbanZone zone;

    @Column(name = "pop_growth_rate")
    private Double popGrowthRate;

    @Column(name = "pop_change")
    private Double popChange;

    @Column(name = "built_up_change")
    private Double builtUpChange;

    @Column(name = "night_light_change")
    private Double nightLightChange;

    public UrbanFeatures() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public UrbanZone getZone() { return zone; }
    public void setZone(UrbanZone zone) { this.zone = zone; }

    public Double getPopGrowthRate() { return popGrowthRate; }
    public void setPopGrowthRate(Double popGrowthRate) { this.popGrowthRate = popGrowthRate; }

    public Double getPopChange() { return popChange; }
    public void setPopChange(Double popChange) { this.popChange = popChange; }

    public Double getBuiltUpChange() { return builtUpChange; }
    public void setBuiltUpChange(Double builtUpChange) { this.builtUpChange = builtUpChange; }

    public Double getNightLightChange() { return nightLightChange; }
    public void setNightLightChange(Double nightLightChange) { this.nightLightChange = nightLightChange; }
}
