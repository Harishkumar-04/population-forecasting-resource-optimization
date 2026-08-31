package com.smartcity.repository;

import com.smartcity.entity.UrbanZone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UrbanZoneRepository extends JpaRepository<UrbanZone, Integer> {
    Optional<UrbanZone> findByZoneCode(String zoneCode);
}
