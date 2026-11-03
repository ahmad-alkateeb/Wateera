-- ============================================================================
-- Wateera Work Space Complete Database Schema (PostgreSQL)
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL CHECK (role IN ('ADMIN', 'SUPERVISOR', 'EMPLOYEE')),
    position_title VARCHAR(100), -- Selected from Supervisor's allowed positions
    specialty VARCHAR(30) DEFAULT 'Web',
    github_username VARCHAR(100),
    joined_project_code VARCHAR(50),
    has_joined_squad BOOLEAN DEFAULT FALSE,
    attendance_status VARCHAR(30) DEFAULT 'checked_out',
    gps_distance_meters INTEGER DEFAULT 0,
    ip_address VARCHAR(80),
    green_points INTEGER DEFAULT 0,
    active_red_points INTEGER DEFAULT 0,
    active_black_points INTEGER DEFAULT 0,
    cleansed_points INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    break_remaining_minutes INTEGER DEFAULT 60,
    bypass_active_until VARCHAR(100),
    account_status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    join_code VARCHAR(40) UNIQUE NOT NULL,
    supervisor_email VARCHAR(150) NOT NULL,
    workflow_category VARCHAR(30) DEFAULT 'Web',
    shift_type VARCHAR(20) DEFAULT 'fixed',
    start_time VARCHAR(10) DEFAULT '09:00',
    end_time VARCHAR(10) DEFAULT '17:00',
    required_flexible_hours INTEGER DEFAULT 8,
    grace_period_minutes INTEGER DEFAULT 10,
    daily_break_pool_minutes INTEGER DEFAULT 60,
    monthly_delay_buffer_minutes INTEGER DEFAULT 60,
    red_point_deduction_hours NUMERIC(5,2) DEFAULT 2.0,
    black_point_deduction_days NUMERIC(5,2) DEFAULT 1.0,
    green_bonus_percent NUMERIC(5,2) DEFAULT 5.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Positions & Roles enabled by the Supervisor for the project
CREATE TABLE IF NOT EXISTS project_positions (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    position_title VARCHAR(100) NOT NULL,
    department_category VARCHAR(40) NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    code VARCHAR(30) UNIQUE NOT NULL,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(30) DEFAULT 'Web',
    stage VARCHAR(50) NOT NULL,
    primary_assignee VARCHAR(120) NOT NULL,
    collaborator VARCHAR(120),
    priority VARCHAR(20) DEFAULT 'High',
    deadline VARCHAR(30),
    depends_on_task_code VARCHAR(30),
    stuck_days INTEGER DEFAULT 0,
    git_commits INTEGER DEFAULT 0,
    last_commit_msg VARCHAR(255),
    qa_rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS task_handover_logs (
    id SERIAL PRIMARY KEY,
    task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
    from_user VARCHAR(120) NOT NULL,
    to_user VARCHAR(120) NOT NULL,
    scope_completed TEXT NOT NULL,
    note TEXT,
    handed_over_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attendance_point_records (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(150) NOT NULL,
    record_date VARCHAR(20) NOT NULL,
    point_type VARCHAR(30) NOT NULL CHECK (point_type IN ('green', 'red', 'black', 'blue', 'cleansed_red', 'cleansed_black')),
    delay_minutes INTEGER DEFAULT 0,
    reason TEXT NOT NULL,
    dispute_status VARCHAR(20) DEFAULT 'none',
    dispute_note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS leave_requests (
    id SERIAL PRIMARY KEY,
    employee_name VARCHAR(120) NOT NULL,
    leave_type VARCHAR(30) NOT NULL,
    date_range VARCHAR(80) NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS security_alerts (
    id SERIAL PRIMARY KEY,
    employee_name VARCHAR(120) NOT NULL,
    alert_type VARCHAR(40) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(20) DEFAULT 'warning',
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
