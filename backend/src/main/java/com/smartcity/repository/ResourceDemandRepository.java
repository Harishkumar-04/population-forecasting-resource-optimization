package com.smartcity.repository;

import com.smartcity.entity.ResourceDemand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResourceDemandRepository extends JpaRepository<ResourceDemand, Long> {
    List<ResourceDemand> findByZoneZoneIdOrderByForecastYearAsc(Integer zoneId);
    List<ResourceDemand> findByForecastYearOrderByZoneZoneIdAsc(Integer forecastYear);
    Optional<ResourceDemand> findByZoneZoneIdAndForecastYear(Integer zoneId, Integer forecastYear);
}
