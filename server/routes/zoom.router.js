const express = require('express');
const axios = require('axios');
const router = express.Router();

// Replace with your Zoom OAuth App credentials
const client_id = '1Yt6RBX5SKi6Dpik2qQkQ'; // Your OAuth Client ID
const client_secret = '5W1m9h0FXJJ8YAjZsbsJbiU3SUW77W3Z'; // Your OAuth Client Secret
const redirect_uri = 'http://localhost:5173/'; // Your Redirect URI

// Step 1: Route to fetch OAuth token (if you don't have it yet)
router.get('/getOAuthToken', async (req, res) => {
  const authorizationCode = req.query.code; // OAuth code passed from the frontend

  const tokenUrl = 'https://zoom.us/oauth/token';
  const data = new URLSearchParams();
  data.append('grant_type', 'authorization_code');
  data.append('code', authorizationCode);
  data.append('redirect_uri', redirect_uri);

  try {
    const response = await axios.post(tokenUrl, data, {
      auth: {
        username: client_id,
        password: client_secret,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token } = response.data;
    res.json({ access_token });
  } catch (error) {
    console.error('Error fetching OAuth token:', error.response?.data || error.message);
    res.status(500).send('Error fetching OAuth token');
  }
});

// Step 2: Route to create Zoom meeting
router.post('/createZoomMeeting', async (req, res) => {
  const { newMeeting, userEmail, accessToken } = req.body; // userEmail and accessToken from frontend
  
  // Prepare meeting data
  const startDateTime = `${newMeeting.date}T${newMeeting.start}:00Z`;
  const endDateTime = `${newMeeting.date}T${newMeeting.end}:00Z`;

  const meetingData = {
    topic: newMeeting.topic || "Default Meeting Topic",
    type: 2, // Scheduled meeting type
    start_time: startDateTime,
    duration: calculateDuration(newMeeting.start, newMeeting.end),
    timezone: "UTC",
    agenda: newMeeting.notes || "",
    settings: {
      host_video: true,
      participant_video: true,
      mute_upon_entry: true,
      approval_type: 2, // Auto-approve participants
      audio: "voip", // Audio option (voip)
      auto_recording: "cloud", // Enable cloud recording
    },
  };

  try {
    // Create Zoom meeting for the specified user
    const response = await axios.post(
      `https://api.zoom.us/v2/users/${userEmail}/meetings`, // Correct endpoint
      meetingData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Use OAuth token here
          'Content-Type': 'application/json',
        },
      }
    );

    const joinUrl = response.data.join_url;
    await updateMeetingLink(newMeeting.meetingId, joinUrl); // Update the database with meeting link

    res.json({ join_url: joinUrl });
  } catch (error) {
    console.error('Error creating Zoom meeting:', error.response?.data || error.message);
    res.status(500).send('Error creating Zoom meeting');
  }
});

// Helper function to calculate meeting duration in minutes
function calculateDuration(start, end) {
  const startTime = new Date(`1970-01-01T${start}:00Z`);
  const endTime = new Date(`1970-01-01T${end}:00Z`);
  return (endTime - startTime) / 1000 / 60; // Duration in minutes
}

// Helper function to update the meeting link in the database
async function updateMeetingLink(meetingId, link) {
  console.log(`Updating meeting link in database for meetingId: ${meetingId}`);
  const queryText = `UPDATE "meetings" SET "link" = $1 WHERE "id" = $2;`;
  await pool.query(queryText, [link, meetingId]);
}

module.exports = router;
