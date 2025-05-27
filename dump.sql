--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4 (Debian 17.4-1.pgdg120+2)
-- Dumped by pg_dump version 17.4 (Debian 17.4-1.pgdg120+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: admin
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO admin;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: admin
--

COMMENT ON SCHEMA public IS '';


--
-- Name: Category; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public."Category" AS ENUM (
    'Development',
    'Testing',
    'Bugs'
);


ALTER TYPE public."Category" OWNER TO admin;

--
-- Name: Priority; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public."Priority" AS ENUM (
    'High',
    'Medium',
    'Low'
);


ALTER TYPE public."Priority" OWNER TO admin;

--
-- Name: Status; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public."Status" AS ENUM (
    'In_Progress',
    'In_Review',
    'On_Hold',
    'Completed'
);


ALTER TYPE public."Status" OWNER TO admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO admin;

--
-- Name: tasks; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.tasks (
    id integer NOT NULL,
    title character varying(100) NOT NULL,
    duedate date NOT NULL,
    description jsonb NOT NULL,
    priority public."Priority" NOT NULL,
    status public."Status" NOT NULL,
    category public."Category" NOT NULL
);


ALTER TABLE public.tasks OWNER TO admin;

--
-- Name: tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tasks_id_seq OWNER TO admin;

--
-- Name: tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.tasks_id_seq OWNED BY public.tasks.id;


--
-- Name: tasks id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.tasks ALTER COLUMN id SET DEFAULT nextval('public.tasks_id_seq'::regclass);


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
7f1cab22-faf7-4078-ae7e-be0427d2fd31	bd356a0db27bf347a676dc864613c0594a1345e7c5dbfa65e12ba1a850fa92b8	2025-05-21 05:49:43.013922+00	20250520094603_update_tasks	\N	\N	2025-05-21 05:49:42.995247+00	1
737fa54c-242f-4c30-9a5a-aa403900344f	0424f5346dd49ecc2c5e9a705da6f731e518382be66158a255677d714cb6c6a5	2025-05-21 05:49:43.047771+00	20250521054603_fix_id_autoincrement	\N	\N	2025-05-21 05:49:43.018066+00	1
761a426d-4632-494f-b3b3-34f6a3e173a4	b666d62c55cd1d511a2bb8d0fdb7258ca07d2db792462709fbf39ebad4aa226d	2025-05-21 05:50:05.273502+00	20250521054953_use_enums	\N	\N	2025-05-21 05:50:05.264101+00	1
\.


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.tasks (id, title, duedate, description, priority, status, category) FROM stdin;
5	Write Integration Tests for Payment API	2025-07-01	{"notes": "Waiting for Stripe API key from finance team.", "details": "Cover successful payments, failed payments, and refunds.", "summary": "Add tests for Stripe payment integration", "acceptanceCriteria": ["80% coverage for payment endpoints", "Mock Stripe API calls", "Handle edge cases like network errors"]}	Low	In_Review	Testing
14	Test TaskTest TaskTest TaskTest TaskTest TaskTest TaskTest TaskTest TaskTest TaskTest Task	2025-05-25	{"notes": "Test Task\\nTest Task\\nTest Task\\nTest Task\\nTest Task\\nTest Task\\nTest Task\\n", "details": "Test Task\\nTest Task\\nTest Task\\nTest TaskTest Task\\nTest Task\\nTest Task\\nTest Task\\n\\n", "summary": "Test Task\\nTest Task\\nTest Task\\nTest TasTest Task\\nTest Task\\nTest Task\\nTest Task\\nTest Task\\nk\\n", "acceptanceCriteria": ["Test Task", "Test Task", "Test Task", "Test Task", "Test Task", "Test Task", "Test Task", "Test Task"]}	Low	Completed	Development
9	Resolve Dashboard Chart Flicker	2025-05-04	{"notes": "Suspect useEffect cleanup issue.", "details": "Charts flicker when switching between status and category tabs.", "summary": "Fix flickering on chart load", "acceptanceCriteria": ["No flicker on tab switch", "Charts load smoothly", "Tested with 100+ tasks"]}	Medium	In_Review	Bugs
7	Test Dark Mode Toggle	2025-06-15	{"notes": "Test on Safari and Edge.", "details": "Ensure toggle switches themes and persists user preference.", "summary": "Validate dark mode functionality", "acceptanceCriteria": ["Theme switches instantly", "Preference saved in localStorage", "No UI glitches in dark mode"]}	Low	Completed	Testing
11	Test Task Drag-and-Drop	2025-05-24	{"notes": "Use react-dnd touch backend for mobile.", "details": "Ensure tasks can be moved between columns without errors.", "summary": "Validate drag-and-drop functionality", "acceptanceCriteria": ["Tasks update status/priority on drop", "No UI lag during drag", "Tested on touch devices"]}	Medium	Completed	Testing
15	soner 	2025-05-30	{"notes": "soner soner ", "details": "soner soner ", "summary": "soner soner ", "acceptanceCriteria": ["soner soner "]}	Medium	In_Review	Testing
13	TESTING	2025-05-31	{"notes": "TESTINGTESTINGTESTING", "details": "TESTINGTESTINGTESTING", "summary": "TESTINGTESTINGTESTING", "acceptanceCriteria": ["TESTINGTESTINGTESTING"]}	Medium	On_Hold	Testing
1	Test Task	2025-05-30	{"notes": "", "details": "Test", "summary": "Test", "acceptanceCriteria": []}	Low	In_Progress	Development
10	Document API Endpoints	2025-06-20	{"notes": "Prioritize after feature freeze.", "details": "Use OpenAPI to document GET, POST, PATCH, DELETE endpoints.", "summary": "Create API documentation for tasks", "acceptanceCriteria": ["Docs cover all endpoints", "Include example requests/responses", "Hosted on Postman or Swagger"]}	High	In_Review	Development
4	Fix Login Timeout Bug	2025-05-24	{"notes": "Check Supabase auth settings.", "details": "Users are logged out after 5 minutes due to JWT expiry misconfiguration.", "summary": "Resolve session timeout issue on login", "acceptanceCriteria": ["Session lasts 24 hours", "Refresh token works corre", "Tested on Chrome and Firefox"]}	Low	In_Review	Bugs
3	Implement User Profile Page	2025-06-10	{"notes": "Coordinate with UI/UX team for design specs.", "details": "Include fields for name, email, and profile picture. Use Supabase for storage.", "summary": "Create a user profile page with editable fields", "acceptanceCriteria": ["Users can update their name", "Profile picture uploads to Supabase", "Changes persist in database", "UI matches Figma designs"]}	High	On_Hold	Development
6	Optimize Task List Rendering	2025-05-30	{"notes": "Used React Window for virtualization.", "details": "Reduce render time for 1000+ tasks using memoization and virtualization.", "summary": "Improve performance of task list component", "acceptanceCriteria": ["Render time < 200ms for 1000 tasks", "No UI lag on filter changes", "Tested on low-end devices"]}	Medium	In_Progress	Development
12	Add Task Filter Validation	2025-06-12	{"notes": "Completed on 2025-05-20.", "details": "Prevent invalid filter combinations (e.g., empty category).", "summary": "Validate filter inputs on task list", "acceptanceCriteria": ["Invalid filters show error toast", "Filters reset to All if invalid", "Tested with edge cases"]}	Medium	On_Hold	Development
8	Add Password Reset Flow	2025-06-05	{"notes": "Ensure email template is branded.", "details": "Send reset link using Supabase auth and handle token validation.", "summary": "Implement password reset via email", "acceptanceCriteria": ["Email sent within 5 seconds", "Reset link expires in 1 hour", "New password updates in database"]}	Medium	On_Hold	Development
\.


--
-- Name: tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.tasks_id_seq', 16, true);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: admin
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

