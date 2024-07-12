const express = require('express');
const pool = require('../modules/pool');
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const router = express.Router();

// GET meetings based on mentor status 
router.get('/', rejectUnauthenticated, (req, res) => {
  console.log('/meetings GET route');
  console.log('user', req.user);
  if (req.user.isMentor === false) {
    queryText = `SELECT * FROM "meetings" JOIN "mentorships" ON meetings.mentorship_id=mentorships.id
	                    WHERE mentorships.mentee_id=$1;`;
  } else {
    queryText = `SELECT * FROM "meetings" JOIN "mentorships" ON meetings.mentorship_id=mentorships.id
	                    WHERE mentorships.mentor_id=$1;`;
  }
  pool
    .query(queryText, [req.user.id])
    .then((result) => {
      res.send(result.rows);
    })
    .catch((error) => {
      res.sendStatus(500);
      console.log('error in getting meetings', error);
    });
});

// POST
router.post('/:id', rejectUnauthenticated, (req, res) => {
    console.log('/meetings POST route');
    if (req.user.isMentor === false) {
        queryText = `INSERT INTO "meetings" ("mentorship_id", "date", "start", "end", "link", "location", "notes")
	                VALUES ((SELECT "id" FROM "mentorships" WHERE "mentorships"."mentee_id"=$1 AND "mentorships"."mentor_id"=$2), $3, $4, $5, $6, $7, $8);`
    } else {
        queryText = `INSERT INTO "meetings" ("mentorship_id", "date", "start", "end", "link", "location", "notes")
	                VALUES ((SELECT "id" FROM "mentorships" WHERE "mentorships"."mentor_id"=$1 AND "mentorships"."mentee_id"=$2), $3, $4, $5, $6, $7, $8);`
    }
    pool.query(queryText, [
        req.user.id,
        req.params.id,
        req.body.date,
        req.body.start,
        req.body.end,
        req.body.link,
        req.body.location,
        req.body.notes
    ])
    .then(() => {
        res.sendStatus(200);
      })
      .catch((error) => {
        res.sendStatus(500);
        console.log('error in posting meeting', error);
      });
  });

// PUT
router.put('/:id', rejectUnauthenticated, (req, res) => {
    console.log('user', req.user);
    if (req.user.isMentor === false) {
        queryText = `UPDATE "meetings" SET "date"=$1, "start"=$2, "end"=$3, "link"=$4, "location"=$5, "notes"=$6 
        WHERE meetings.mentorship_id=(SELECT "id" FROM "mentorships" WHERE "mentorships"."mentee_id"=$7 AND "mentorships"."mentor_id"=$8);`
    } else {
        queryText= `UPDATE "meetings" SET "date"=$1, "start"=$2, "end"=$3, "link"=$4, "location"=$5, "notes"=$6 
        WHERE meetings.mentorship_id=(SELECT "id" FROM "mentorships" WHERE "mentorships"."mentor_id"=$7 AND "mentorships"."mentee_id"=$8);`
    }
    pool.query(
      queryText,
      [
        req.body.date,
        req.body.start,
        req.body.end,
        req.body.link,
        req.body.location,
        req.body.notes,
        req.user.id,
        req.params.id
      ]
    )
    .then(() => {
      res.sendStatus(201);
    })
    .catch((error) => {
      console.log('error in editing the mentor meeting details', error);
      res.sendStatus(500);
    });
});

// DELETE
router.delete('/:id', rejectUnauthenticated, (req, res) => {
  pool
    .query(
      `DELETE FROM "meetings" WHERE "meetings".id=$1;`,
      [req.params.id]
    )
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log('error in deleting meeting', error);
      res.sendStatus(500);
    });
});

module.exports = router;
