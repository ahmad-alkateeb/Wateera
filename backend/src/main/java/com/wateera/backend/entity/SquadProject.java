package com.wateera.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "projects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SquadProject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String joinCode;

    @Column(nullable = false)
    private String supervisorEmail;

    private String workflowCategory; // Web, Mobile, AI, QA, UI/UX
    private String shiftType; // fixed, flexible
    private String startTime;
    private String endTime;
    private int requiredFlexibleHours;
    private int gracePeriodMinutes;
    private int dailyBreakPoolMinutes;
    private int monthlyDelayBufferMinutes;
    private double redPointDeductionHours;
    private double blackPointDeductionDays;
    private double greenBonusPercent;

    @ElementCollection
    @CollectionTable(name = "project_allowed_positions", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "position_title")
    private List<String> allowedPositions;
}
