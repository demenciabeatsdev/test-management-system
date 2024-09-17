
/*PROYECTOS*/
INSERT INTO projects (name, description, created_by, created_at, keywords) 
VALUES ('CMS Terminales', 'Description for CMS Terminales', 'cecf2275-a336-4cd0-8781-a9702d7275f6', '2024-09-17 01:25:52', ARRAY['4f8ac3d2-81cf-4db8-9d37-cbbc2303e93d']::uuid[]);
INSERT INTO projects (name, description, created_by, created_at, keywords) 
VALUES ('CORE', 'Description for CORE', 'cecf2275-a336-4cd0-8781-a9702d7275f6', '2024-09-17 01:25:52', ARRAY['4f8ac3d2-81cf-4db8-9d37-cbbc2303e93d']::uuid[]);
INSERT INTO projects (name, description, created_by, created_at, keywords) 
VALUES ('Redes', 'Description for Redes', 'cecf2275-a336-4cd0-8781-a9702d7275f6', '2024-09-17 01:25:52', ARRAY['4f8ac3d2-81cf-4db8-9d37-cbbc2303e93d']::uuid[]);

/*TEST SUITES PADRES*/
INSERT INTO test_suites (name, description, project_id, created_by, created_at, keywords) 
VALUES ('Suite 1 CMS Terminales', 'Description for Suite 1 CMS Terminales', (SELECT id FROM projects WHERE name = 'CMS Terminales'), 'cecf2275-a336-4cd0-8781-a9702d7275f6', '2024-09-17 01:25:52', ARRAY['4f8ac3d2-81cf-4db8-9d37-cbbc2303e93d']::uuid[]);
INSERT INTO test_suites (name, description, project_id, created_by, created_at, keywords) 
VALUES ('Suite 2 CMS Terminales', 'Description for Suite 2 CMS Terminales', (SELECT id FROM projects WHERE name = 'CMS Terminales'), 'cecf2275-a336-4cd0-8781-a9702d7275f6', '2024-09-17 01:25:52', ARRAY['4f8ac3d2-81cf-4db8-9d37-cbbc2303e93d']::uuid[]);

INSERT INTO test_suites (name, description, project_id, created_by, created_at, keywords) 
VALUES ('Suite 1 CORE', 'Description for Suite 1 CORE', (SELECT id FROM projects WHERE name = 'CORE'), 'cecf2275-a336-4cd0-8781-a9702d7275f6', '2024-09-17 01:25:52', ARRAY['4f8ac3d2-81cf-4db8-9d37-cbbc2303e93d']::uuid[]);
INSERT INTO test_suites (name, description, project_id, created_by, created_at, keywords) 
VALUES ('Suite 2 CORE', 'Description for Suite 2 CORE', (SELECT id FROM projects WHERE name = 'CORE'), 'cecf2275-a336-4cd0-8781-a9702d7275f6', '2024-09-17 01:25:52', ARRAY['4f8ac3d2-81cf-4db8-9d37-cbbc2303e93d']::uuid[]);

INSERT INTO test_suites (name, description, project_id, created_by, created_at, keywords) 
VALUES ('Suite 1 Redes', 'Description for Suite 1 Redes', (SELECT id FROM projects WHERE name = 'Redes'), 'cecf2275-a336-4cd0-8781-a9702d7275f6', '2024-09-17 01:25:52', ARRAY['4f8ac3d2-81cf-4db8-9d37-cbbc2303e93d']::uuid[]);
INSERT INTO test_suites (name, description, project_id, created_by, created_at, keywords) 
VALUES ('Suite 2 Redes', 'Description for Suite 2 Redes', (SELECT id FROM projects WHERE name = 'Redes'), 'cecf2275-a336-4cd0-8781-a9702d7275f6', '2024-09-17 01:25:52', ARRAY['4f8ac3d2-81cf-4db8-9d37-cbbc2303e93d']::uuid[]);


/*TEST SUITES HIJAS*/
INSERT INTO test_suites (name, description, project_id, parent_suite_id, created_by, created_at, keywords) 
VALUES ('SubSuite 1 CMS Terminales Suite 1', 'SubSuite 1 CMS Terminales de Suite 1 CMS Terminales', (SELECT id FROM projects WHERE name = 'CMS Terminales'), (SELECT id FROM test_suites WHERE name = 'Suite 1 CMS Terminales'), 'cecf2275-a336-4cd0-8781-a9702d7275f6', '2024-09-17 01:25:52', ARRAY['4f8ac3d2-81cf-4db8-9d37-cbbc2303e93d']::uuid[]);

INSERT INTO test_suites (name, description, project_id, parent_suite_id, created_by, created_at, keywords) 
VALUES ('SubSuite 1 CMS Terminales Suite 2', 'SubSuite 1 CMS Terminales de Suite 2 CMS Terminales', (SELECT id FROM projects WHERE name = 'CMS Terminales'), (SELECT id FROM test_suites WHERE name = 'Suite 2 CMS Terminales'), 'cecf2275-a336-4cd0-8781-a9702d7275f6', '2024-09-17 01:25:52', ARRAY['4f8ac3d2-81cf-4db8-9d37-cbbc2303e93d']::uuid[]);

INSERT INTO test_suites (name, description, project_id, parent_suite_id, created_by, created_at, keywords) 
VALUES ('SubSuite 1 CORE Suite 1', 'SubSuite 1 CORE de Suite 1 CORE', (SELECT id FROM projects WHERE name = 'CORE'), (SELECT id FROM test_suites WHERE name = 'Suite 1 CORE'), 'cecf2275-a336-4cd0-8781-a9702d7275f6', '2024-09-17 01:25:52', ARRAY['4f8ac3d2-81cf-4db8-9d37-cbbc2303e93d']::uuid[]);

INSERT INTO test_suites (name, description, project_id, parent_suite_id, created_by, created_at, keywords) 
VALUES ('SubSuite 1 CORE Suite 2', 'SubSuite 1 CORE de Suite 2 CORE', (SELECT id FROM projects WHERE name = 'CORE'), (SELECT id FROM test_suites WHERE name = 'Suite 2 CORE'), 'cecf2275-a336-4cd0-8781-a9702d7275f6', '2024-09-17 01:25:52', ARRAY['4f8ac3d2-81cf-4db8-9d37-cbbc2303e93d']::uuid[]);

INSERT INTO test_suites (name, description, project_id, parent_suite_id, created_by, created_at, keywords) 
VALUES ('SubSuite 1 Redes Suite 1', 'SubSuite 1 Redes de Suite 1 Redes', (SELECT id FROM projects WHERE name = 'Redes'), (SELECT id FROM test_suites WHERE name = 'Suite 1 Redes'), 'cecf2275-a336-4cd0-8781-a9702d7275f6', '2024-09-17 01:25:52', ARRAY['4f8ac3d2-81cf-4db8-9d37-cbbc2303e93d']::uuid[]);

INSERT INTO test_suites (name, description, project_id, parent_suite_id, created_by, created_at, keywords) 
VALUES ('SubSuite 1 Redes Suite 2', 'SubSuite 1 Redes de Suite 2 Redes', (SELECT id FROM projects WHERE name = 'Redes'), (SELECT id FROM test_suites WHERE name = 'Suite 2 Redes'), 'cecf2275-a336-4cd0-8781-a9702d7275f6', '2024-09-17 01:25:52', ARRAY['4f8ac3d2-81cf-4db8-9d37-cbbc2303e93d']::uuid[]);

/*TEST CASES*/
/*Proyecto  CMS Terminales*/
INSERT INTO test_cases (name, summary, preconditions, importance, test_suite_id, created_by, created_at, status, keywords) 
VALUES ('Test Case 1 for SubSuite 1 CMS Terminales Suite 1', 'Summary for Test Case 1 for SubSuite 1 CMS Terminales Suite 1', 'Preconditions for Test Case 1', 'High', (SELECT id FROM test_suites WHERE name = 'SubSuite 1 CMS Terminales Suite 1'), 'cecf2275-a336-4cd0-8781-a9702d7275f6', '2024-09-17 01:25:52', 'Activo', ARRAY['4f8ac3d2-81cf-4db8-9d37-cbbc2303e93d']::uuid[]);

INSERT INTO test_cases (name, summary, preconditions, importance, test_suite_id, created_by, created_at, status, keywords) 
VALUES ('Test Case 2 for SubSuite 1 CMS Terminales Suite 1', 'Summary for Test Case 1 for SubSuite 1 CMS Terminales Suite 1', 'Preconditions for Test Case 2', 'High', (SELECT id FROM test_suites WHERE name = 'SubSuite 1 CMS Terminales Suite 1'), 'cecf2275-a336-4cd0-8781-a9702d7275f6', '2024-09-17 01:25:52', 'Activo', ARRAY['4f8ac3d2-81cf-4db8-9d37-cbbc2303e93d']::uuid[]);

INSERT INTO test_cases (name, summary, preconditions, importance, test_suite_id, created_by, created_at, status, keywords) 
VALUES ('Test Case 1 for SubSuite 1 CMS Terminales Suite 2', 'Summary for Test Case 1 for SubSuite 1 CMS Terminales Suite 2', 'Preconditions for Test Case 1', 'High', (SELECT id FROM test_suites WHERE name = 'SubSuite 1 CMS Terminales Suite 2'), 'cecf2275-a336-4cd0-8781-a9702d7275f6', '2024-09-17 01:25:52', 'Activo', ARRAY['4f8ac3d2-81cf-4db8-9d37-cbbc2303e93d']::uuid[]);

INSERT INTO test_cases (name, summary, preconditions, importance, test_suite_id, created_by, created_at, status, keywords) 
VALUES ('Test Case 2 for SubSuite 1 CMS Terminales Suite 2', 'Summary for Test Case 2 for SubSuite 1 CMS Terminales Suite 2', 'Preconditions for Test Case 2', 'High', (SELECT id FROM test_suites WHERE name = 'SubSuite 1 CMS Terminales Suite 2'), 'cecf2275-a336-4cd0-8781-a9702d7275f6', '2024-09-17 01:25:52', 'Activo', ARRAY['4f8ac3d2-81cf-4db8-9d37-cbbc2303e93d']::uuid[]);


/*Proyecto  CORE*/
INSERT INTO test_cases (name, summary, preconditions, importance, test_suite_id, created_by, created_at, status, keywords) 
VALUES ('Test Case 1 for SubSuite 1 CORE Suite 1', 'Summary for Test Case 1 for SubSuite 1 CORE Suite 1', 'Preconditions for Test Case 1', 'High', (SELECT id FROM test_suites WHERE name = 'SubSuite 1 CORE Suite 1'), 'cecf2275-a336-4cd0-8781-a9702d7275f6', '2024-09-17 01:25:52', 'Activo', ARRAY['4f8ac3d2-81cf-4db8-9d37-cbbc2303e93d']::uuid[]);

INSERT INTO test_cases (name, summary, preconditions, importance, test_suite_id, created_by, created_at, status, keywords) 
VALUES ('Test Case 2 for SubSuite 1 CORE Suite 1', 'Summary for Test Case 1 for SubSuite 1 CORE Suite 1', 'Preconditions for Test Case 2', 'High', (SELECT id FROM test_suites WHERE name = 'SubSuite 1 CORE Suite 1'), 'cecf2275-a336-4cd0-8781-a9702d7275f6', '2024-09-17 01:25:52', 'Activo', ARRAY['4f8ac3d2-81cf-4db8-9d37-cbbc2303e93d']::uuid[]);

INSERT INTO test_cases (name, summary, preconditions, importance, test_suite_id, created_by, created_at, status, keywords) 
VALUES ('Test Case 1 for SubSuite 1 CORE Suite 2', 'Summary for Test Case 1 for SubSuite 1 CORE Suite 2', 'Preconditions for Test Case 1', 'High', (SELECT id FROM test_suites WHERE name = 'SubSuite 1 CORE Suite 2'), 'cecf2275-a336-4cd0-8781-a9702d7275f6', '2024-09-17 01:25:52', 'Activo', ARRAY['4f8ac3d2-81cf-4db8-9d37-cbbc2303e93d']::uuid[]);

INSERT INTO test_cases (name, summary, preconditions, importance, test_suite_id, created_by, created_at, status, keywords) 
VALUES ('Test Case 2 for SubSuite 1 CORE Suite 2', 'Summary for Test Case 2 for SubSuite 1 CORE Suite 2', 'Preconditions for Test Case 2', 'High', (SELECT id FROM test_suites WHERE name = 'SubSuite 1 CORE Suite 2'), 'cecf2275-a336-4cd0-8781-a9702d7275f6', '2024-09-17 01:25:52', 'Activo', ARRAY['4f8ac3d2-81cf-4db8-9d37-cbbc2303e93d']::uuid[]);

/*Proyecto  Redes*/
INSERT INTO test_cases (name, summary, preconditions, importance, test_suite_id, created_by, created_at, status, keywords) 
VALUES ('Test Case 1 for SubSuite 1 Redes Suite 1', 'Summary for Test Case 1 for SubSuite 1 Redes Suite 1', 'Preconditions for Test Case 1', 'High', (SELECT id FROM test_suites WHERE name = 'SubSuite 1 Redes Suite 1'), 'cecf2275-a336-4cd0-8781-a9702d7275f6', '2024-09-17 01:25:52', 'Activo', ARRAY['4f8ac3d2-81cf-4db8-9d37-cbbc2303e93d']::uuid[]);

INSERT INTO test_cases (name, summary, preconditions, importance, test_suite_id, created_by, created_at, status, keywords) 
VALUES ('Test Case 2 for SubSuite 1 Redes Suite 1', 'Summary for Test Case 1 for SubSuite 1 Redes Suite 1', 'Preconditions for Test Case 2', 'High', (SELECT id FROM test_suites WHERE name = 'SubSuite 1 Redes Suite 1'), 'cecf2275-a336-4cd0-8781-a9702d7275f6', '2024-09-17 01:25:52', 'Activo', ARRAY['4f8ac3d2-81cf-4db8-9d37-cbbc2303e93d']::uuid[]);

INSERT INTO test_cases (name, summary, preconditions, importance, test_suite_id, created_by, created_at, status, keywords) 
VALUES ('Test Case 1 for SubSuite 1 Redes Suite 2', 'Summary for Test Case 1 for SubSuite 1 Redes Suite 2', 'Preconditions for Test Case 1', 'High', (SELECT id FROM test_suites WHERE name = 'SubSuite 1 Redes Suite 2'), 'cecf2275-a336-4cd0-8781-a9702d7275f6', '2024-09-17 01:25:52', 'Activo', ARRAY['4f8ac3d2-81cf-4db8-9d37-cbbc2303e93d']::uuid[]);

INSERT INTO test_cases (name, summary, preconditions, importance, test_suite_id, created_by, created_at, status, keywords) 
VALUES ('Test Case 2 for SubSuite 1 Redes Suite 2', 'Summary for Test Case 2 for SubSuite 1 Redes Suite 2', 'Preconditions for Test Case 2', 'High', (SELECT id FROM test_suites WHERE name = 'SubSuite 1 Redes Suite 2'), 'cecf2275-a336-4cd0-8781-a9702d7275f6', '2024-09-17 01:25:52', 'Activo', ARRAY['4f8ac3d2-81cf-4db8-9d37-cbbc2303e93d']::uuid[]);















