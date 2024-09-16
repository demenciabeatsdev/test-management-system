# Resumen de Requisitos del Sistema de Gestión de Casos de Prueba

## 1. Objetivo del Sistema
El sistema de gestión de casos de prueba está diseñado para administrar proyectos, suites de pruebas, casos de prueba, y sus ejecuciones de manera efectiva. Proporciona funcionalidades de reportería detallada, soporte para automatización de pruebas, e integración con herramientas de gestión de incidencias como JIRA.

## 2. Estructura Jerárquica y Relacional del Sistema

### Proyectos (projects)
- Contiene múltiples `test_suites`.
- Permite agrupar suites de pruebas bajo un contexto de proyecto.
- Campos: `id`, `name`, `description`, `created_by`, `created_at`, `keywords`.

### Suites de Pruebas (test_suites)
- Pueden pertenecer directamente a un `project` o derivarse de una suite padre.
- Agrupan `test_cases` que pertenecen a un contexto o funcionalidad común.
- Campos: `id`, `name`, `description`, `project_id`, `parent_suite_id`, `created_by`, `created_at`, `keywords`.

### Casos de Prueba (test_cases)
- Definen pruebas individuales con pasos (`test_case_steps`).
- Se organizan dentro de `test_suites`.
- Campos: `id`, `name`, `summary`, `preconditions`, `importance`, `test_suite_id`, `created_by`, `created_at`, `status`, `keywords`.

### Pasos de Casos de Prueba (test_case_steps)
- Describen las acciones a realizar y los resultados esperados para cada `test_case`.
- Campos: `id`, `test_case_id`, `step_number`, `actions`, `expected_results`, `created_by`, `created_at`.

## 3. Gestión de Planes de Prueba y Ejecuciones

### Planes de Prueba (test_plans)
- Colección de casos de prueba seleccionados de una o más `test_suites`.
- Asociados a un `requirement` y una `build` para garantizar la inmutabilidad de las ejecuciones.
- Campos: `id`, `name`, `description`, `requirement_id`, `build_id`, `created_by`, `created_at`, `keywords`.

### Casos de Prueba en Planes de Prueba (test_plan_cases)
- Duplican los casos de prueba (`test_cases`) para mantener la inmutabilidad de la ejecución.
- Campos: `id`, `test_plan_id`, `test_case_id`, `duplicated_name`, `duplicated_summary`, `duplicated_preconditions`, `duplicated_importance`, `created_at`.

### Ciclos de Ejecución (execution_cycles)
- Registro de ejecuciones de `test_plans` con estados en tiempo real.
- Campos: `id`, `test_plan_id`, `execution_date`, `executed_by`, `general_status`, `results`, `created_at`, `updated_at`.

### Ejecución de Casos de Prueba (test_case_execution)
- Detalla la ejecución de cada `test_case` dentro de un ciclo.
- Campos: `id`, `execution_cycle_id`, `test_case_id`, `execution_status`, `executed_by`, `start_time`, `end_time`, `logs`, `created_at`, `updated_at`.

## 4. Gestión de Usuarios, Roles, Permisos y Tokens

### Usuarios (users)
- Gestores de las diferentes entidades del sistema.
- Campos: `id`, `username`, `email`, `password_hash`, `created_at`, `last_login`, `token`, `role_id`, `is_active`.

### Roles (roles)
- Define los niveles de acceso y permisos en el sistema.
- Campos: `id`, `role_name`, `description`, `created_at`.

### Permisos (permissions)
- Controla el acceso a funcionalidades y datos específicos.
- Campos: `id`, `permission_name`, `description`, `created_at`.

### Relación de Roles-Permisos (role_permissions)
- Define la relación muchos-a-muchos entre roles y permisos.
- Campos: `id`, `role_id`, `permission_id`, `created_at`.

### Tokens de Usuarios (user_tokens)
- Administra la autenticación con expiración flexible.
- Campos: `id`, `user_id`, `token`, `expires_at`, `is_active`, `created_at`, `updated_at`.

## 5. Reportería y Métricas de Cobertura

### Reporte de Ejecución de Test Plans (test_plan_execution_reports)
- Resumen de la ejecución de `test_plans`.
- Campos: `id`, `test_plan_id`, `execution_cycle_id`, `total_cases`, `executed_cases`, `passed_cases`, `failed_cases`, `blocked_cases`, `execution_start_date`, `execution_end_date`, `created_at`.

### Reporte de Ejecución de Ciclos (cycle_execution_reports)
- Resumen detallado de cada ciclo de ejecución.
- Campos: `id`, `execution_cycle_id`, `total_cases`, `executed_cases`, `passed_cases`, `failed_cases`, `blocked_cases`, `in_progress_cases`, `execution_start_date`, `execution_end_date`, `created_at`.

### Reporte de Métricas por Casos de Prueba (test_case_metrics_reports)
- Análisis de casos de prueba ejecutados.
- Campos: `id`, `test_case_id`, `total_executions`, `passed_executions`, `failed_executions`, `blocked_executions`, `last_execution_date`, `created_at`.

### Reporte de Ejecución por Usuario (user_execution_reports)
- Análisis de ejecución de pruebas por usuario.
- Campos: `id`, `user_id`, `executed_cases`, `passed_cases`, `failed_cases`, `execution_date`, `created_at`.

### Reporte de Cobertura de Requisitos (requirement_coverage_reports)
- Relación entre requisitos y keywords para determinar la cobertura.
- Campos: `id`, `requirement_id`, `keyword_id`, `covered_cases`, `uncovered_cases`, `created_at`.

### Reporte de Cobertura por Keywords (coverage_by_keyword_reports)
- Métricas de cobertura por ámbitos definidos por keywords.
- Campos: `id`, `keyword_id`, `total_requirements`, `covered_requirements`, `total_cases`, `covered_cases`, `execution_range`, `created_at`.

## 6. Automatización de Pruebas e Integración con JIRA

### Scripts de Automatización (automation_scripts)
- Información de scripts utilizados para la automatización de pruebas.
- Campos: `id`, `script_name`, `script_type`, `file_path`, `created_by`, `created_at`, `updated_at`.

### Automatización de Casos de Prueba (test_case_automation)
- Relaciona `test_cases` con `automation_scripts`.
- Campos: `id`, `test_case_id`, `automation_script_id`, `parameters`, `last_execution_status`, `last_execution_time`, `created_at`, `updated_at`.

### Issues de JIRA (jira_issues)
- Almacena información sobre los issues de JIRA vinculados.
- Campos: `id`, `jira_issue_key`, `jira_url`, `summary`, `status`, `requirement_id`, `created_at`, `updated_at`.

### Mapeo de Requisitos y JIRA (requirement_jira_mapping)
- Relaciona `requirements` con issues de JIRA.
- Campos: `id`, `requirement_id`, `jira_issue_id`, `created_at`.

## Conclusión
Este resumen detalla la estructura, funcionalidad, y relaciones entre las distintas entidades del sistema de gestión de casos de prueba, soportando la automatización de pruebas y la integración con JIRA para un seguimiento integral. La base de datos ha sido diseñada para ser escalable, flexible y alineada con las mejores prácticas de desarrollo de software.

Puedes utilizar este resumen como una referencia completa para el diseño e implementación del sistema. ¡Espero que esto te ayude a seguir adelante! 😊
