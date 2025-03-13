import { all } from 'redux-saga/effects';
import loginSaga from './login.saga';
import registrationSaga from './registration.saga';
import userSaga from './user.saga';
import resourcesSaga from './resources.saga';
import profilesSaga from './profiles.saga';
import mentorshipSaga from './mentorship.saga';
import gendersSaga from './genders.saga';
import schoolsSaga from './schools.saga';
import interestsSaga from './interests.saga';
import menteeSearchSaga from './menteesearch.saga';
import meetingsSaga from './meetings.saga';
import profileCheckSaga from './profile.check.saga';
import adminProfilesSaga from './adminProfiles.saga';
import pendingMentorsSaga from './pendingmentors.saga';


// rootSaga is the primary saga.
// It bundles up all of the other sagas so our project can use them.
// This is imported in index.js as rootSaga

// some sagas trigger other sagas, as an example
// the registration triggers a login
// and login triggers setting the user
export default function* rootSaga() {
  yield all([
    loginSaga(), // login saga is now registered
    registrationSaga(),
    userSaga(),
    resourcesSaga(),
    profilesSaga(),
    mentorshipSaga(),
    gendersSaga(),
    schoolsSaga(),
    interestsSaga(),
    meetingsSaga(),
    profileCheckSaga(),
    adminProfilesSaga(),
    menteeSearchSaga(),
    pendingMentorsSaga()
    
  ]);
}
