import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Grid from '@mui/joy/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/joy/Button';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/joy/Tooltip';
import ResourceCards from '../ResourceCards/ResourceCards';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import AddResourceDialog from '../AddResourceDialog/AddResourceDialog';
import { Container, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

export default function Resources() {
  const dispatch = useDispatch();
  const history = useHistory();
  const resources = useSelector((store) => store.resources);
  const user = useSelector((store) => store.user);

  const [addResourceIsOpen, setAddResourceIsOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState(''); // State for selected category filter

  const closeAddResource = () => setAddResourceIsOpen(false);

  useEffect(() => {
    dispatch({ type: 'FETCH_RESOURCES' });
    window.scrollTo(0, 0);
  }, [dispatch]);

  // Filtered resources based on selected category
  const filteredResources = resources.filter((resource) => {
    return categoryFilter ? resource.category === categoryFilter : true; // If categoryFilter is set, filter by category
  });

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Header Section */}
        <Stack sx={{ mb: 2 }} direction="row" alignItems="center" spacing={2} flexWrap="wrap">
          <Typography sx={{ fontSize: '2rem', fontWeight: 'bold' }} level="h2">
            Resources
          </Typography>
          {user.isAdmin && (
            <Tooltip title="Add Resource" variant="soft">
              <LibraryAddIcon
                sx={{ fontSize: '40px', cursor: 'pointer', mt: 1 }}
                onClick={() => setAddResourceIsOpen(true)}
              />
            </Tooltip>
          )}
        </Stack>

        {/* Add Resource Dialog */}
        <AddResourceDialog open={addResourceIsOpen} closeAddResource={closeAddResource} />

        {/* Category Filter Dropdown */}
        <Stack sx={{ mb: 3 }} direction="row" alignItems="center" spacing={2} flexWrap="wrap">
          <FormControl fullWidth>
            <InputLabel id="category-label">Filter by Category</InputLabel>
            <Select
              labelId="category-label"
              id="category-filter"
              value={categoryFilter}
              label="Filter by Category"
              onChange={(event) => setCategoryFilter(event.target.value)}
              sx={{ minWidth: '200px' }}
            >
              <MenuItem value="">
                <em>All Categories</em>
              </MenuItem>
              <MenuItem value="For Mentors">For Mentors</MenuItem>
              <MenuItem value="For Mentees">For Mentees</MenuItem>
              <MenuItem value="Jobs">Jobs</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        {/* Display filtered resources in a unified grid */}
        <Grid container spacing={3}>
          {filteredResources.map((resource) => (
            <Grid item xs={12} sm={6} md={4} key={resource.id}>
              <ResourceCards resource={resource} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}
