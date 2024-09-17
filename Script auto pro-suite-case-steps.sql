DO $$ 
DECLARE
    i INTEGER;  -- Contador para bucles
    j INTEGER;  -- Contador anidado para suites hijas y test cases
    k INTEGER;  -- Contador anidado para test cases dentro de suites
    v_project_id UUID;  -- Renombrado para evitar ambigüedad
    suite_id UUID;
    subsuite_id UUID;
    test_case_id UUID;
    role_id UUID;
    permission_id UUID;
    requirement_id UUID;
    build_id UUID;
    test_plan_id UUID;
    keyword_id UUID;
    keyword_array UUID[];  -- Arreglo de UUIDs de keywords
    create_by UUID := 'cecf2275-a336-4cd0-8781-a9702d7275f6';  -- ID fijo para 'created_by'
BEGIN
    -- Insertar Keywords y almacenar sus UUIDs en un array
    FOR i IN 1..20 LOOP
        INSERT INTO keywords (keyword_name, description, created_at)
        VALUES ('Keyword ' || i, 'Description for Keyword ' || i, NOW())
        RETURNING id INTO keyword_id;

        -- Agregar cada keyword creada al arreglo
        keyword_array := array_append(keyword_array, keyword_id);
    END LOOP;

    -- Insertar Permissions
    FOR i IN 1..5 LOOP
        INSERT INTO permissions (permission_name, description, created_at)
        VALUES ('Permission ' || i, 'Description for Permission ' || i, NOW())
        RETURNING id INTO permission_id;
    END LOOP;

    -- Insertar Roles y Role Permissions
    FOR i IN 1..3 LOOP
        INSERT INTO roles (role_name, description, created_at)
        VALUES ('Role ' || i, 'Description for Role ' || i, NOW())
        RETURNING id INTO role_id;

        -- Asignar permisos a roles
        FOR j IN 1..3 LOOP
            INSERT INTO role_permissions (role_id, permission_id, created_at)
            VALUES (role_id, (SELECT id FROM permissions ORDER BY RANDOM() LIMIT 1), NOW());
        END LOOP;
    END LOOP;

    -- Crear Proyectos
    FOR i IN 1..2 LOOP
        INSERT INTO projects (name, description, created_by, created_at, keywords) 
        VALUES ('Project ' || i, 'Description for Project ' || i, create_by, NOW(), ARRAY[keyword_array[i], keyword_array[i + 1]])
        RETURNING id INTO v_project_id;

        -- Crear Test Suites Principales para cada Proyecto
        FOR j IN 1..3 LOOP
            INSERT INTO test_suites (name, description, project_id, created_by, created_at, keywords) 
            VALUES ('Suite ' || j || ' for Project ' || i, 'Description for Suite ' || j || ' in Project ' || i, v_project_id, create_by, NOW(), ARRAY[keyword_array[j], keyword_array[j + 1]])
            RETURNING id INTO suite_id;

            -- Crear SubSuites para cada Suite Principal
            FOR k IN 1..2 LOOP
                INSERT INTO test_suites (name, description, project_id, parent_suite_id, created_by, created_at, keywords) 
                VALUES ('SubSuite ' || k || ' for Suite ' || j || ' in Project ' || i, 'Description for SubSuite ' || k || ' in Suite ' || j || ' in Project ' || i, v_project_id, suite_id, create_by, NOW(), ARRAY[keyword_array[k + 3], keyword_array[k + 4]])
                RETURNING id INTO subsuite_id;

                -- Crear Casos de Prueba para cada SubSuite
                FOR j IN 1..5 LOOP
                    INSERT INTO test_cases (name, summary, preconditions, importance, test_suite_id, created_by, created_at, status, keywords) 
                    VALUES ('Test Case ' || j || ' for SubSuite ' || subsuite_id, 'Summary for Test Case ' || j || ' in SubSuite ' || subsuite_id, 'Preconditions for Test Case ' || j, 'High', subsuite_id, create_by, NOW(), 'Activo', ARRAY[keyword_array[j + 5], keyword_array[j + 6]])
                    RETURNING id INTO test_case_id;

                    -- Crear Steps de Prueba para cada Caso de Prueba
                    FOR k IN 1..3 LOOP
                        INSERT INTO test_case_steps (test_case_id, step_number, actions, expected_results, created_by, created_at) 
                        VALUES (test_case_id, k, 'Action ' || k || ' for Test Case ' || j, 'Expected result ' || k || ' for Test Case ' || j, create_by, NOW());
                    END LOOP;
                END LOOP;
            END LOOP;
        END LOOP;

        -- Insertar Requirements para cada Proyecto
        FOR j IN 1..5 LOOP
            INSERT INTO requirements (name, description, jira_id, created_by, created_at, keywords)
            VALUES ('Requirement ' || j || ' for Project ' || i, 'Description for Requirement ' || j || ' in Project ' || i, 'JIRA-' || j, create_by, NOW(), ARRAY[keyword_array[j + 7], keyword_array[j + 8]])
            RETURNING id INTO requirement_id;
        END LOOP;

        -- Insertar Builds para cada Proyecto
        FOR j IN 1..3 LOOP
            INSERT INTO builds (version, release_date, tech_leader, created_by, created_at, keywords)
            VALUES ('1.' || j || '.0 for Project ' || i, NOW()::date - (j * 30), 'Tech Leader ' || j, create_by, NOW(), ARRAY[keyword_array[j + 9], keyword_array[j + 10]])
            RETURNING id INTO build_id;
        END LOOP;

        -- Insertar Test Plans para cada Proyecto
        FOR j IN 1..3 LOOP
            INSERT INTO test_plans (name, description, requirement_id, build_id, created_by, created_at, keywords)
            VALUES ('Test Plan ' || j || ' for Project ' || i, 'Description for Test Plan ' || j || ' in Project ' || i, (SELECT id FROM requirements WHERE name = 'Requirement ' || j || ' for Project ' || i), (SELECT id FROM builds WHERE version = '1.' || j || '.0 for Project ' || i), create_by, NOW(), ARRAY[keyword_array[j + 11], keyword_array[j + 12]])
            RETURNING id INTO test_plan_id;

            -- Insertar Test Plan Cases solo para los casos de prueba del proyecto actual
            FOR k IN 1..3 LOOP
                INSERT INTO test_plan_cases (test_plan_id, test_case_id, duplicated_name, duplicated_summary, duplicated_preconditions, duplicated_importance, created_at)
                VALUES (test_plan_id, (SELECT id FROM test_cases WHERE test_suite_id IN (SELECT id FROM test_suites WHERE project_id = v_project_id) ORDER BY RANDOM() LIMIT 1), 
                        'Duplicated Case Name ' || k, 'Duplicated Summary ' || k, 'Duplicated Preconditions ' || k, 'Media', NOW());
            END LOOP;
        END LOOP;
    END LOOP;
END $$;
