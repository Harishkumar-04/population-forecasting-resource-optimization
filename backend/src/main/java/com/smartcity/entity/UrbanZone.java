package com.smartcity.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "urban_zone")
public class UrbanZone {

    @Id
    @Column(name = "zone_id")
    private Integer zoneId;

    @Column(name = "zone_code", nullable = false, length = 10)
    private String zoneCode;

    @Column(name = "zone_name", nullable = false, length = 100)
    private String zoneName;

    public UrbanZone() {}

    public UrbanZone(Integer zoneId, String zoneCode, String zoneName) {
        this.zoneId = zoneId;
        this.zoneCode = zoneCode;
        this.zoneName = zoneName;
    }

    public Integer getZoneId() { return zoneId; }
    public void setZoneId(Integer zoneId) { this.zoneId = zoneId; }

    public String getZoneCode() { return zoneCode; }
    public void setZoneCode(String zoneCode) { this.zoneCode = zoneCode; }

    public String getZoneName() { return zoneName; }
    public void setZoneName(String zoneName) { this.zoneName = zoneName; }
}
