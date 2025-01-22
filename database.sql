-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
-- Otherwise you will have errors!
CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    username character varying(100) NOT NULL UNIQUE,
    password character varying(100) NOT NULL,
    "isAdmin" boolean DEFAULT false,
    "isMentor" boolean DEFAULT false
);

CREATE TABLE IF NOT EXISTS "interests" (
	"id" SERIAL PRIMARY KEY,
	"interest" VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS "genders" (
	"id" SERIAL PRIMARY KEY,
	"gender" VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS "schools" (
	"id" SERIAL PRIMARY KEY,
	"school" VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS "days" (
	"id" SERIAL PRIMARY KEY,
	"day" VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS "times" (
	"id" SERIAL PRIMARY KEY,
	"time" VARCHAR NOT NULL
);

CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    user_id integer REFERENCES "user"(id) ON DELETE CASCADE,
    "isMentor" boolean DEFAULT false,
    avatar character varying,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    email character varying NOT NULL,
    gender integer NOT NULL REFERENCES genders(id),
    school integer REFERENCES schools(id),
    bio character varying,
    linkedin character varying,
    calendar_link character varying
);




CREATE TABLE availability (
    id SERIAL PRIMARY KEY,
    profile_id integer REFERENCES profiles(id) ON DELETE CASCADE,
    day integer REFERENCES days(id),
    time integer REFERENCES times(id)
);



CREATE TABLE mentorships (
    id SERIAL PRIMARY KEY,
    requested_at timestamp without time zone NOT NULL DEFAULT now(),
    mentee_id integer NOT NULL REFERENCES profiles(id),
    mentor_id integer NOT NULL REFERENCES profiles(id),
    status character varying DEFAULT 'pending'::character varying,
    CONSTRAINT mentorships_mentee_id_mentor_id_key UNIQUE (mentee_id, mentor_id)
);

CREATE TABLE meetings (
    id SERIAL PRIMARY KEY,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    mentorship_id integer NOT NULL REFERENCES mentorships(id) ON DELETE CASCADE,
    date date NOT NULL,
    start time without time zone NOT NULL,
    "end" time without time zone NOT NULL,
    link character varying,
    location character varying,
    notes character varying,
    status character varying DEFAULT 'pending'::character varying
);

CREATE TABLE IF NOT EXISTS "resources" (
  "id" SERIAL PRIMARY KEY,
  "title" VARCHAR NOT NULL, 
  "image" VARCHAR NOT NULL, 
  "url" VARCHAR NOT NULL,
  "about" VARCHAR (500),
  "category" VARCHAR,
  "notes" VARCHAR (500)
);


CREATE TABLE IF NOT EXISTS "profiles_availability" (
	"id" SERIAL PRIMARY KEY,
	"profile_id" INT REFERENCES "profiles",
	"availability_id" INT REFERENCES "availability"
);

CREATE TABLE IF NOT EXISTS "profiles_interests" (
	"id" SERIAL PRIMARY KEY,
	"profile_id" INT REFERENCES "profiles" ON DELETE CASCADE,
	"interest_id" INT REFERENCES "interests"
);


INSERT INTO "interests" ("interest")
VALUES
('Business and Entreprenuership'),
('Technology and IT'),
('Healthcare and Medicine'),
('Engineering and Manufacturing'),
('Law and Legal Services'),
('Marketing and Advertising'),
('Finance and Accounting'),
('Arts and Entertainment'),
('Public Relations and Communications'),
('Non-Profit and Social Work'),
('Government and Public Policy'),
('Environmental Science and Sustainability'),
('Academic and Career Planning'),
('Professional Development'),
('Personal Growth'),
('Skill Development'),
('Other');

INSERT INTO "genders" ("gender")
VALUES
('Male'),
('Female'),
('Other');

INSERT INTO "schools" ("school")
VALUES
('Concordia'),
('MSCTC'),
('MSUM'),
('NDSCS'),
('NDSU'),
('Rasmussen'),
('University of Mary'),
('Not Applicable'),
('Other');

INSERT INTO "days" ("day")
VALUES
('Monday'),
('Tuesday'),
('Wednesday'),
('Thursday'),
('Friday'),
('Saturday'),
('Sunday');

INSERT INTO "times" ("time")
VALUES
('Morning'),
('Lunch'),
('Afternoon'),
('Evening'),
('All Day');

INSERT INTO "resources" ("title", "image", "url", "about", "category", "notes")
VALUES
('Job Service of North Dakota', 'https://play-lh.googleusercontent.com/dLWsSGAegyPMuwSE3mvBSSKCbovH9I0Mc_FbqSfKZ58opcMROedfirw95Smf4idMjg=w240-h480-rw', 'https://www.jobsnd.com/', 'Job Service North Dakota provides workforce and unemployment services across the state in our nine Workforce Centers', 'Jobs', 'A resource for jobs in the state of North Dakota'),
('Job Service of Minnesota', 'https://i0.wp.com/empowerinclusion.org/wp-content/uploads/2020/05/image.png?resize=395%2C127&ssl=1', 'https://mn.gov/deed/programs-services/mn-job-service/', 'Job Service Minnesotas focus is to deliver services to help job seekers find work and help employers find and retain qualified employees.', 'Jobs', 'A resource for jobs in the state of Minnesota');

ALTER TABLE mentorships
	ADD UNIQUE ("mentee_id", "mentor_id");