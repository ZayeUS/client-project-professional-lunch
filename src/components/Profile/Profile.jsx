import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Avatar, Stack, Typography } from '@mui/joy';
import Box from '@mui/material/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Tooltip from '@mui/joy/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import Chip from '@mui/joy/Chip';
import EditProfileDialog from './EditProfileDialog';

export default function Profile() {
  const dispatch = useDispatch();
  const profile = useSelector((store) => store.profileDetails);
  
  const [editProfileIsOpen, setEditProfileIsOpen] = useState(false);
  const closeEditProfile = () => setEditProfileIsOpen(false);

  useEffect(() => {
    dispatch({ type: 'FETCH_PROFILE_DETAILS' });
    dispatch({ type: 'FETCH_SCHOOLS' });
    dispatch({ type: 'FETCH_GENDERS' });
    dispatch({ type: 'FETCH_INTERESTS' });
    dispatch({ type: 'FETCH_DAYS' });
    dispatch({ type: 'FETCH_TIMES' });
    window.scrollTo(0, 0);
  }, []);

  // Check if profile is still loading
  if (!profile.profile) {
    return <h2>Loading...</h2>; // Display loading state while fetching profile
  }

  // Hardcoded Calendly URL
  const calendlyUrl = "https://calendly.com/ujj-code/30-min-meeting-w-ujjwal";

  return (
    <div className='container'>
      <Box sx={{ maxHeight: '90vh' }}>
        <Stack direction='column' spacing={1.5} alignItems='center'>
          <Card sx={{ width: '82vw', maxWidth: '100%', boxShadow: 'lg' }}>
            <Stack direction='row' justifyContent='flex-end'>
              <Tooltip title='Edit Profile' variant='soft'>
                <EditIcon
                  sx={{ fontSize: '40px', cursor: 'pointer' }}
                  onClick={() => setEditProfileIsOpen(true)}
                />
              </Tooltip>
            </Stack>
            <CardContent sx={{ alignItems: 'center', textAlign: 'center' }}>
              <Avatar
                src={profile?.profile?.avatar}
                sx={{ '--Avatar-size': '10rem', marginBottom: '3px' }}
              />
              <Typography sx={{ fontSize: '2rem', fontWeight: 'bold' }} level='h2'>
                {profile?.profile?.first_name} {profile?.profile?.last_name}
              </Typography>
              <Stack direction='row' alignItems='center' spacing={1}>
                {/* LinkedIn button, if available */}
                {profile?.profile?.linkedin && (
                  <Button
                    component='a'
                    href={profile?.profile?.linkedin}
                    variant='plain'
                    color='neutral'
                  >
                    <LinkedInIcon sx={{ fontSize: '2.5rem' }} />
                  </Button>
                )}
                {/* Calendly button */}
                <Button
                  component='a'
                  href={calendlyUrl}
                  variant='plain'
                  color='neutral'
                >
                  <Typography sx={{ fontSize: '1.5rem' }}>Calendly</Typography>
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* About Me Card */}
          <Card sx={{ width: '82vw', maxWidth: '100%', boxShadow: 'lg' }}>
            <Stack direction='column'>
              <Typography level='h3'>About Me</Typography>
              <Typography sx={{ fontSize: '1.3rem' }}>
                {profile?.profile?.bio}
              </Typography>
            </Stack>
          </Card>

          {/* Interests Card */}
          <Card sx={{ width: '82vw', maxWidth: '100%', boxShadow: 'lg' }}>
            <Stack direction='column'>
              <Typography level='h3'>Interests</Typography>
              <Stack direction='row' spacing={1} flexWrap='wrap' useFlexGap>
                {profile?.details?.interests?.map((interest) => (
                  <Chip sx={{ fontSize: '1.3rem', marginTop: '10px' }}>
                    {interest.interest}
                  </Chip>
                ))}
              </Stack>
            </Stack>
          </Card>

          {/* Availability Card */}
          <Card sx={{ width: '82vw', maxWidth: '100%', boxShadow: 'lg' }}>
            <Stack direction='column'>
              <Typography level='h3'>Availability</Typography>
              <Stack direction='row' spacing={1} flexWrap='wrap' useFlexGap>
                {profile?.details?.availability?.map((avail) => (
                  <Chip sx={{ fontSize: '1.3rem', marginTop: '10px' }}>
                    {avail.day} @ {avail.time}
                  </Chip>
                ))}
              </Stack>
            </Stack>
          </Card>
        </Stack>
      </Box>

      {/* Edit Profile Dialog */}
      <EditProfileDialog
        open={editProfileIsOpen}
        closeEditProfile={closeEditProfile}
        profile={profile}
      />
    </div>
  );
}
