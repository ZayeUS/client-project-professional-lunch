import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Stack, Typography } from '@mui/joy';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { IconButton } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import MentorItem from '../MentorItem';
import MaleMentors from './MaleMentors';
import FemaleMentors from './FemaleMentors';
import NonBinaryMentors from './NonBinaryMentors';
import NotSayMentors from './NotSayMentors';
import OtherMentors from './OtherMentors';

export default function MentorAccordions() {
  const dispatch = useDispatch();
  const profiles = useSelector((store) => store.profiles);
  const user = useSelector((store) => store.user);

  // Ensure profiles are loaded
  if (!profiles || profiles.length === 0) {
    return <Typography>Loading profiles...</Typography>;
  }

  // Filter mentors and available mentors
  const mentors = profiles.filter((profile) => profile.isMentor);
  const availableMentors = mentors.filter(
    (mentor) => !user.mentorships.includes(mentor.id)
  );

  // Pagination logic
  const mentorsPerPage = 3;
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentMentors = availableMentors.slice(
    currentIndex,
    currentIndex + mentorsPerPage
  );

  const nextMentors = () => {
    if (currentIndex + mentorsPerPage >= availableMentors.length) {
      setCurrentIndex(0); // Loop back to the first page
    } else {
      setCurrentIndex(currentIndex + mentorsPerPage);
    }
  };

  const previousMentors = () => {
    if (currentIndex === 0) {
      setCurrentIndex(availableMentors.length - mentorsPerPage); // Go to the last page
    } else {
      setCurrentIndex(currentIndex - mentorsPerPage);
    }
  };

  useEffect(() => {
    dispatch({ type: 'FETCH_PROFILES' });
  }, [dispatch]);

  const categories = [
    { label: 'All Mentors', component: <Stack>{currentMentors.map((mentor) => <MentorItem key={mentor.id} mentor={mentor} />)}</Stack> },
    { label: 'Male Mentors', component: <MaleMentors /> },
    { label: 'Female Mentors', component: <FemaleMentors /> }
  ];

  return (
    <>
      {categories.map((category, index) => (
        <Accordion key={index}>
          <AccordionSummary
            expandIcon={<ArrowDropDownIcon />}
            aria-controls={`panel${index}-content`}
            id={`panel${index}-header`}
          >
            <Typography>{category.label}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {category.component}
          </AccordionDetails>
        </Accordion>
      ))}

      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel0-content"
          id="panel0-header"
        >
          <Typography>All Mentors</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack>
            {currentMentors.map((mentor) => (
              <MentorItem key={mentor.id} mentor={mentor} />
            ))}
          </Stack>
        </AccordionDetails>
        <Stack direction="row" justifyContent="space-between" sx={{ margin: '6px' }}>
          <IconButton onClick={previousMentors} disabled={currentIndex === 0}>
            <ArrowBackIosNewIcon />
          </IconButton>
          <IconButton onClick={nextMentors}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Stack>
      </Accordion>
    </>
  );
}
