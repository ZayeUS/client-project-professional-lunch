import React, { useEffect, useState } from 'react';
import LogOutButton from '../LogOutButton/LogOutButton';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useDispatch } from 'react-redux';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import ButtonGroup from '@mui/joy/ButtonGroup';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';

function UserPage() {
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false); // State to control the modal
  const history = useHistory();
  const user = useSelector((store) => store.user);

  useEffect(() => {
    window.scrollTo(0, 0);
    const hasReloaded = localStorage.getItem('hasReloaded');

    if (!hasReloaded) {
      localStorage.setItem('hasReloaded', 'true');
      location.reload();
    } else {
      dispatch({ type: 'CHECK_FOR_PROFILE' });
    }

    // Open modal if mentor status is pending
    if (user?.isMentor && user?.mentor_status === 'pending') {
      setOpenModal(true); // Show modal if status is pending
    }
  }, [user]); // Re-run when user data changes

  const createProfile = () => {
    console.log('button clicked');
    history.push('/registration/2');
  };

  return (
    <Stack
      className='container'
      sx={{ mb: 2 }}
      direction='column'
      alignItems='center'
      justifyContent='center'
      spacing={4}
    >
      <Card variant='outlined' sx={{ width: 320 }}>
        <CardOverflow>
          <AspectRatio ratio='2'>
            <img
              src='images/PLaunch.png'
              loading='lazy'
              alt='Professional Launch Logo'
            />
          </AspectRatio>
        </CardOverflow>
        <CardContent sx={{ alignItems: 'center', textAlign: 'center' }}>
          <Typography sx={{ fontSize: '26px' }} level='title-lg'>
            Welcome to Professional Launch!
          </Typography>
          <Typography level='title-md'>
            Positively connecting the less connected.
          </Typography>
          <Typography level='body-md'>
            Thank you for creating an account!
          </Typography>
          <Typography level='body-sm'>
            Please continue your Professional Launch journey by creating your
            profile.
          </Typography>
        </CardContent>
        <CardOverflow sx={{ bgcolor: 'background.level1' }}>
          <CardActions buttonFlex='1'>
            <ButtonGroup
              variant='outlined'
              sx={{ bgcolor: 'background.surface' }}
            >
              <Button
                variant='outlined'
                color='neutral'
                onClick={() => createProfile()}
              >
                Create Profile
              </Button>
              <LogOutButton className='btn' />
            </ButtonGroup>
          </CardActions>
        </CardOverflow>
      </Card>

      {/* Modal for waiting approval */}
      <Dialog open={openModal}>
        <DialogTitle>Approval Pending</DialogTitle>
        <DialogContent>
          <p>Your mentor account is under review. You'll be notified once approved.</p>
        </DialogContent>
      </Dialog>
    </Stack>
  );
}

export default UserPage;
