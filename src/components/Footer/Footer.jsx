import React from 'react';
import { useEffect, useState, useRef } from 'react';
import './Footer.css';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import EventIcon from '@mui/icons-material/Event';
import GroupsIcon from '@mui/icons-material/Groups';
import ListIcon from '@mui/icons-material/List';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useSelector } from 'react-redux';

function Footer() {
  const [value, setValue] = React.useState(0);
  const history = useHistory();
  const user = useSelector((store) => store.user);

  // State to track if the footer should be visible
  const [showFooter, setShowFooter] = useState(false);

   // Ref to store the timeout ID
   const timeoutRef = useRef(null);

   // Function to handle visibility
   const handleVisibility = () => {
     setShowFooter(true);
 
     // Clear the previous timeout
     if (timeoutRef.current) {
       clearTimeout(timeoutRef.current);
     }
 
     // Set a new timeout to hide the footer after 3 seconds of inactivity
     timeoutRef.current = setTimeout(() => {
       setShowFooter(false);
     }, 2000);
   };
 
   // Add event listeners for scroll, touch, and mouse events
   useEffect(() => {
     window.addEventListener('scroll', handleVisibility);
     window.addEventListener('touchmove', handleVisibility);
     window.addEventListener('mousemove', handleVisibility);
 
     return () => {
       window.removeEventListener('scroll', handleVisibility);
       window.removeEventListener('touchmove', handleVisibility);
       window.removeEventListener('mousemove', handleVisibility);
     };
   }, []);

  const goHome = () => {
    history.push('/home');
  };

  const goMentorships = () => {
    {
      user.isMentor ? history.push('/my-mentees') : history.push('/my-mentors');
    }
  };

  const goMeetings = () => {
    history.push('/my-meetings');
  };

  const goResources = () => {
    history.push('/resources');
  };

  return (
    <>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      {user.id && showFooter && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            margin: 'auto',
            width: '100vw',
            zIndex: 1,
          }}
        >
          <BottomNavigation
            sx={{
              bgcolor: '#15a140',
              '& .Mui-selected': {
                '& .MuiBottomNavigationAction-label': {
                  fontSize: (theme) => theme.typography.caption.fontSize,
                  transition: 'none',
                  fontWeight: 'bold',
                  lineHeight: '20px',
                },
                '& .MuiSvgIcon-root, & .MuiBottomNavigationAction-label': {
                  color: '#184025',
                },
              },
            }}
            showLabels
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
          >
            <BottomNavigationAction
              sx={{ color: '#FFFFFF' }}
              label='Home'
              icon={<HomeIcon sx={{ color: '#FFFFFF' }} />}
              onClick={goHome}
            />
            <BottomNavigationAction
              sx={{ color: '#FFFFFF' }}
              label='Mentorships'
              icon={<GroupsIcon sx={{ color: 'FFFFFF' }} />}
              onClick={goMentorships}
            />
            <BottomNavigationAction
              sx={{ color: '#FFFFFF' }}
              label='Meetings'
              icon={<EventIcon sx={{ color: '#FFFFFF' }} />}
              onClick={goMeetings}
            />
            <BottomNavigationAction
              sx={{ color: '#FFFFFF' }}
              label='Resources'
              icon={<ListIcon sx={{ color: 'FFFFFF' }} />}
              onClick={goResources}
            />
          </BottomNavigation>
        </Box>
      )}

      {!user.id && <></>}
    </>
  );
}

export default Footer;