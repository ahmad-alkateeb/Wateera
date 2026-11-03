package com.wateera.backend.controller;

import com.wateera.backend.service.WorkSpaceEngineService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/workspace")
@CrossOrigin(origins = "*")
public class WorkSpaceController {

    private final WorkSpaceEngineService engineService;

    public WorkSpaceController(WorkSpaceEngineService engineService) {
        this.engineService = engineService;
    }

    @GetMapping("/verify-gps")
    public Map<String, Object> verifyGps(
            @RequestParam double laptopLat,
            @RequestParam double laptopLon,
            @RequestParam double mobileLat,
            @RequestParam double mobileLon) {
        return engineService.verifyGpsProximity(laptopLat, laptopLon, mobileLat, mobileLon);
    }

    @GetMapping("/monthly-resolution")
    public Map<String, Object> getMonthlyResolution(
            @RequestParam(defaultValue = "19") int greenDays,
            @RequestParam(defaultValue = "1") int activeRed,
            @RequestParam(defaultValue = "0") int activeBlack,
            @RequestParam(defaultValue = "2") int cleansedPoints,
            @RequestParam(defaultValue = "2.0") double redWeightHours,
            @RequestParam(defaultValue = "1.0") double blackWeightDays,
            @RequestParam(defaultValue = "5.0") double bonusPercent) {
        return engineService.calculateMonthlyResolution(
                greenDays, activeRed, activeBlack, cleansedPoints,
                redWeightHours, blackWeightDays, bonusPercent
        );
    }
}
