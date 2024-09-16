CREATE DATABASE test_management_system;

-- Versión 1 del script SQL para el sistema de gestión de casos de prueba

-- Configuración inicial
BEGIN;

-- ============================================================
-- CREACIÓN DE TABLAS PRINCIPALES
-- ============================================================

-- public.execution_status definition

-- Drop table

-- DROP TABLE public.execution_status;

CREATE TABLE public.execution_status (
	id serial4 NOT NULL,
	status_name varchar(50) NOT NULL,
	description text NULL,
	CONSTRAINT execution_status_pkey PRIMARY KEY (id),
	CONSTRAINT execution_status_status_name_key UNIQUE (status_name)
);

-- Permissions

ALTER TABLE public.execution_status OWNER TO postgres;
GRANT ALL ON TABLE public.execution_status TO postgres;


-- public.keywords definition

-- Drop table

-- DROP TABLE public.keywords;

CREATE TABLE public.keywords (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	keyword_name varchar(100) NOT NULL,
	description text NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT keywords_keyword_name_key UNIQUE (keyword_name),
	CONSTRAINT keywords_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.keywords OWNER TO postgres;
GRANT ALL ON TABLE public.keywords TO postgres;


-- public.permissions definition

-- Drop table

-- DROP TABLE public.permissions;

CREATE TABLE public.permissions (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	permission_name varchar(100) NOT NULL,
	description text NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT permissions_permission_name_key UNIQUE (permission_name),
	CONSTRAINT permissions_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.permissions OWNER TO postgres;
GRANT ALL ON TABLE public.permissions TO postgres;


-- public.requirements definition

-- Drop table

-- DROP TABLE public.requirements;

CREATE TABLE public.requirements (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	description text NULL,
	jira_id varchar(50) NULL,
	created_by varchar(255) NOT NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	keywords _uuid NULL,
	CONSTRAINT requirements_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.requirements OWNER TO postgres;
GRANT ALL ON TABLE public.requirements TO postgres;


-- public.roles definition

-- Drop table

-- DROP TABLE public.roles;

CREATE TABLE public.roles (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	role_name varchar(50) NOT NULL,
	description text NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT roles_pkey PRIMARY KEY (id),
	CONSTRAINT roles_role_name_key UNIQUE (role_name)
);

-- Permissions

ALTER TABLE public.roles OWNER TO postgres;
GRANT ALL ON TABLE public.roles TO postgres;


-- public.role_permissions definition

-- Drop table

-- DROP TABLE public.role_permissions;

CREATE TABLE public.role_permissions (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	role_id uuid NOT NULL,
	permission_id uuid NOT NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT role_permissions_pkey PRIMARY KEY (id),
	CONSTRAINT role_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON DELETE CASCADE,
	CONSTRAINT role_permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE
);

-- Permissions

ALTER TABLE public.role_permissions OWNER TO postgres;
GRANT ALL ON TABLE public.role_permissions TO postgres;


-- public.users definition

-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	username varchar(100) NOT NULL,
	email varchar(255) NOT NULL,
	password_hash varchar(255) NOT NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	last_login timestamp NULL,
	role_id uuid NULL,
	is_active bool DEFAULT true NOT NULL,
	CONSTRAINT users_email_key UNIQUE (email),
	CONSTRAINT users_pkey PRIMARY KEY (id),
	CONSTRAINT users_username_key UNIQUE (username),
	CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE SET NULL
);

-- Permissions

ALTER TABLE public.users OWNER TO postgres;
GRANT ALL ON TABLE public.users TO postgres;


-- public.builds definition

-- Drop table

-- DROP TABLE public.builds;

CREATE TABLE public.builds (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	"version" varchar(50) NOT NULL,
	release_date date NOT NULL,
	tech_leader varchar(255) NOT NULL,
	created_by uuid NOT NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	keywords _uuid NULL,
	CONSTRAINT builds_pkey PRIMARY KEY (id),
	CONSTRAINT builds_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Permissions

ALTER TABLE public.builds OWNER TO postgres;
GRANT ALL ON TABLE public.builds TO postgres;


-- public.projects definition

-- Drop table

-- DROP TABLE public.projects;

CREATE TABLE public.projects (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	description text NULL,
	created_by uuid NOT NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	keywords _uuid NULL,
	CONSTRAINT projects_name_key UNIQUE (name),
	CONSTRAINT projects_pkey PRIMARY KEY (id),
	CONSTRAINT projects_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Permissions

ALTER TABLE public.projects OWNER TO postgres;
GRANT ALL ON TABLE public.projects TO postgres;


-- public.test_plans definition

-- Drop table

-- DROP TABLE public.test_plans;

CREATE TABLE public.test_plans (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	description text NULL,
	requirement_id uuid NULL,
	build_id uuid NULL,
	created_by uuid NOT NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	keywords _uuid NULL,
	CONSTRAINT test_plans_name_key UNIQUE (name),
	CONSTRAINT test_plans_pkey PRIMARY KEY (id),
	CONSTRAINT test_plans_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Permissions

ALTER TABLE public.test_plans OWNER TO postgres;
GRANT ALL ON TABLE public.test_plans TO postgres;


-- public.test_suites definition

-- Drop table

-- DROP TABLE public.test_suites;

CREATE TABLE public.test_suites (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	description text NULL,
	project_id uuid NULL,
	parent_suite_id uuid NULL,
	created_by uuid NOT NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	keywords _uuid NULL,
	CONSTRAINT test_suites_name_key UNIQUE (name),
	CONSTRAINT test_suites_pkey PRIMARY KEY (id),
	CONSTRAINT test_suites_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE CASCADE,
	CONSTRAINT test_suites_parent_suite_id_fkey FOREIGN KEY (parent_suite_id) REFERENCES public.test_suites(id) ON DELETE CASCADE,
	CONSTRAINT test_suites_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE
);

-- Permissions

ALTER TABLE public.test_suites OWNER TO postgres;
GRANT ALL ON TABLE public.test_suites TO postgres;


-- public.user_tokens definition

-- Drop table

-- DROP TABLE public.user_tokens;

CREATE TABLE public.user_tokens (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	user_id uuid NOT NULL,
	"token" varchar(255) NOT NULL,
	expires_at timestamp NULL,
	is_active bool DEFAULT true NOT NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamp NULL,
	CONSTRAINT user_tokens_pkey PRIMARY KEY (id),
	CONSTRAINT user_tokens_token_key UNIQUE (token),
	CONSTRAINT user_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Permissions

ALTER TABLE public.user_tokens OWNER TO postgres;
GRANT ALL ON TABLE public.user_tokens TO postgres;


-- public.execution_cycles definition

-- Drop table

-- DROP TABLE public.execution_cycles;

CREATE TABLE public.execution_cycles (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	test_plan_id uuid NOT NULL,
	execution_date timestamp NOT NULL,
	executed_by uuid NOT NULL,
	results json NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamp NULL,
	status_id int4 NULL,
	CONSTRAINT execution_cycles_pkey PRIMARY KEY (id),
	CONSTRAINT execution_cycles_executed_by_fkey FOREIGN KEY (executed_by) REFERENCES public.users(id) ON DELETE CASCADE,
	CONSTRAINT execution_cycles_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.execution_status(id),
	CONSTRAINT execution_cycles_test_plan_id_fkey FOREIGN KEY (test_plan_id) REFERENCES public.test_plans(id) ON DELETE CASCADE
);

-- Table Triggers

create trigger set_default_status_before_insert before
insert
    on
    public.execution_cycles for each row execute function set_default_status();

-- Permissions

ALTER TABLE public.execution_cycles OWNER TO postgres;
GRANT ALL ON TABLE public.execution_cycles TO postgres;


-- public.test_cases definition

-- Drop table

-- DROP TABLE public.test_cases;

CREATE TABLE public.test_cases (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	summary text NULL,
	preconditions text NULL,
	importance varchar(10) NOT NULL,
	test_suite_id uuid NOT NULL,
	created_by uuid NOT NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	status varchar(10) DEFAULT 'Activo'::character varying NOT NULL,
	keywords _uuid NULL,
	CONSTRAINT test_cases_importance_check CHECK (((importance)::text = ANY ((ARRAY['Alta'::character varying, 'Media'::character varying, 'Baja'::character varying])::text[]))),
	CONSTRAINT test_cases_name_key UNIQUE (name),
	CONSTRAINT test_cases_pkey PRIMARY KEY (id),
	CONSTRAINT test_cases_status_check CHECK (((status)::text = ANY ((ARRAY['Activo'::character varying, 'Inactivo'::character varying])::text[]))),
	CONSTRAINT test_cases_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE CASCADE,
	CONSTRAINT test_cases_test_suite_id_fkey FOREIGN KEY (test_suite_id) REFERENCES public.test_suites(id) ON DELETE CASCADE
);

-- Permissions

ALTER TABLE public.test_cases OWNER TO postgres;
GRANT ALL ON TABLE public.test_cases TO postgres;


-- public.test_plan_cases definition

-- Drop table

-- DROP TABLE public.test_plan_cases;

CREATE TABLE public.test_plan_cases (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	test_plan_id uuid NOT NULL,
	test_case_id uuid NOT NULL,
	duplicated_name varchar(255) NOT NULL,
	duplicated_summary text NULL,
	duplicated_preconditions text NULL,
	duplicated_importance varchar(10) NOT NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT test_plan_cases_duplicated_importance_check CHECK (((duplicated_importance)::text = ANY ((ARRAY['Alta'::character varying, 'Media'::character varying, 'Baja'::character varying])::text[]))),
	CONSTRAINT test_plan_cases_pkey PRIMARY KEY (id),
	CONSTRAINT test_plan_cases_test_case_id_fkey FOREIGN KEY (test_case_id) REFERENCES public.test_cases(id) ON DELETE CASCADE,
	CONSTRAINT test_plan_cases_test_plan_id_fkey FOREIGN KEY (test_plan_id) REFERENCES public.test_plans(id) ON DELETE CASCADE
);

-- Permissions

ALTER TABLE public.test_plan_cases OWNER TO postgres;
GRANT ALL ON TABLE public.test_plan_cases TO postgres;


-- public.test_case_execution definition

-- Drop table

-- DROP TABLE public.test_case_execution;

CREATE TABLE public.test_case_execution (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	execution_cycle_id uuid NOT NULL,
	test_case_id uuid NOT NULL,
	executed_by uuid NOT NULL,
	start_time timestamp NULL,
	end_time timestamp NULL,
	logs json NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamp NULL,
	status_id int4 NULL,
	CONSTRAINT test_case_execution_pkey PRIMARY KEY (id),
	CONSTRAINT test_case_execution_executed_by_fkey FOREIGN KEY (executed_by) REFERENCES public.users(id) ON DELETE CASCADE,
	CONSTRAINT test_case_execution_execution_cycle_id_fkey FOREIGN KEY (execution_cycle_id) REFERENCES public.execution_cycles(id) ON DELETE CASCADE,
	CONSTRAINT test_case_execution_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.execution_status(id),
	CONSTRAINT test_case_execution_test_case_id_fkey FOREIGN KEY (test_case_id) REFERENCES public.test_cases(id) ON DELETE CASCADE
);

-- Table Triggers

create trigger set_default_status_before_insert before
insert
    on
    public.test_case_execution for each row execute function set_default_status();

-- Permissions

ALTER TABLE public.test_case_execution OWNER TO postgres;
GRANT ALL ON TABLE public.test_case_execution TO postgres;


-- public.test_case_steps definition

-- Drop table

-- DROP TABLE public.test_case_steps;

CREATE TABLE public.test_case_steps (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	test_case_id uuid NOT NULL,
	step_number int4 NOT NULL,
	actions text NULL,
	expected_results text NULL,
	created_by uuid NOT NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT test_case_steps_pkey PRIMARY KEY (id),
	CONSTRAINT test_case_steps_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE CASCADE,
	CONSTRAINT test_case_steps_test_case_id_fkey FOREIGN KEY (test_case_id) REFERENCES public.test_cases(id) ON DELETE CASCADE
);

-- Permissions

ALTER TABLE public.test_case_steps OWNER TO postgres;
GRANT ALL ON TABLE public.test_case_steps TO postgres;