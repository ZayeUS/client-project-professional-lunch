const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

router.get('/pending', async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM "user" WHERE "user"."isMentor" = true AND "user"."mentor_status" = 'pending'`);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows);
    } else {
      res.status(404).send('No pending mentors found.');
    }
  } catch (error) {
    console.error('Error fetching pending mentors:', error);
    res.status(500).send('Internal server error');
  }
});

router.put('/:mentorId/approve', async (req, res) => {
  const { mentorId } = req.params;
  try {
    await pool.query(`UPDATE "user" SET mentor_status = 'approved' WHERE id = $1`, [mentorId]);
    res.status(200).json({ id: mentorId });
  } catch (error) {
    console.error('Error approving mentor:', error);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
