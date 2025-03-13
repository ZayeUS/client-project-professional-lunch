const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

// GET all profiles
router.get("/", (req, res) => {
  pool
    .query(`SELECT * FROM "profiles";`)

    .then((result) => {
      res.send(result.rows);
    })
    .catch((error) => {
      res.sendStatus(500);
      console.log("error in getting profiles", error);
    });
});

// GET profile information for logged in user
// GET profile information for logged in user
router.get("/my-details", async (req, res) => {
  try {
    // Fetch the profile details and isActive status
// Correct the reference to the "isActive" column
const queryText = `SELECT p.*, u."isActive" FROM "profiles" p
                   JOIN "user" u ON u.id = p.user_id
                   WHERE p."user_id" = $1`;

    const result = await pool.query(queryText, [req.user.id]);
    
    const queryText2 = `WITH interests_cte AS (
      SELECT
        profiles.user_id,
        json_agg(DISTINCT interests.*) AS interests
      FROM
        profiles_interests
      JOIN
        interests ON profiles_interests.interest_id = interests.id
      JOIN
        profiles ON profiles_interests.profile_id = profiles.id
      GROUP BY
        profiles.user_id
    ),
    availability_cte AS (
      SELECT
        profiles.user_id,
        array_agg(json_build_object(
          'availability_id', availability.id,
          'day_id', days.id,
          'day', days.day,
          'time_id', times.id,
          'time', times.time
        )) AS availability
      FROM
        profiles_availability
      JOIN
        availability ON profiles_availability.availability_id = availability.id
      JOIN
        days ON availability.day = days.id
      JOIN
        times ON availability.time = times.id
      JOIN
        profiles ON profiles_availability.profile_id = profiles.id
      GROUP BY
        profiles.user_id
    )
    SELECT
      "user".id AS user_id,
      "user".username,
      interests_cte.interests,
      availability_cte.availability
    FROM
      "user"
    JOIN
      profiles ON "user".id = profiles.user_id
    LEFT JOIN
      interests_cte ON profiles.user_id = interests_cte.user_id
    LEFT JOIN
      availability_cte ON profiles.user_id = availability_cte.user_id
    WHERE
      "user".id = $1;`;
    
    const result2 = await pool.query(queryText2, [req.user.id]);
    
    // Return the profile and details along with isActive status
    const response = {
      profile: result.rows[0],
      details: result2.rows[0],
    };
    res.send(response);
  } catch (error) {
    console.log("Error getting profile details", error);
    res.sendStatus(500);
  }
});


// GET profile information for specific user
router.get("/:id", async (req, res) => {
  try {
    const queryText = `SELECT * FROM "profiles" WHERE "user_id"=$1`;
    const result = await pool.query(queryText, [req.params.id]);
    const queryText2 = `WITH interests_cte AS (
      SELECT
        profiles.user_id,
        json_agg(DISTINCT interests.*) AS interests
      FROM
        profiles_interests
      JOIN
        interests ON profiles_interests.interest_id = interests.id
      JOIN
        profiles ON profiles_interests.profile_id = profiles.id
      GROUP BY
        profiles.user_id
    ),
    availability_cte AS (
      SELECT
        profiles.user_id,
        array_agg(json_build_object(
          'availability_id', availability.id,
          'day_id', days.id,
          'day', days.day,
          'time_id', times.id,
          'time', times.time
        )) AS availability
      FROM
        profiles_availability
      JOIN
        availability ON profiles_availability.availability_id = availability.id
      JOIN
        days ON availability.day = days.id
      JOIN
        times ON availability.time = times.id
      JOIN
        profiles ON profiles_availability.profile_id = profiles.id
      GROUP BY
        profiles.user_id
    )
    SELECT
      "user".id AS user_id,
      "user".username,
      interests_cte.interests,
      availability_cte.availability,
      schools.school AS school_name
    FROM
      "user"
    JOIN
      profiles ON "user".id = profiles.user_id
    LEFT JOIN
      interests_cte ON profiles.user_id = interests_cte.user_id
    LEFT JOIN
      availability_cte ON profiles.user_id = availability_cte.user_id
    LEFT JOIN
      schools ON profiles.school = schools.id
    WHERE
      "user".id = $1;`;
    const result2 = await pool.query(queryText2, [req.params.id]);
    const response = {
      profile: result.rows[0],
      details: result2.rows[0],
    };
    res.send(response);
  } catch (error) {
    console.log("Error getting profile details", error);
    res.sendStatus(500);
  }
});

// POST new profile
router.post("/", async (req, res) => {
  // console.log("/profile POST route", req.body);
  console.log("user:", req.user);
  try {
    const queryText = `INSERT INTO "profiles" ("user_id", "isMentor", "first_name", "last_name", "email", "gender", "school", "bio", "linkedin", "avatar")
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10 ) RETURNING id, user_id;`;
    const result = await pool.query(queryText, [
      req.user.id,
      req.user.isMentor,
      req.body.first_name,
      req.body.last_name,
      req.body.email,
      req.body.gender,
      req.body.school,
      req.body.bio,
      req.body.linkedin,
      req.body.avatar.avatar,
    ]);

    const availabilityIDs = [];
    // console.log("availability:", req.body.availability);
    for (availability of req.body.availability) {
      const day = availability.day;
      const time = availability.time;
      const availabilityID = await pool.query(
        `INSERT INTO "availability" ("profile_id", "day", "time") VALUES ($1, $2, $3) RETURNING id;`,
        [result.rows[0].id, Number(day), Number(time)]
      );
      availabilityIDs.push(availabilityID.rows[0].id);
    }

    for (interest of req.body.interests) {
      const interestID = interest.id;
      await pool.query(
        `INSERT INTO profiles_interests (profile_id, interest_id) VALUES ($1, $2)`,
        [result.rows[0].id, interestID]
      );
    }

    // console.log("AVAILABILITY IDS", availabilityIDs.Result.rows);
    for (availabilityID of availabilityIDs) {
      await pool.query(
        `INSERT INTO "profiles_availability" (profile_id, availability_id) VALUES ($1, $2)`,
        [result.rows[0].id, Number(availabilityID)]
      );
    }

    // console.log("interests:", req.body);
    const queryText2 = `UPDATE "user" SET "isMentor"=$1 WHERE "user".id=$2;`;
    await pool.query(queryText2, [req.user.isMentor, req.user.id]);
    await pool.query;
    res.sendStatus(200);
  } catch (error) {
    console.log("Error in post profile", error);
    res.sendStatus(500);
  }
});

// PUT edit profile
// PUT edit profile
router.put("/", rejectUnauthenticated, async (req, res) => {
  try {
    // Query to update profile details including isActive status & calendar_link
    const queryText = `UPDATE "profiles" 
                        SET "avatar"=$1, "bio"=$2, "linkedin"=$3, "email"=$4, "gender"=$5, 
                            "school"=$6, "calendar_link"=$7
                        WHERE "profiles"."user_id"=$8;`;

    await pool.query(queryText, [
      req.body.profile.avatar,
      req.body.profile.bio,
      req.body.profile.linkedin,
      req.body.profile.email,
      req.body.profile.gender,
      req.body.profile.school,
      req.body.profile.calendar_link, // Calendly link added here
      req.user.id,
    ]);

    // Now update the user table to include the 'isActive' status
    const queryText2 = `UPDATE "user" 
                        SET "isActive"=$1 
                        WHERE "user".id=$2;`;

    await pool.query(queryText2, [
      req.body.isActive, // Ensure that 'isActive' is passed in the request body
      req.user.id,
    ]);

    // Update the interests and availability
    const interests = req.body.details.interests;
    await pool.query(`DELETE FROM profiles_interests WHERE profile_id=$1;`, [
      req.body.profile.id,
    ]);
    for (let interest of interests) {
      await pool.query(
        `INSERT INTO profiles_interests (profile_id, interest_id) VALUES ($1, $2)`,
        [req.body.profile.id, interest.id]
      );
    }

    // Deleting and adding new availability records
    await pool.query(`DELETE FROM profiles_availability WHERE profile_id=$1`, [
      req.body.profile.id,
    ]);
    await pool.query(`DELETE FROM availability WHERE profile_id=$1`, [
      req.body.profile.id,
    ]);

    const availabilities = req.body.details.availability;
    for (const availability of availabilities) {
      const result = await pool.query(
        `INSERT INTO availability (profile_id, day, time) VALUES ($1, $2, $3)
        RETURNING id;`,
        [req.body.profile.id, availability.day_id, availability.time_id]
      );

      const availabilityID = result.rows[0].id;
      await pool.query(
        `INSERT INTO profiles_availability (profile_id, availability_id) VALUES ($1, $2);`,
        [req.body.profile.id, availabilityID]
      );
    }

    res.sendStatus(200); // Success response
  } catch (error) {
    console.log("Error in updating profile", error);
    res.sendStatus(500); // Internal server error
  }
});


// DELETE profile *need to ON DELETE CASCADE mentorships
router.delete("/", async (req, res) => {
  try {
    await pool.query(`DELETE FROM "profiles" WHERE id=$1`, [req.user.id]);
    res.sendStatus(200);
  } catch (error) {
    console.log(" error in deleting a profile", error);
    res.sendStatus(500);
  }
});

module.exports = router;