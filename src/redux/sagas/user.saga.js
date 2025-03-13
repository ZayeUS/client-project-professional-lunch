import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// Worker Saga to fetch a single user (already present in your code)
function* fetchUser() {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };

    const response = yield axios.get('/api/user', config);

    yield put({ type: 'SET_USER', payload: response.data });
  } catch (error) {
    console.log('User get request failed', error);
  }
}





// Watcher Saga
function* userSaga() {
  yield takeLatest('FETCH_USER', fetchUser);

}

export default userSaga;
