CREATE DATABASE test_management_system;

-- Versión 1 del script SQL para el sistema de gestión de casos de prueba

-- Configuración inicial
BEGIN;

-- ============================================================
-- CREACIÓN DE TABLAS PRINCIPALES
-- ============================================================

-- Tabla para Proyectos
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_by UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    keywords UUID[],
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla para Suites de Pruebas
CREATE TABLE test_suites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    project_id UUID,
    parent_suite_id UUID,
    created_by UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    keywords UUID[],
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_suite_id) REFERENCES test_suites(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla para Casos de Prueba
CREATE TABLE test_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    summary TEXT,
    preconditions TEXT,
    importance ENUM('Alta', 'Media', 'Baja') NOT NULL,
    test_suite_id UUID NOT NULL,
    created_by UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Activo', 'Inactivo') NOT NULL DEFAULT 'Activo',
    keywords UUID[],
    FOREIGN KEY (test_suite_id) REFERENCES test_suites(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla para Pasos de Casos de Prueba
CREATE TABLE test_case_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_case_id UUID NOT NULL,
    step_number INT NOT NULL,
    actions TEXT,
    expected_results TEXT,
    created_by UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (test_case_id) REFERENCES test_cases(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- TABLAS PARA GESTIÓN DE PLANES DE PRUEBA Y EJECUCIÓN
-- ============================================================

-- Tabla para Planes de Prueba
CREATE TABLE test_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    requirement_id UUID,
    build_id UUID,
    created_by UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    keywords UUID[],
    FOREIGN KEY (requirement_id) REFERENCES requirements(id) ON DELETE SET NULL,
    FOREIGN KEY (build_id) REFERENCES builds(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla para Casos de Prueba en Planes de Prueba
CREATE TABLE test_plan_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_plan_id UUID NOT NULL,
    test_case_id UUID NOT NULL,
    duplicated_name VARCHAR(255) NOT NULL,
    duplicated_summary TEXT,
    duplicated_preconditions TEXT,
    duplicated_importance ENUM('Alta', 'Media', 'Baja') NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (test_plan_id) REFERENCES test_plans(id) ON DELETE CASCADE,
    FOREIGN KEY (test_case_id) REFERENCES test_cases(id) ON DELETE CASCADE
);

-- Tabla para Ciclos de Ejecución
CREATE TABLE execution_cycles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_plan_id UUID NOT NULL,
    execution_date TIMESTAMP NOT NULL,
    executed_by UUID NOT NULL,
    general_status ENUM('Pendiente', 'En Progreso', 'Completado', 'Fallido', 'Cancelado') NOT NULL DEFAULT 'Pendiente',
    results JSON,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (test_plan_id) REFERENCES test_plans(id) ON DELETE CASCADE,
    FOREIGN KEY (executed_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla para Ejecución de Casos de Prueba
CREATE TABLE test_case_execution (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    execution_cycle_id UUID NOT NULL,
    test_case_id UUID NOT NULL,
    execution_status ENUM('Pendiente', 'En Progreso', 'Completado', 'Fallido', 'Bloqueado', 'No Ejecutado') NOT NULL DEFAULT 'Pendiente',
    executed_by UUID NOT NULL,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    logs JSON,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (execution_cycle_id) REFERENCES execution_cycles(id) ON DELETE CASCADE,
    FOREIGN KEY (test_case_id) REFERENCES test_plan_cases(id) ON DELETE CASCADE,
    FOREIGN KEY (executed_by) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- TABLAS PARA GESTIÓN DE USUARIOS, ROLES, PERMISOS Y TOKENS
-- ============================================================

-- Tabla para Usuarios
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    token VARCHAR(255),
    role_id UUID,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
);

-- Tabla para Roles
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para Permisos
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    permission_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Relación de Roles-Permisos
CREATE TABLE role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL,
    permission_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- Tabla para Tokens de Usuarios
CREATE TABLE user_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- TABLAS PARA REPORTERÍA Y MÉTRICAS DE COBERTURA
-- ============================================================

-- Reporte de Ejecución de Test Plans
CREATE TABLE test_plan_execution_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_plan_id UUID NOT NULL,
    execution_cycle_id UUID NOT NULL,
    total_cases INT NOT NULL,
    executed_cases INT NOT NULL,
    passed_cases INT NOT NULL,
    failed_cases INT NOT NULL,
    blocked_cases INT NOT NULL,
    execution_start_date TIMESTAMP,
    execution_end_date TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (test_plan_id) REFERENCES test_plans(id) ON DELETE CASCADE,
    FOREIGN KEY (execution_cycle_id) REFERENCES execution_cycles(id) ON DELETE CASCADE
);

-- Reporte de Ejecución de Ciclos
CREATE TABLE cycle_execution_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    execution_cycle_id UUID NOT NULL,
    total_cases INT NOT NULL,
    executed_cases INT NOT NULL,
    passed_cases INT NOT NULL,
    failed_cases INT NOT NULL,
    blocked_cases INT NOT NULL,
    in_progress_cases INT NOT NULL,
    execution_start_date TIMESTAMP,
    execution_end_date TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (execution_cycle_id) REFERENCES execution_cycles(id) ON DELETE CASCADE
);

-- Reporte de Métricas por Casos de Prueba
CREATE TABLE test_case_metrics_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_case_id UUID NOT NULL,
    total_executions INT NOT NULL,
    passed_executions INT NOT NULL,
    failed_executions INT NOT NULL,
    blocked_executions INT NOT NULL,
    last_execution_date TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (test_case_id) REFERENCES test_cases(id) ON DELETE CASCADE
);

-- Reporte de Ejecución por Usuario
CREATE TABLE user_execution_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    executed_cases INT NOT NULL,
    passed_cases INT NOT NULL,
    failed_cases INT NOT NULL,
    execution_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Reporte de Cobertura de Requisitos
CREATE TABLE requirement_coverage_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requirement_id UUID NOT NULL,
    keyword_id UUID NOT NULL,
    covered_cases INT NOT NULL,
    uncovered_cases INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (requirement_id) REFERENCES requirements(id) ON DELETE CASCADE,
    FOREIGN KEY (keyword_id) REFERENCES keywords(id) ON DELETE CASCADE
);

-- Reporte de Cobertura por Keywords
CREATE TABLE coverage_by_keyword_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    keyword_id UUID NOT NULL,
    total_requirements INT NOT NULL,
    covered_requirements INT NOT NULL,
    total_cases INT NOT NULL,
    covered_cases INT NOT NULL,
    execution_range DATERANGE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (keyword_id) REFERENCES keywords(id) ON DELETE CASCADE
);

-- ============================================================
-- INDICES PARA OPTIMIZAR BÚSQUEDAS
-- ============================================================
CREATE INDEX idx_test_cases_name ON test_cases(name);
CREATE INDEX idx_test_suites_name ON test_suites(name);
CREATE INDEX idx_test_plan_name ON test_plans(name);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_jira_issues_key ON jira_issues(jira_issue_key);
CREATE INDEX idx_execution_cycles_status ON execution_cycles(general_status);
CREATE INDEX idx_test_case_execution_status ON test_case_execution(execution_status);

-- Confirmar ejecución exitosa
COMMIT;
