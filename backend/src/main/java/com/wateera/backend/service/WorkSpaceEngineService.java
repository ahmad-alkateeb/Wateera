package com.wateera.backend.service;

import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class WorkSpaceEngineService {

    private static final double EARTH_RADIUS_METERS = 6371000.0;
    private static final double MAX_ALLOWED_DISTANCE_METERS = 50.0;

    /**
     * Context-Aware Authentication: Calculates physical distance in meters between
     * Laptop Geolocation and Mobile GPS using the Haversine formula (must be <= 50m).
     */
    public Map<String, Object> verifyGpsProximity(
            double laptopLat, double laptopLon,
            double mobileLat, double mobileLon) {

        double dLat = Math.toRadians(mobileLat - laptopLat);
        double dLon = Math.toRadians(mobileLon - laptopLon);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(laptopLat)) * Math.cos(Math.toRadians(mobileLat))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        double distanceMeters = Math.round(EARTH_RADIUS_METERS * c * 10.0) / 10.0;

        boolean verified = distanceMeters <= MAX_ALLOWED_DISTANCE_METERS;

        Map<String, Object> result = new HashMap<>();
        result.put("distanceMeters", distanceMeters);
        result.put("maxAllowedMeters", MAX_ALLOWED_DISTANCE_METERS);
        result.put("verified", verified);
        result.put("status", verified ? "PAIRED_OK" : "BUDDY_PUNCHING_BLOCKED");
        return result;
    }

    /**
     * Monthly Resolution Logic & 5x/15x Recovery Engine:
     * Final Balance = Total Green Days - (Active Red * Red Weight) - (Active Black * Black Weight)
     */
    public Map<String, Object> calculateMonthlyResolution(
            int totalGreenDays,
            int activeRedPoints,
            int activeBlackPoints,
            int cleansedHistoricalPoints,
            double redDeductionHours,
            double blackDeductionDays,
            double greenBonusPercent) {

        double finalScore = totalGreenDays
                - (activeRedPoints * redDeductionHours)
                - (activeBlackPoints * blackDeductionDays * 2.0);

        String scenario;
        double bonusPercent = 0.0;
        double deductedHours = 0.0;
        double deductedDays = 0.0;

        if (activeRedPoints == 0 && activeBlackPoints == 0 && cleansedHistoricalPoints == 0) {
            scenario = "HAPPY_DISCIPLINE_KNIGHT"; // فرسان الانضباط
            bonusPercent = greenBonusPercent;
        } else if (activeRedPoints == 0 && activeBlackPoints == 0 && cleansedHistoricalPoints > 0) {
            scenario = "FAIR_FULL_RECOVERY"; // السيناريو العادل (تم التعويض بقاعدة 5x/15x)
        } else {
            scenario = "STRICT_DEDUCTION"; // السيناريو الصارم
            deductedHours = activeRedPoints * redDeductionHours;
            deductedDays = activeBlackPoints * blackDeductionDays;
        }

        Map<String, Object> report = new HashMap<>();
        report.put("totalGreenDays", totalGreenDays);
        report.put("activeRedPoints", activeRedPoints);
        report.put("activeBlackPoints", activeBlackPoints);
        report.put("cleansedHistoricalPoints", cleansedHistoricalPoints);
        report.put("finalScore", finalScore);
        report.put("scenario", scenario);
        report.put("bonusPercent", bonusPercent);
        report.put("deductedHours", deductedHours);
        report.put("deductedDays", deductedDays);
        return report;
    }
}
