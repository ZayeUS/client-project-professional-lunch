import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useScript } from '../../hooks/useScript';
import { useEffect, useState } from 'react';
import { Avatar, Stack, Typography } from '@mui/joy';
import Box from '@mui/material/Box';
import Button from '@mui/joy/Button';
import ButtonGroup from '@mui/joy/ButtonGroup';
import Badge from '@mui/joy/Badge';
import Checkbox from '@mui/joy/Checkbox';
import Input from '@mui/joy/Input';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import FormHelperText from '@mui/joy/FormHelperText';
import Tooltip from '@mui/joy/Tooltip';

export default function RegisterForm4() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [availability, setAvailability] = useState([{ day: '', time: '' }]);
  const [avatar, setAvatar] = useState({ avatar: '' });
  const days = useSelector((store) => store.dayReducer);
  const times = useSelector((store) => store.timeReducer);
  const regInfo = useSelector(
    (store) => store.registrationReducer.registrationReducer
  );
  const user = useSelector((store) => store.user);

  useEffect(() => {
    dispatch({
      type: 'FETCH_DAYS',
    });
    dispatch({
      type: 'FETCH_TIMES',
    });
    window.scrollTo(0, 0);
  }, [dispatch]);

  const openWidget = () => {
    !!window.cloudinary &&
      window.cloudinary
        .createUploadWidget(
          {
            sources: ['local', 'url', 'camera'],
            cloudName: 'dz2bil44j',
            uploadPreset: 'hl5wdxak',
          },
          (error, result) => {
            if (!error && result && result.event === 'success') {
              setAvatar({ ...avatar, avatar: result.info.secure_url });
            }
          }
        )
        .open();
  };

  const handleDayChange = (index, event) => {
    console.log('Day Change event', event);
    console.log('Day Change index', index);
    console.log('target.value', event.target.value);
    const newAvailability = [...availability];
    newAvailability[index].day = event.target.value;
    setAvailability(newAvailability);
  };

  const handleTimeChange = (index, event) => {
    console.log('Time Change event', event);
    console.log('Time Change index', index);
    console.log('target.value', event.target.value);
    const newAvailability = [...availability];
    newAvailability[index].time = event.target.value;
    setAvailability(newAvailability);
  };

  const handleAdd = (event) => {
    event.preventDefault();
    setAvailability([...availability, { day: '', time: '' }]);
  };

  const registerUser = (event) => {
    event.preventDefault();
    if (availability.every((a) => a.day && a.time)) {
      dispatch({
        type: 'ADD_FOURTH_PAGE_INFO',
        payload: {
          availability: availability,
          avatar: avatar,
        },
      });
      history.push('/resources');
    } else {
      alert('Please select both a day and a time for all availabilities.');
    }

    dispatch({
      type: 'REGISTER_PROFILE',
      payload: {
        first_name: regInfo.firstName,
        last_name: regInfo.lastName,
        email: regInfo.email,
        gender: Number(regInfo.gender),
        school: user.isMentor ? 8 : Number(regInfo.school),
        avatar: avatar,
        bio: regInfo.bio,
        linkedin: regInfo.linkedin,
        availability: availability,
        interests: regInfo.interests,
      },
    });
  };

  return (
    <div className='container'>
      <h2>Create Profile (Page 3 of 3)</h2>
      <form className='formPanel'>
        <h4>Upload Avatar:</h4>
        <Stack
          direction='column'
          justifyContent='space-evenly'
          alignItems='center'
          spacing={3}
        >
          <Badge
            onClick={openWidget}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant='outlined'
            badgeContent={
              <CameraAltIcon
                sx={{
                  width: '35px',
                  height: '35px',
                  color: '#343A40',
                  cursor: 'pointer',
                }}
              />
            }
            badgeInset='14%'
            sx={{ '--Badge-paddingX': '0px' }}
          >
            <Avatar
              variant='outlined'
              sx={{ width: 150, height: 150 }}
              src={avatar}
            />
          </Badge>
          {useScript('https://widget.cloudinary.com/v2.0/global/all.js')}
        </Stack>
        <br />
        <Stack direction='row' alignItems='center' spacing={2}>
          <Stack>
            <h4>Select Availabilities</h4>
          </Stack>
          <Stack>
            <Tooltip title='Add More Availability' variant='soft'>
              <LibraryAddIcon
                sx={{ fontSize: '25px', cursor: 'pointer' }}
                onClick={handleAdd}
              />
            </Tooltip>
          </Stack>
        </Stack>
        {availability.map((avail, index) => (
          <form key={index}>
            <Box
              sx={{
                py: 2,
                display: 'grid',
                gap: 2,
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <FormControl size='small'>
                <InputLabel>Select a day</InputLabel>
                <Select
                  label='Select a day'
                  onChange={(e) => handleDayChange(index, e)}
                  slotProps={{ input: { id: 'day' } }}
                  value={avail.day}
                >
                  {days.map((day) => (
                    <MenuItem value={day.id} key={day.id}>
                      {day.day}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size='small'>
                <InputLabel>Select a time of day</InputLabel>
                <Select
                  label='Select a time of day'
                  onChange={(e) => handleTimeChange(index, e)}
                  slotProps={{ input: { id: 'time' } }}
                  value={avail.time}
                >
                  {times.map((time) => (
                    <MenuItem key={time.id} value={time.id}>
                      {time.time}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* <Button color='neutral' sx={{ mb: 1 }} onClick={handleAdd}>
                Add More Availability
              </Button> */}
            </Box>
          </form>
        ))}
        {user.isMentor && (
          <FormControl>
            <h4>Mentor Pledge</h4>
            <Checkbox
              label='I agree to the following mentor pledge:'
              required
            />
            <br />
            <Typography level='body-md'>As a mentor, I will:</Typography>
            <Typography>
              1. Be Civil and Respectful: I will treat all mentees, fellow
              mentors, and staff with kindness, respect, and courtesy at all
              times.
            </Typography>
            <Typography>
              2. Maintain Professionalism: I will conduct myself with integrity
              and professionalism in all interactions, both online and in
              person.
            </Typography>
            <Typography>
              3. Protect Privacy: I will respect the confidentiality and privacy
              of all mentees and will not share their personal information
              without consent.
            </Typography>
            <Typography>
              4. Provide Supportive Guidance: I will offer constructive and
              supportive feedback, aiming to empower and uplift my mentees.
            </Typography>
            <Typography>
              5. Promote a Safe Environment: I will foster a safe and inclusive
              environment for all participants, free from harassment,
              discrimination, and any form of abuse.
            </Typography>
            <br />
            <Typography>
              By adhering to these principles, I commit to upholding the values
              and mission of The Professional L(A)unch Mentoring Platform and
              ensuring a positive and enriching experience for all involved.
            </Typography>
            <br />
          </FormControl>
        )}
        {!user.isMentor && (
          <FormControl>
            <h4>Mentee Pledge</h4>
            <Checkbox
              label='I agree to the following mentee pledge:'
              required
            />
            <br />
            <Typography level='body-md'>As a mentee, I will:</Typography>
            <Typography>
              1. Be Civil and Respectful: I will treat all mentors, fellow
              mentees, and staff with kindness, respect, and courtesy at all
              times.
            </Typography>
            <Typography>
              2. Maintain Professionalism: I will conduct myself with integrity
              and professionalism in all interactions, both online and in
              person.
            </Typography>
            <Typography>
              3. Respect Privacy: I will respect the confidentiality and privacy
              of all mentors and fellow mentees, and will not share their
              personal information without consent.
            </Typography>
            <Typography>
              4. Engage Positively: I will actively participate in the mentoring
              relationship and be open to feedback and guidance from my mentor.
            </Typography>
            <Typography>
              5. Promote a Safe Environment: I will foster a safe and inclusive
              environment for all participants, free from harassment,
              discrimination, and any form of abuse.
            </Typography>
            <br />
            <Typography>
              By adhering to these principles, I commit to upholding the values
              and mission of The Professional L(A)unch Mentoring Platform and
              ensuring a positive and enriching experience for all involved.
            </Typography>
            <br />
          </FormControl>
        )}
        <ButtonGroup spacing='0.5rem' color='primary' variant='solid'>
          <Button
            color='neutral'
            onClick={() => history.push('/registration/3')}
          >
            Back
          </Button>
          <Button color='neutral' onClick={(event) => registerUser(event)}>
            Register
          </Button>
        </ButtonGroup>
      </form>
    </div>
  );
}
