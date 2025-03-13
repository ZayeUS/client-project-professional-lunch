const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Query to fetch users with isMentor = true and mentor_status = 'pending'
    const queryText = `SELECT id, username, isMentor, mentor_status, isAdmin, created_at 
                       FROM "user" 
                       WHERE isMentor = true AND mentor_status = 'pending';`;

    // Execute the query
    const result = await pool.query(queryText);

    // If users are found, return them
    if (result.rows.length > 0) {
      res.status(200).json(result.rows);
    } else {
      res.status(404).send("No pending mentors found.");
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Internal server error");
  }
});

router.put('/:mentorId/approve', async (req, res) => {
  try {
    const { mentorId } = req.params;
    await pool.query(`UPDATE "user" SET mentor_status = 'approved' WHERE id = $1`, [mentorId]);
    res.status(200).json({ id: mentorId });
  } catch (error) {
    console.error("Error approving mentor:", error);
    res.status(500).send("Internal server error");
  }
});


module.exports = router;
