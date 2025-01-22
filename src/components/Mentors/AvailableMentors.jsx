import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Stack, Typography } from '@mui/joy';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { IconButton } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import MentorItem from './MentorItem';
import MentorAccordions from './MentorsByGender/Mentor Accordions';

export default function AvailableMentors() {
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
  const interestMentors = useSelector((store) => store.menteeSearchProfiles);
  console.log('Interest Mentors', interestMentors);
  const filterInterestMentors = interestMentors.filter(mentor => !user.mentorships.includes(mentor.id));

  useEffect(() => {
    dispatch({ type: 'FETCH_PROFILES' });
    dispatch({ type: 'FETCH_INTEREST_PROFILES' });
    window.scrollTo(0, 0);
  }, []);

  const mentorsPerPage = 3;
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentMentors = filterInterestMentors.slice(
    currentIndex,
    currentIndex + mentorsPerPage
  );

  const nextMentors = () => {
    if (currentIndex + mentorsPerPage >= filterInterestMentors.length) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex + mentorsPerPage);
    }
  };

  const previousMentors = () => {
    if (currentIndex + mentorsPerPage >= filterInterestMentors.length) {
      setCurrentIndex(0);
    } else {
      if (currentIndex === 0) {
        return;
      } else {
        setCurrentIndex(currentIndex - mentorsPerPage);
      }
    }
  };

  return (
    <>
      <div className='container'>
        {availableMentors.length > 0 ? (
          <>
            <div>
              <h1>Mentors</h1>
              <div>
                {filterInterestMentors.length > 0 ? 
                <>
                <h3>Mentors that match your interests</h3>

                <Stack
                  direction='column'
                  justifyContent='space-around'
                  alignItems='center'
                  spacing={1}
                  sx={{ paddingBottom: '10px' }}
                >
                  {currentMentors.map((mentor) => (
                    <MentorItem key={mentor.id} mentor={mentor} />
                  ))}
                </Stack>
                <Stack
                  direction='row'
                  justifyContent='space-between'
                  sx={{ margin: '6px' }}
                >
                  <IconButton onClick={previousMentors}>
                    <ArrowBackIosNewIcon />
                  </IconButton>
                  <IconButton onClick={nextMentors}>
                    <ArrowForwardIosIcon />
                  </IconButton>
                </Stack>
                </>
                : 
                <></>
                }
              </div>
              <div>
                <h3>All Available Mentors</h3>
                <MentorAccordions />
              </div>
            </div>
          </>
        ) : (
          <>
            <h3>There currently are no available mentors.</h3>
          </>
        )}
      </div>
    </>
  );
}