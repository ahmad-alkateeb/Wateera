package com.wateera.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private String role; // ADMIN, SUPERVISOR, EMPLOYEE

    private String positionTitle; // Selected from Supervisor's allowed positions
    private String specialty; // Web, Mobile, AI, QA, UI/UX
    private String githubUsername;
    private String joinedProjectCode;
    private boolean hasJoinedSquad;
    private String attendanceStatus;
    private int gpsDistanceMeters;
    private String ipAddress;
    private int greenPoints;
    private int activeRedPoints;
    private int activeBlackPoints;
    private int cleansedPoints;
    private int currentStreak;
    private int breakRemainingMinutes;
    private String bypassActiveUntil;
    private String accountStatus; // active, suspended
}
