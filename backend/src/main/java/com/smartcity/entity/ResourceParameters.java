package com.smartcity.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "resource_parameters")
public class ResourceParameters {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "resource_type", nullable = false, unique = true, length = 50)
    private String resourceType; // 'water', 'electricity', 'healthcare', 'education'

    @Column(name = "planning_factor", nullable = false)
    private Double planningFactor;

    @Column(nullable = false, length = 50)
    private String unit;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "source_note", nullable = false)
    private String sourceNote = "PROJECT PLANNING ASSUMPTIONS";

    public ResourceParameters() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getResourceType() { return resourceType; }
    public void setResourceType(String resourceType) { this.resourceType = resourceType; }

    public Double getPlanningFactor() { return planningFactor; }
    public void setPlanningFactor(Double planningFactor) { this.planningFactor = planningFactor; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSourceNote() { return sourceNote; }
    public void setSourceNote(String sourceNote) { this.sourceNote = sourceNote; }
}
