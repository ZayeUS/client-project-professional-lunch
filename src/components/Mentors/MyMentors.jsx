import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Stack, Typography, Button } from '@mui/joy';
import MyMentorsItem from './MyMentorsItem';
import { useHistory } from 'react-router-dom';

export default function MyMentors() {
    const dispatch = useDispatch();
    const history = useHistory();
    const user = useSelector(store => store.user);
    console.log('User', user);
    const mentorships = useSelector(store => store.mentorships);
    console.log('Mentorships', mentorships);
    const pendingMentorships = mentorships.filter(ment => ment.status === 'pending');
    console.log('Pending mentorships', pendingMentorships);
    const acceptedMentorships = mentorships.filter(ment => ment.status === 'accepted');
    console.log('Accepted mentorships', acceptedMentorships);

    useEffect(() => {
        dispatch({ type: 'FETCH_PROFILES' });
        dispatch({ type: 'FETCH_MENTORSHIPS' });
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className='container'>
            <h1 align='center'>My Mentors</h1>
            {acceptedMentorships.length > 0 ?
            <>
            {acceptedMentorships.map((mentor) => (
                <MyMentorsItem key={mentor.id} mentor={mentor} />
            ))}
            </>
            :
            <>
            <h3 align='center'>You currently don't have any mentors. Find a mentor now!</h3>
                <Stack alignContent='center'>
                    <Button
                        color='neutral' 
                        sx={{ fontSize: '1rem' }}
                        onClick={() => history.push('/available-mentors')}
                    >
                        Available Mentors
                    </Button>
                </Stack>
            </>
            }
            {pendingMentorships.length > 0 ? 
            <>
            {pendingMentorships.map((mentor) => (
                <MyMentorsItem key={mentor.id} mentor={mentor} />
            ))}
            </>
            : <></>}
        </div>
    )
}
