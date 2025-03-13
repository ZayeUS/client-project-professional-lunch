const initialState = {
  pendingMentors: [],  // Initialize pendingMentors as an empty array by default
  loading: false, // Track loading state
  error: null, // Store any errors
};

const pendingMentorsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_PENDING_MENTORS':
      return {
        ...state,
        loading: true,
        error: null, // Reset errors
      };

    case 'FETCH_PENDING_MENTORS_FAILED':
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    case 'SET_PENDING_MENTORS':
      return {
        ...state,
        loading: false,
        pendingMentors: Array.isArray(action.payload) ? action.payload : [],
      };

    case 'APPROVE_MENTOR_SUCCESS':
      return {
        ...state,
        pendingMentors: state.pendingMentors.filter(
          (mentor) => mentor.id !== action.payload.id
        ), // Remove approved mentor
      };

    case 'APPROVE_MENTOR_FAILED':
      return {
        ...state,
        error: action.error,
      };

    default:
      return state;
  }
};

export default pendingMentorsReducer;
