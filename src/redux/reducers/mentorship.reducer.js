const mentorships = (state = [], action) => {
    switch (action.type) {
        case 'SET_MENTORSHIPS':
            return action.payload;
        case 'SET_ALL_MENTORSHIPS':
            return action.payload;
        default:
            return state;
    }
}

export default mentorships;