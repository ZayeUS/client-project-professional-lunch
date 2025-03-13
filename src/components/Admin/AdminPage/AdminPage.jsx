import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import MentorList from '../Mentors/MentorList/MentorList';
import MenteeList from '../Mentees/MenteeList/MenteeList';
import MentorshipList from '../Mentorships/MentorshipList/MentorshipList';
import MeetingsList from '../Meetings/MeetingsList/MeetingsList';
import InterestsList from '../Interests/InterestsList/InterestsList';
import SchoolsList from '../Schools/SchoolsList/SchoolsList';
import GendersList from '../Genders/GendersList/GendersList';
import { Button, Stack, Typography } from '@mui/joy';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function AdminPage() {
  const [value, setValue] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [pendingMentors, setPendingMentors] = useState([]);

  useEffect(() => {
    if (value === 1) { // When the Mentor Approvals tab is clicked
      fetchPendingMentors(); // Fetch pending mentors using API
    }
  }, [value]);

  const fetchPendingMentors = async () => {
    try {
      const response = await axios.get('https://client-project-professional-lunch.fly.dev/api/pendingmentors/pending'); // API endpoint to get pending mentors
      if (response.status === 200) {
        setPendingMentors(response.data); // Set the list of pending mentors
      } else {
        console.error('Failed to fetch pending mentors');
      }
    } catch (error) {
      console.error('Error fetching pending mentors:', error);
    }
  };

  const handleApproveMentor = async (mentorId) => {
    try {
      const response = await axios.put(`https://client-project-professional-lunch.fly.dev/api/pendingmentors/${mentorId}/approve`);
      if (response.status === 200) {
        setOpenModal(true); // Show confirmation modal
        fetchPendingMentors(); // Refresh the list of pending mentors
      } else {
        console.error('Failed to approve mentor');
      }
    } catch (error) {
      console.error('Error approving mentor:', error);
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="container">
      <h1>Admin Page</h1>

      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="fullWidth"
            textColor="inherit"
            TabIndicatorProps={{
              style: {
                backgroundColor: 'black',
              },
            }}
          >
            <Tab label="Mentors" {...a11yProps(0)} sx={{ '&.Mui-selected': { color: 'black' } }} />
            <Tab label="Mentor Approvals" {...a11yProps(1)} sx={{ '&.Mui-selected': { color: 'black' } }} />
            <Tab label="Mentees" {...a11yProps(2)} sx={{ '&.Mui-selected': { color: 'black' } }} />
            <Tab label="Mentorships" {...a11yProps(3)} sx={{ '&.Mui-selected': { color: 'black' } }} />
            <Tab label="Meetings" {...a11yProps(4)} sx={{ '&.Mui-selected': { color: 'black' } }} />
            <Tab label="Interests" {...a11yProps(5)} sx={{ '&.Mui-selected': { color: 'black' } }} />
            <Tab label="Schools" {...a11yProps(6)} sx={{ '&.Mui-selected': { color: 'black' } }} />
            <Tab label="Genders" {...a11yProps(7)} sx={{ '&.Mui-selected': { color: 'black' } }} />
          </Tabs>
        </Box>

        {/* Mentor Approvals Tab */}
        <CustomTabPanel value={value} index={1}>
          <Stack spacing={2} alignItems="center">
            <Typography variant="h6">Mentor Approvals</Typography>
            {pendingMentors.length > 0 ? (
              <Stack spacing={2}>
                {pendingMentors.map((mentor) => (
                  <Box key={mentor.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography>{mentor.first_name} {mentor.last_name}</Typography>
                    <Button variant="outlined" color="success" onClick={() => handleApproveMentor(mentor.id)}>
                      Approve
                    </Button>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Typography>No pending mentor approvals.</Typography>
            )}
          </Stack>
        </CustomTabPanel>

        {/* Other Tabs */}
        <CustomTabPanel value={value} index={0}><MentorList /></CustomTabPanel>
        <CustomTabPanel value={value} index={2}><MenteeList /></CustomTabPanel>
        <CustomTabPanel value={value} index={3}><MentorshipList /></CustomTabPanel>
        <CustomTabPanel value={value} index={4}><MeetingsList /></CustomTabPanel>
        <CustomTabPanel value={value} index={5}><InterestsList /></CustomTabPanel>
        <CustomTabPanel value={value} index={6}><SchoolsList /></CustomTabPanel>
        <CustomTabPanel value={value} index={7}><GendersList /></CustomTabPanel>
      </Box>

      {/* Modal for confirmation */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Mentor Approved</DialogTitle>
        <DialogContent>
          <p>The mentor has been successfully approved.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
