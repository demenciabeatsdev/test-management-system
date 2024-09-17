DO $$ 
DECLARE
    v_project_id UUID;  -- ID del proyecto a limpiar
BEGIN
    -- Limpiar Test Case Steps
    DELETE FROM test_case_steps
    WHERE test_case_id IN (
        SELECT id FROM test_cases 
        WHERE test_suite_id IN (
            SELECT id FROM test_suites 
            WHERE project_id IN (SELECT id FROM projects WHERE created_by = 'cecf2275-a336-4cd0-8781-a9702d7275f6')
        )
    );

    -- Limpiar Test Cases
    DELETE FROM test_cases
    WHERE test_suite_id IN (
        SELECT id FROM test_suites 
        WHERE project_id IN (SELECT id FROM projects WHERE created_by = 'cecf2275-a336-4cd0-8781-a9702d7275f6')
    );

    -- Limpiar Test Suites Hijas
    DELETE FROM test_suites
    WHERE parent_suite_id IS NOT NULL 
      AND project_id IN (SELECT id FROM projects WHERE created_by = 'cecf2275-a336-4cd0-8781-a9702d7275f6');

    -- Limpiar Test Suites Principales
    DELETE FROM test_suites
    WHERE parent_suite_id IS NULL 
      AND project_id IN (SELECT id FROM projects WHERE created_by = 'cecf2275-a336-4cd0-8781-a9702d7275f6');

    -- Limpiar Test Plan Cases
    DELETE FROM test_plan_cases
    WHERE test_plan_id IN (
        SELECT id FROM test_plans 
        WHERE requirement_id IN (SELECT id FROM requirements WHERE created_by = 'cecf2275-a336-4cd0-8781-a9702d7275f6')
    );

    -- Limpiar Test Plans
    DELETE FROM test_plans
    WHERE requirement_id IN (
        SELECT id FROM requirements 
        WHERE created_by = 'cecf2275-a336-4cd0-8781-a9702d7275f6'
    );

    -- Limpiar Builds
    DELETE FROM builds
    WHERE created_by = 'cecf2275-a336-4cd0-8781-a9702d7275f6';

    -- Limpiar Requirements
    DELETE FROM requirements
    WHERE created_by = 'cecf2275-a336-4cd0-8781-a9702d7275f6';

    -- Limpiar Projects
    DELETE FROM projects
    WHERE created_by = 'cecf2275-a336-4cd0-8781-a9702d7275f6';

    -- Limpiar Role Permissions
    DELETE FROM role_permissions
    WHERE role_id IN (SELECT id FROM roles WHERE created_at IS NOT NULL);

    -- Limpiar Roles
    DELETE FROM roles
    WHERE created_at IS NOT NULL;

    -- Limpiar Permissions
    DELETE FROM permissions
    WHERE created_at IS NOT NULL;

    -- Limpiar Keywords
    DELETE FROM keywords
    WHERE created_at IS NOT NULL;

END $$;
