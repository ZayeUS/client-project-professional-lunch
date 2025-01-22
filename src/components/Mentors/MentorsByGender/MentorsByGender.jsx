import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Stack, Typography } from '@mui/joy';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MaleMentors from './MaleMentors';
import FemaleMentors from './FemaleMentors';
import NonBinaryMentors from './NonBinaryMentors';
import NotSayMentors from './NotSayMentors';
import OtherMentors from './OtherMentors';

export default function MentorsByGender() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const dispatch = useDispatch();
  const profiles = useSelector((store) => store.profiles);
  console.log('Profiles:', profiles);
  const mentors = profiles.filter((profile) => profile.isMentor);
  console.log('Mentors', mentors);
  const user = useSelector((store) => store.user);
  console.log('User', user);
  const availableMentors = mentors.filter(
    (mentor) => !user.mentorships.includes(mentor.id)
  );
  console.log('Available Mentors', availableMentors);

  useEffect(() => {
    dispatch({ type: 'FETCH_PROFILES' });
    dispatch({ type: 'FETCH_INTEREST_PROFILES' });
    // dispatch({ type: 'FETCH_GENDER_PROFILES'});
  }, []);

  return (
    <div>
      <div>
        <Accordion>
          <AccordionSummary
            expandIcon={<ArrowDropDownIcon />}
            aria-controls='panel1-content'
            id='panel1-header'
          >
            <Typography>Male</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <MaleMentors />
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ArrowDropDownIcon />}
            aria-controls='panel2-content'
            id='panel2-header'
          >
            <Typography>Female</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FemaleMentors />
          </AccordionDetails>
        </Accordion>
      
      </div>
    </div>
  );
}
