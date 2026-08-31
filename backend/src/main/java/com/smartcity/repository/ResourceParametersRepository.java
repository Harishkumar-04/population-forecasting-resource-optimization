package com.smartcity.repository;

import com.smartcity.entity.ResourceParameters;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ResourceParametersRepository extends JpaRepository<ResourceParameters, Long> {
    Optional<ResourceParameters> findByResourceType(String resourceType);
}
