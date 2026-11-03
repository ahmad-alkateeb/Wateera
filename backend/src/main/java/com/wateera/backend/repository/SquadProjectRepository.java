package com.wateera.backend.repository;

import com.wateera.backend.entity.SquadProject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SquadProjectRepository extends JpaRepository<SquadProject, Long> {
    Optional<SquadProject> findByJoinCode(String joinCode);
}
