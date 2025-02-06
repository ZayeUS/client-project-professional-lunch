import { useDispatch } from 'react-redux';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/joy/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

export default function AddResourceDialog({ open, closeAddResource }) {
  const dispatch = useDispatch();

  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceImage, setResourceImage] = useState('');
  const [resourceUrl, setResourceUrl] = useState('');
  const [resourceAbout, setResourceAbout] = useState('');
  const [resourceCategory, setResourceCategory] = useState('');
  const [resourceNotes, setResourceNotes] = useState('');
  const [categoryError, setCategoryError] = useState(false); // For category error handling

  const addResource = (event) => {
    event.preventDefault();

    // Check if category is selected properly
    if (resourceCategory === '' || resourceCategory === 'Categories') {
      setCategoryError(true); // Set error if category is not selected properly
      return; // Prevent form submission if category is invalid
    }

    // Dispatch the resource data if category is valid
    dispatch({
      type: 'ADD_RESOURCE',
      payload: {
        title: resourceTitle,
        image: resourceImage,
        url: resourceUrl,
        about: resourceAbout,
        category: resourceCategory,
        notes: resourceNotes,
      },
    });

    // Reset form fields after submission
    setResourceTitle('');
    setResourceImage('');
    setResourceUrl('');
    setResourceAbout('');
    setResourceCategory('');
    setResourceNotes('');
    setCategoryError(false); // Reset category error after form submission
    closeAddResource();
  };

  return (
    <Dialog
      open={open}
      onClose={closeAddResource}
      PaperProps={{
        sx: {
          borderRadius: '12px', // Rounded corners for the dialog
          boxShadow: 3, // Add a subtle shadow
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600, textAlign: 'center', paddingBottom: '20px' }}>Add Resource</DialogTitle>
      <DialogContent sx={{ paddingBottom: '24px' }}>
        <Box component="form" onSubmit={addResource}>
          <TextField
            sx={{ mb: 2 }}
            id="title"
            name="title"
            label="Title"
            fullWidth
            variant="outlined"
            value={resourceTitle}
            onChange={(event) => setResourceTitle(event.target.value)}
            required
          />
          <TextField
            sx={{ mb: 2 }}
            id="image"
            name="image"
            label="Image URL"
            fullWidth
            variant="outlined"
            value={resourceImage}
            onChange={(event) => setResourceImage(event.target.value)}
            required
          />
          <TextField
            sx={{ mb: 2 }}
            id="url"
            name="url"
            label="Resource URL"
            fullWidth
            variant="outlined"
            value={resourceUrl}
            onChange={(event) => setResourceUrl(event.target.value)}
            required
            multiline
            minRows={2}
          />
          <TextField
            sx={{ mb: 2 }}
            id="about"
            name="about"
            label="About"
            fullWidth
            variant="outlined"
            value={resourceAbout}
            onChange={(event) => setResourceAbout(event.target.value)}
            multiline
            minRows={2}
          />

          {/* Category Dropdown with Initial Label */}
          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }} error={categoryError}>
            <InputLabel id="category-label">Categories</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              name="category"
              label="Categories"
              value={resourceCategory}
              onChange={(event) => {
                setResourceCategory(event.target.value);
                setCategoryError(false); // Reset category error when the user selects an option
              }}
              required
            >
              <MenuItem value="">
                <em>Categories</em> {/* Placeholder */}
              </MenuItem>
              <MenuItem value="For Mentors">For Mentors</MenuItem>
              <MenuItem value="For Mentees">For Mentees</MenuItem>
              <MenuItem value="Jobs">Jobs</MenuItem>
            </Select>
          </FormControl>

          <TextField
            sx={{ mb: 2 }}
            id="notes"
            name="notes"
            label="Notes"
            fullWidth
            variant="outlined"
            value={resourceNotes}
            onChange={(event) => setResourceNotes(event.target.value)}
            multiline
            minRows={2}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ padding: '16px' }}>
        <Button
          variant="outlined"
          color="neutral"
          onClick={() => closeAddResource()}
          sx={{
            '&:hover': { backgroundColor: '#f2f2f2' },
            fontWeight: 600,
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{
            '&:hover': { backgroundColor: '#4caf50' },
            fontWeight: 600,
            backgroundColor: '#388e3c',
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
