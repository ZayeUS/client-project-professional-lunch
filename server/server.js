const cors = require('cors');
const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 5001;

const corsOptions = {
  origin: 'http://localhost:5173,https://client-project-professional-lunch.fly.dev/', // Frontend URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};
app.use(cors(corsOptions));

// Middleware Includes
const sessionMiddleware = require('./modules/session-middleware');
const passport = require('./strategies/user.strategy');

// Route Includes
const userRouter = require('./routes/user.router');
const profileRouter = require('./routes/profile.router');
const resourcesRouter = require('./routes/resources.router');
const meetingsRouter = require('./routes/meetings.router');
const mentorshipsRouter = require('./routes/mentorships.router');
const interestsRouter = require('./routes/interests.router');
const availabilityRouter = require('./routes/availability.router');
const genderRouter = require('./routes/gender.router');
const schoolsRouter = require('./routes/schools.router');
const adminProfilesRouter = require('./routes/adminprofiles.router');
const menteeSearchRouter = require('./routes/menteesearch.router');
const profileAvailabilityRouter = require("./routes/profile.availability.router");
const profileCheckRouter = require("./routes/profile.check.router");
const zoomRouter = require('./routes/zoom.router'); // Import the Zoom router

// Express Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('build'));

// Passport Session Configuration
app.use(sessionMiddleware);

// Start Passport Sessions
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/user', userRouter);
app.use('/api/profile', profileRouter);
app.use('/api/resources', resourcesRouter);
app.use('/api/meetings', meetingsRouter);
app.use('/api/mentorships', mentorshipsRouter);
app.use('/api/interests', interestsRouter);
app.use('/api/availability', availabilityRouter);
app.use('/api/genders', genderRouter);
app.use('/api/schools', schoolsRouter);
app.use('/api/adminprofiles', adminProfilesRouter);
app.use('/api/menteesearch', menteeSearchRouter);
app.use("/api/profileavailability", profileAvailabilityRouter);
app.use("/api/check", profileCheckRouter);
app.use("/api/zoom", zoomRouter);  // Register the Zoom router

// Listen Server & Port
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
