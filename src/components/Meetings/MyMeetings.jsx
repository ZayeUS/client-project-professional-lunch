import React from 'react';
import { useSelector } from 'react-redux';
import MeetingItem from './MeetingItem';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Typography } from '@mui/joy';

export default function MyMeetings() {
  const meetings = useSelector(store => store.meetings);
  console.log("Meetings Data:", meetings);

  // Filter meetings based on their status
  const denied = meetings.filter(meeting => meeting.meeting_status === 'Denied - not available at this time');
  const upcomingMeetings = meetings.filter(meeting => meeting.meeting_status === 'Accepted');
  const pending = meetings.filter(meeting => meeting.meeting_status === 'pending'); // Ensure correct status case
  const archiveMeetings = meetings.filter(meeting => meeting.meeting_status === 'completed');
  const user = useSelector(store => store.user);

  return (
    <div className="container">
      <h1 align="center">My Meetings</h1>

      {/* Display Upcoming Meetings */}
      {upcomingMeetings.length > 0 && (
        <>
          <h2 align="center">Upcoming</h2>
          {upcomingMeetings.map((meeting) => (
            <MeetingItem key={meeting.meeting_id} meeting={meeting} />
          ))}
        </>
      )}

      {/* Display Pending Meetings */}
      {pending.length > 0 && (
        <>
          <h2 align="center">Pending</h2>
          {pending.map((meeting) => (
            <MeetingItem key={meeting.meeting_id} meeting={meeting} />
          ))}
        </>
      )}

      {/* Display Denied Meetings */}
      {denied.length > 0 && (
        <>
          <h2 align="center">Denied</h2>
          {denied.map((meeting) => (
            <MeetingItem key={meeting.meeting_id} meeting={meeting} />
          ))}
        </>
      )}

      {/* No Meetings Available */}
      {meetings.length === 0 && (
        <>
          {user.isMentor ? (
            <h3>You currently have no upcoming meetings.</h3>
          ) : (
            <h3 align="center">No upcoming meetings. Request a meeting with your mentor to keep learning!</h3>
          )}
        </>
      )}

      {/* Display Archived Meetings */}
      {archiveMeetings.length > 0 && (
        <Accordion sx={{ marginTop: '50px' }}>
          <AccordionSummary expandIcon={<ArrowDropDownIcon />} aria-controls="panel1-content" id="panel1-header">
            <Typography>Archived Meetings</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {archiveMeetings.map((meeting) => (
              <MeetingItem key={meeting.meeting_id} meeting={meeting} />
            ))}
          </AccordionDetails>
        </Accordion>
      )}
    </div>
  );
}
