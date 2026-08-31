package com.smartcity.repository;

import com.smartcity.entity.PriorityAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PriorityAnalysisRepository extends JpaRepository<PriorityAnalysis, Long> {
    List<PriorityAnalysis> findByZoneZoneIdOrderByForecastYearAsc(Integer zoneId);
    List<PriorityAnalysis> findByForecastYearOrderByPriorityScoreDesc(Integer forecastYear);
    Optional<PriorityAnalysis> findByZoneZoneIdAndForecastYear(Integer zoneId, Integer forecastYear);
}
