const express = require('express');
const pool = require('../modules/pool');
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const router = express.Router();

router.get('/interest', rejectUnauthenticated, async (req, res) => {
  console.log(`Get mentors based on specific mentees interests`);
  const queryText = `WITH user_interests AS (
    SELECT i.id AS interest_id
    FROM profiles p
    JOIN "user" u ON u.id = p.user_id
    JOIN profiles_interests pi ON p.id = pi.profile_id
    JOIN interests i ON pi.interest_id = i.id
    WHERE p."isMentor" = false AND u.id = $1
),
mentor_profiles AS (
    SELECT p.*, i.interest, i.id AS interest_id
    FROM profiles p
    JOIN profiles_interests pi ON p.id = pi.profile_id
    JOIN interests i ON pi.interest_id = i.id
    JOIN "user" u ON u.id = p.user_id  -- Join with the user table to access isActive
    WHERE p."isMentor" = true AND u."isActive" = true  -- Only active mentors
)
SELECT DISTINCT ON (mp.id) mp.*
FROM mentor_profiles mp
JOIN user_interests ui ON mp.interest_id = ui.interest_id
ORDER BY mp.id;
`;
  try {
    const result = await pool.query(queryText, [req.user.id]);
    res.send(result.rows);
  } catch (error) {
    console.log(`Error in GET Mentors for specific mentee`, error);
    res.sendStatus(500);
  }
});

router.get('/gender/:id', rejectUnauthenticated, async (req, res) => {
  console.log(`Get mentors based on gender`);
  const queryText = `SELECT p.*
                      FROM profiles p
                      JOIN "user" u ON u.id = p.user_id  -- Join with the user table to access isActive
                      WHERE p."isMentor" = TRUE AND p.gender = $1 AND u."isActive" = true;`; 
  try {
    const result = await pool.query(queryText, [req.params.id]);
    res.send(result.rows);
  } catch (error) {
    console.log(`Error in GET Mentors for specific mentee`, error);
    res.sendStatus(500);
  }
});


module.exports = router;
