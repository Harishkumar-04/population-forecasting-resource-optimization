package com.smartcity.repository;

import com.smartcity.entity.PopulationForecast;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PopulationForecastRepository extends JpaRepository<PopulationForecast, Long> {
    List<PopulationForecast> findByZoneZoneIdOrderByForecastYearAsc(Integer zoneId);
    List<PopulationForecast> findByForecastYearOrderByZoneZoneIdAsc(Integer forecastYear);
    Optional<PopulationForecast> findByZoneZoneIdAndForecastYear(Integer zoneId, Integer forecastYear);
}
