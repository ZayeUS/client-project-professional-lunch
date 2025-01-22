import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { Avatar, Stack, Typography } from '@mui/joy';
import Button from '@mui/joy/Button';
import Badge from '@mui/joy/Badge';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/joy/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { TextField, Autocomplete, Checkbox, FormControlLabel } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import Tooltip from '@mui/joy/Tooltip';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { useScript } from '../../hooks/useScript';
import axios from 'axios';

export default function EditProfileDialog({ open, closeEditProfile, profile }) {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const schools = useSelector((store) => store.schoolsReducer);
  const genders = useSelector((store) => store.gendersReducer);
  const interestsStore = useSelector((store) => store.interestsReducer);
  const profileAvailability = useSelector(
    (store) => store.profileDetails.details.availability
  );
  const days = useSelector((store) => store.dayReducer);
  const times = useSelector((store) => store.timeReducer);

  const [interests, setInterests] = useState(profile?.details?.interests);
  const [availability, setAvailability] = useState(
    profile?.details?.availability
  );
  const [editProfile, setEditProfile] = useState({
    profile: {},
    details: { availability: profileAvailability },
  });
  const [isDeactivated, setIsDeactivated] = useState(profile?.profile?.isActive === false);  // Set initial value based on isActive status

  useEffect(() => {
    setEditProfile(profile);
  }, [profile]);

  useEffect(() => {
    dispatch({ type: 'FETCH_PROFILE_DETAILS' });
    dispatch({ type: 'FETCH_SCHOOLS' });
    dispatch({ type: 'FETCH_GENDERS' });
    dispatch({ type: 'FETCH_INTERESTS' });
    dispatch({ type: 'FETCH_DAYS' });
    dispatch({ type: 'FETCH_TIMES' });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Include the 'isActive' status in the profile update payload
    const updatedProfile = {
      ...editProfile,
      isActive: !isDeactivated,  // Set the isActive value based on the checkbox state
    };

    // Dispatch the action to update the profile, including the 'isActive' status
    dispatch({ type: 'EDIT_PROFILE', payload: updatedProfile });

    // Close the edit profile dialog
    closeEditProfile();
  };

  const handleAdd = (event) => {
    event.preventDefault();
    setAvailability([...availability, { day: '', time: '' }]);
  };

  const handleRemove = (index) => {
    const updatedAvailability = availability.filter((_, i) => i !== index);
    setAvailability(updatedAvailability);
    setEditProfile({
      ...editProfile,
      details: {
        ...editProfile.details,
        availability: updatedAvailability,
      },
    });
  };

  const handleInterestsChange = (event, newValue) => {
    if (newValue.length <= 5) {
      setInterests(newValue);
      setEditProfile({
        ...editProfile,
        details: {
          ...editProfile.details,
          interests: newValue,
        },
      });
    }
  };

  const handleDayChange = (index, newValueId, newValueObj) => {
    let copyAvail = [...availability];
    let updateCopyList = copyAvail.map((k) => {
      if (k.availability_id === newValueObj?.availability_id) {
        let copyK = { ...k };
        copyK.day_id = Number(newValueId);
        return copyK;
      } else {
        return k;
      }
    });
    setAvailability(updateCopyList);
    setEditProfile({
      ...editProfile,
      details: {
        ...editProfile.details,
        availability: updateCopyList,
      },
    });
  };

  const handleTimeChange = (index, newValueId, newValueObj) => {
    let copyAvail = [...availability];
    let updateCopyList = copyAvail.map((k) => {
      if (k.availability_id === newValueObj?.availability_id) {
        let copyK = { ...k };
        copyK.time_id = Number(newValueId);
        return copyK;
      } else {
        return k;
      }
    });
    setAvailability(updateCopyList);
    setEditProfile({
      ...editProfile,
      details: {
        ...editProfile.details,
        availability: updateCopyList,
      },
    });
  };

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
              setEditProfile({
                ...editProfile,
                profile: {
                  ...editProfile.profile,
                  avatar: result.info.secure_url,
                },
              });
            }
          }
        )
        .open();
  };

  const handleDeactivateChange = async (event) => {
    const checked = event.target.checked;
    setIsDeactivated(checked); // Update the local state based on the checkbox

    const userId = user.id;
    const payload = { userId };

    if (checked) {
      try {
        await axios.post('http://localhost:5001/api/user/deactivate', payload); // Send user id for deactivation
        
      } catch (error) {
        console.error('Error deactivating account:', error);
       
      }
    } else {
      try {
        await axios.post('http://localhost:5001/api/user/activate', payload); // Send user id for activation
       
      } catch (error) {
        console.error('Error activating account:', error);
      
      }
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={closeEditProfile}
        PaperProps={{ component: 'form', onSubmit: handleSubmit }}
      >
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Stack
            direction="column"
            justifyContent="space-evenly"
            alignItems="center"
            spacing={3}
          >
            <Badge
              onClick={openWidget}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="outlined"
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
              badgeInset="14%"
              sx={{ '--Badge-paddingX': '0px' }}
            >
              <Avatar
                variant="outlined"
                sx={{ width: 125, height: 125 }}
                src={editProfile?.profile.avatar}
              />
            </Badge>
            {useScript('https://widget.cloudinary.com/v2.0/global/all.js')}
          </Stack>
          <InputLabel>About Me</InputLabel>
          <TextField
            sx={{ mb: 1 }}
            placeholder="Bio"
            type="text"
            id="bio"
            fullWidth
            multiline
            minRows={2}
            size="small"
            margin="dense"
            value={editProfile?.profile?.bio}
            className="form-control"
            onChange={(event) =>
              setEditProfile({
                ...editProfile,
                profile: { ...editProfile.profile, bio: event.target.value },
              })
            }
          />
          <InputLabel>Email</InputLabel>
          <TextField
            sx={{ mb: 1 }}
            placeholder="Email"
            type="text"
            id="email"
            name="email"
            fullWidth
            className="form-control"
            size="small"
            margin="dense"
            value={editProfile?.profile?.email}
            onChange={(event) =>
              setEditProfile({
                ...editProfile,
                profile: {
                  ...editProfile.profile,
                  email: event.target.value,
                },
              })
            }
          />
          <InputLabel>LinkedIn</InputLabel>
          <TextField
            sx={{ mb: 1 }}
            placeholder="LinkedIn"
            className="form-control"
            type="text"
            id="linkedin"
            fullWidth
            size="small"
            margin="dense"
            value={editProfile?.profile?.linkedin}
            onChange={(e) =>
              setEditProfile({
                ...editProfile,
                profile: {
                  ...editProfile.profile,
                  linkedin: e.target.value,
                },
              })
            }
          />
          <InputLabel>Gender</InputLabel>
          <Select
            sx={{ mb: 1 }}
            fullWidth
            size="small"
            margin="dense"
            value={editProfile?.profile.gender}
            onChange={(event) =>
              setEditProfile({
                ...editProfile,
                profile: {
                  ...editProfile.profile,
                  gender: Number(event.target.value),
                },
              })
            }
          >
            {genders.map((gender) => (
              <MenuItem key={gender.id} value={gender.id}>
                {gender.gender}
              </MenuItem>
            ))}
          </Select>
          {user.isMentor ? (
            <></>
          ) : (
            <>
              <InputLabel>School</InputLabel>
              <Select
                sx={{ mb: 1 }}
                size="small"
                margin="dense"
                value={editProfile?.profile.school}
                onChange={(event) =>
                  setEditProfile({
                    ...editProfile,
                    profile: {
                      ...editProfile.profile,
                      school: event.target.value,
                    },
                  })
                }
              >
                {schools.map((school) => (
                  <MenuItem key={school.id} value={school.id}>
                    {school.school}
                  </MenuItem>
                ))}
              </Select>
            </>
          )}
          <InputLabel sx={{ mb: 1 }}>Interests</InputLabel>
          <Autocomplete
            sx={{ mb: 1 }}
            multiple
            options={interestsStore}
            value={interests}
            getOptionLabel={(option) => option.interest}
            disableCloseOnSelect
            onChange={handleInterestsChange}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Add Up To 5 Interests"
                placeholder="Interests..."
              />
            )}
          />
          <div>
            <Stack sx={{ mb: 0.5 }} direction="row" spacing={2}>
              <InputLabel>Availability</InputLabel>
              <Stack>
                <Tooltip title="Add Availability" variant="soft">
                  <PlaylistAddIcon
                    sx={{ fontSize: '25px', cursor: 'pointer' }}
                    onClick={handleAdd}
                  />
                </Tooltip>
              </Stack>
            </Stack>
            {availability?.map((availabilityItem, index) => (
              <Stack
                key={index}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={1}
              >
                <Stack flexGrow={1} spacing={1} direction="row">
                  <Select
                    value={availabilityItem?.day_id}
                    onChange={(event) =>
                      handleDayChange(index, event.target.value, availabilityItem)
                    }
                    sx={{ flex: 1 }}
                  >
                    {days?.map((day) => (
                      <MenuItem key={day.id} value={day.id}>
                        {day.day}
                      </MenuItem>
                    ))}
                  </Select>
                  <Select
                    value={availabilityItem?.time_id}
                    onChange={(event) =>
                      handleTimeChange(index, event.target.value, availabilityItem)
                    }
                    sx={{ flex: 1 }}
                  >
                    {times?.map((time) => (
                      <MenuItem key={time.id} value={time.id}>
                        {time.time}
                      </MenuItem>
                    ))}
                  </Select>
                </Stack>
                <Stack>
                  <Tooltip title="Delete Availability" variant="soft">
                    <DeleteForeverIcon
                      sx={{ fontSize: '30px', cursor: 'pointer' }}
                      onClick={() => handleRemove(index)}
                    />
                  </Tooltip>
                </Stack>
              </Stack>
            ))}
          </div>

          {/* Deactivate Account Checkbox */}
          <FormControlLabel
            control={
              <Checkbox
                checked={isDeactivated}
                onChange={handleDeactivateChange}
                color="secondary"
              />
            }
            label="Deactivate Account"
          />
        </DialogContent>
        <DialogActions>
          <Button
            color="neutral"
            variant="outlined"
            type="button"
            onClick={() => closeEditProfile()}
          >
            Cancel
          </Button>
          <Button type="submit" color="primary" variant="outlined">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
