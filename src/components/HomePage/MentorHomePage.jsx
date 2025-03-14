import React, { useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import MentorItem from '../Mentors/MentorItem';
import Requests from '../Mentorships/MentorRequests';
import MentorRequests from '../Mentorships/MentorRequests';
import MenteeRequests from '../Mentorships/MenteeRequests';
import MeetingItem from '../Meetings/MeetingItem';

function MentorHomePage() {
  const dispatch = useDispatch();
  const user = useSelector(store => store.user);
  const profile = useSelector(store => store.profileDetails);
  console.log('Profile', profile);
  const mentorships = useSelector(store => store.mentorships);
  console.log('Mentorships', mentorships);
  const pending = mentorships.filter(mentor => mentor.status === 'pending');
  console.log('Pending mentorships', pending);
  const accepted = mentorships.filter(mentor => mentor.status === 'accepted');
  console.log('Accepted mentorships', accepted);
  const meetings = useSelector(store => store.meetings);
  console.log('Meetings', meetings);
  const meetingRequests = meetings.filter(meeting => meeting.meeting_status === 'Pending');
  console.log('Meeting requests', meetingRequests);
  const acceptedMeetings = meetings.filter(meeting => meeting.meeting_status === 'Accepted');
  console.log('Accepted meetings', acceptedMeetings);

  useEffect(() => {
    dispatch({ type: 'FETCH_PROFILE_DETAILS', payload: user.id });
    dispatch({ type: 'FETCH_MENTORSHIPS' });
    dispatch({ type: 'FETCH_MEETINGS' });
  }, []);

  return (
    <div className="container">
      <h1 align='center'>Welcome, {profile?.profile?.first_name}!</h1>
      <h2 align='center'>Mentorship Requests</h2>
      {pending.length > 0 ? 
      <>
      {pending.map((mentee) => (
        <MentorRequests key={mentee.id} mentee={mentee} />
      ))}
      </>
      :
      <>
      <h4 align='center'>No mentorship requests.</h4> 
      </>
      }
      <h2 align='center'>Upcoming Meetings</h2>
      {meetings.length === 0 ? 
      <>
        <h3 align='center'>No upcoming meetings.</h3> 
      </>
      : 
      <></>
      }
      {meetingRequests.length > 0 ? 
        <>
        <h3 align='center'>Requests</h3>
        {meetingRequests.map((meeting) => (
          <MeetingItem key={meeting.id} meeting={meeting} />
        ))}
        </>
      : 
      <></>
      }
      {acceptedMeetings.length > 0 ? 
      <>
      <h3 align='center'>Accepted</h3>
      {acceptedMeetings.map((meeting) => (
        <MeetingItem key={meeting.id} meeting={meeting} />
      ))}
      </>
      :
      <>
      </>
      }
    </div>
  );
}

// this allows us to use <App /> in index.js
export default MentorHomePage;
