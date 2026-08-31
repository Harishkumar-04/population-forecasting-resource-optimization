package com.smartcity.repository;

import com.smartcity.entity.UrbanFeatures;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UrbanFeaturesRepository extends JpaRepository<UrbanFeatures, Long> {
    List<UrbanFeatures> findByZoneZoneIdOrderByYearAsc(Integer zoneId);
    Optional<UrbanFeatures> findByZoneZoneIdAndYear(Integer zoneId, Integer year);
}
