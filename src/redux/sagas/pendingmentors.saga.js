import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// Worker Saga to fetch all users and filter out pending mentors
function* fetchPendingMentors() {
  try {
    // Make the API call to fetch all users
    const response = yield axios.get('/api/pendingmentors'); // Fetch all users

    // Dispatch action to set the pending mentors in Redux state
    yield put({ type: 'SET_PENDING_MENTORS', payload: response.data });
  } catch (error) {
    console.log('Failed to fetch all users', error);
    // Optionally dispatch an error action
    yield put({ type: 'FETCH_PENDING_MENTORS_FAILED', error });
  }
}

// Worker Saga to approve a mentor
function* approveMentor(action) {
  try {
    const { mentorId } = action.payload; // Get mentorId from the action payload

    // Make the API call to approve the mentor (change mentor_status to 'approved')
    const response = yield axios.put(`/api/approve-mentor/${mentorId}`, { status: 'approved' });

    // Dispatch an action to update the Redux state with the approved mentor
    yield put({ type: 'APPROVE_MENTOR_SUCCESS', payload: response.data });

    // Optionally, you can also trigger a refresh to get the latest data
    yield put({ type: 'FETCH_PENDING_MENTORS' }); // Re-fetch the pending mentors
  } catch (error) {
    console.log('Approve mentor request failed', error);
    // Optionally dispatch an error action
    yield put({ type: 'APPROVE_MENTOR_FAILED', error });
  }
}

// Watcher Saga
function* watchFetchPendingMentors() {
  yield takeLatest('FETCH_PENDING_MENTORS', fetchPendingMentors); // Watch for 'FETCH_PENDING_MENTORS' action
}

function* watchApproveMentor() {
  yield takeLatest('APPROVE_MENTOR', approveMentor); // Watch for 'APPROVE_MENTOR' action
}

export default function* pendingMentorsSaga() {
  yield watchFetchPendingMentors();
  yield watchApproveMentor();
}
