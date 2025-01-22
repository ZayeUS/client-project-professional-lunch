const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const encryptLib = require("../modules/encryption");
const pool = require("../modules/pool");
const userStrategy = require("../strategies/user.strategy");

const router = express.Router();

// Handles Ajax request for user information if user is authenticated
router.get("/", rejectUnauthenticated, (req, res) => {
  // Send back user object from the session (previously queried from the database)
  res.send(req.user);
});

// Handles POST request with new user data
// The only thing different from this and every other post we've seen
// is that the password gets encrypted before being inserted
// router
//   .post("/register", (req, res, next) => {
//     const username = req.body.username;
//     const password = encryptLib.encryptPassword(req.body.password);

//     const queryText = `INSERT INTO "user" (username, password)
//     VALUES ($1, $2) RETURNING id`;
//     pool
//       .query(queryText, [username, password])
//       .then((result) => {
//         const userID = result.rows[0].id;
//         return pool.query(
//           `INSERT INTO "profiles" ("user_id", "isMentor", "first_name", "last_name", "email", "gender", "school", "bio", "linkedin")
//       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING user_id`,
//           [
//             userID,
//             req.body.isMentor,
//             req.body.first_name,
//             req.body.last_name,
//             req.body.email,
//             req.body.gender,
//             req.body.school,
//             req.body.bio,
//             req.body.linkedin,
//           ]
//         );
//       })
//       .then((result) => {
//         const userID = result.rows[0].user_id;
//         console.log(result);

//         const queryPromises = [];

//         for (let availability of req.body.availability) {
//           const queryPromise = pool.query(
//             `INSERT INTO "availability" (user_id, day, time) VALUES ($1, $2, $3) RETURNING id, user_id;`,
//             [userID, Number(availability.day), Number(availability.time)]
//           );
//           queryPromises.push(queryPromise);
//         }

//         Promise.all(queryPromises)
//           .then((results) => {
//             results.forEach((insertResult) => {});
//             res.sendStatus(201);
//           })
//           .catch((err) => {
//             console.error("Error executing INSERT queries:", err);
//             res.sendStatus(500);
//           });
//       })
//       .then((result) => {
//         console.log(result);
//         pool.query(`INSERT INTO "profile`)
//       }).catch((error) => {
//         console.log(error)
//       })
//   })

// router.post("/register", (req, res) => {
//   const username = req.body.username;
//   const password = encryptLib.encryptPassword(req.body.password);

//   // let userID = 0;

//   const queryText = `INSERT INTO "user" (username, password, isAdmin, isMentor)
//     VALUES ($1, $2) RETURNING id`;
//   pool
//     .query(queryText, [username, password, false, false])
//     .then((result) => {
//       // userID = result.rows[0].id;
//       // pool.query(
//       //   `INSERT INTO "profiles" ("user_id", "isMentor", "first_name", "last_name", "email", "gender", "school", "bio", "linkedin")
//       // VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING user_id;`,
//       //   [
//       //     userID,
//       //     req.body.isMentor,
//       //     req.body.first_name,
//       //     req.body.last_name,
//       //     req.body.email,
//       //     req.body.gender,
//       //     req.body.school,
//       //     req.body.bio,
//       //     req.body.linkedin,
//       //   ]
//       // );
//     })
// .then((result) => {
//   // const userID = result.rows[0].user_id;
//   console.log("Result.rows and req.body", result, req.body);
//   const insertAvailabilityPromises = req.body.availability.map(
//     (availability) => {
//       return pool.query(
//         `INSERT INTO "availability" (user_id, day, time) VALUES ($1, $2, $3) RETURNING id;`,
//         [userID, Number(availability.day), Number(availability.time)]
//       );
//     }
//   );

//   return Promise.all(insertAvailabilityPromises);
// })
// .then((result) => {
//   console.log("result", result);
//   const availIDs = result.map(
//     (insertResult) => insertResult.rows[0].id
//   );
//   console.log("AvailIDs", availIDs);
//   res.sendStatus(201);
// })
// .then((result) => {
//   pool.query(`INSERT INTO profiles_availability (profile_id, availability_id)
//                 VALUES ((SELECT "id" FROM profiles WHERE "user_id"=$1), $2);`,
//                 [userID, availIDs]
// );
// })
// .catch((err) => {
//   console.log("User registration failed: ", err);
//   res.sendStatus(500);
// });

// .then((result) => {
//   // const userID = result.rows[0].user_id;
//   console.log('Result.rows and req.body', result, req.body);
//   for (let availability of req.body.availability) {
//     pool.query(
//       `INSERT INTO "availability" (user_id, day, time) VALUES ($1, $2, $3) RETURNING id;`,
//       [userID, Number(availability.day), Number(availability.time)]
//     );
//   }
//   res.sendStatus(201);
// }).then((result) => {
//   console.log('result', result);
//   // const availID = result.rows[0].id;
//   // console.log('AvailID', availID);
// })
// .catch((err) => {
//   console.log("User registration failed: ", err);
//   res.sendStatus(500);
// });
// });

// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful





router.post("/register", (req, res) => {
  const username = req.body.username;
  const password = encryptLib.encryptPassword(req.body.password);
  console.log(req.body)

  // let userID = 0;

  const queryText = `INSERT INTO "user" (username, password, "isMentor")
    VALUES ($1, $2, $3 ) RETURNING id;`;
  pool
    .query(queryText, [username, password, req.body.isMentor])
    .then((result) => {
      res.sendStatus(201)
    })
    .catch((err) => {
      console.log("User registration failed: ", err);
      res.sendStatus(500);
    });
});





router.post("/login", userStrategy.authenticate("local"), (req, res) => {
  res.sendStatus(200);
});

// clear all server session information about this user
router.post("/logout", (req, res, next) => {
  // Use passport's built-in method to log out the user
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.sendStatus(200);
  });
});

// POST route to set isActive to false
router.post("/deactivate", async (req, res) => {
  try {
    const userId = req.body.userId; // Get the user ID from the request body
    if (!userId) {
      return res.status(400).send("User ID is required.");
    }

    const queryText = `UPDATE "user" SET "isActive" = FALSE WHERE "id" = $1;`;
    await pool.query(queryText, [userId]);
    res.sendStatus(200); // Success response
  } catch (error) {
    console.error("Error in deactivating user:", error);
    res.sendStatus(500); // Internal server error
  }
});

// POST route to set isActive to true (Activate)
router.post("/activate", async (req, res) => {
  try {
    const userId = req.body.userId; // Get the user ID from the request body
    if (!userId) {
      return res.status(400).send("User ID is required.");
    }

    const queryText = `UPDATE "user" SET "isActive" = TRUE WHERE "id" = $1;`;
    await pool.query(queryText, [userId]);
    res.sendStatus(200); // Success response
  } catch (error) {
    console.error("Error in activating user:", error);
    res.sendStatus(500); // Internal server error
  }
});

module.exports = router;
