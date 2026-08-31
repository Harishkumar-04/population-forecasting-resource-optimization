package com.smartcity.repository;

import com.smartcity.entity.PopulationData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PopulationDataRepository extends JpaRepository<PopulationData, Long> {
    List<PopulationData> findByZoneZoneIdOrderByYearAsc(Integer zoneId);
    List<PopulationData> findByYearOrderByZoneZoneIdAsc(Integer year);
    Optional<PopulationData> findByZoneZoneIdAndYear(Integer zoneId, Integer year);
    
    @Query("SELECT DISTINCT p.year FROM PopulationData p ORDER BY p.year ASC")
    List<Integer> findDistinctYears();
}
