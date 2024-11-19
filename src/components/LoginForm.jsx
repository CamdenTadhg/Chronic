import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {Button, Form, FormGroup, Label, Input, Col, FormFeedback} from 'reactstrap';
import ChronicAPI from '../api/chronicAPI';
import {useSelector} from 'react-redux';
import {fetchUserProfile} from '../redux/thunks/profileThunks';
import {fetchDaysTracking} from '../redux/thunks/trackingThunks';
import {fetchLatest} from '../redux/thunks/latestThunks';

function LoginForm({toggleLoginModal}) {
    const initialState = {
        email: '',
        password: '',
    }
    const initialValidationState = {
        email: true,
        password: true}
    const initialErrorMessageState = {
        email: '',
        password: '',
        form: ''
    }
    const [formData, setFormData] = useState(initialState);
    const [isValid, setIsValid] = useState(initialValidationState);
    const [errorMessage, setErrorMessage] = useState(initialErrorMessageState);
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const dispatch = useDispatch();

    const handleChange = (event) => {
        const {name, value} = event.target;
        handleValidation(event);
        setFormData(fData => ({
            ...fData,
            [name]: value
        }));
    };

    //forces a reflow to fix delayed style application

    const handleValidation = (event) => {
        if (event.target.name === 'email'){
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(event.target.value)){
                setIsValid({...isValid, email: false});
                setErrorMessage({...errorMessage, email: 'Please enter a valid email address.'});
            } else {
                setIsValid({...isValid, email: true});
                setErrorMessage({...errorMessage, email: ''});
            }
        }
        if (event.target.name === 'password'){
            if (!/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}\[\]|:"'<>,.?~]).{8,}$/.test(event.target.value)) {
                setIsValid({...isValid, password: false});
                setErrorMessage({...errorMessage, password: 'Passwords must be 8 characters and contain at least one letter, one number, and one special character'});
            } else {
                setIsValid({...isValid, password: true});
                setErrorMessage({...errorMessage, password: ''});
            }
        }
    }

    const getDates = () => {
        let date = new Date();
        let today = `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`;
        let yesterdayDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
        yesterdayDate.setUTCDate(yesterdayDate.getUTCDate()- 1);
        let yesterday = `${yesterdayDate.getUTCFullYear()}-${yesterdayDate.getUTCMonth()}-${yesterdayDate.getUTCDate()}`;
        return {today, yesterday}
    }



    //logs the user in, fills the store with the user's tracking and profile data, clears the fields and closes the modal
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (errorMessage.email !== '' || errorMessage.password !== '' || errorMessage.form !== ''){
                return null;
            }
            const {email, password} = formData;
            const signinData = {email, password};
            const user = await ChronicAPI.signin(signinData);
            dispatch(fetchUserProfile(user.userId));
            const {today, yesterday} = getDates();
            dispatch(fetchDaysTracking(user.userId, today, 'primaryTracking'));
            dispatch(fetchDaysTracking(user.userId, yesterday, 'secondaryTracking'));
            setFormData(initialState);
            setIsValid(initialValidationState);
            setErrorMessage(initialErrorMessageState);
            toggleLoginModal();
            setUserLoggedIn(true);
        } catch (error){
            setErrorMessage({...errorMessage, form: error});
        }
    }

    return (
        <>
            <h1 className='modal-title'>Login Form</h1>
            <Form className='login-form modal-form' onSubmit={handleSubmit}>
                <FormGroup row>
                    <Label for='email' sm={5}>Email</Label>
                    <Col sm={7}>
                        <Input id='email' name='email' placeholder='email' type='email' value={formData.email} onChange={handleChange} onBlur={handleValidation} invalid={isValid.email === false} required></Input>
                        <FormFeedback className='form-errors'>{errorMessage.email}</FormFeedback>
                    </Col>
                    <Label for='password' sm={5}>Password</Label>
                    <Col sm={7}>
                        <Input id='password' name='password' placeholder='password' type='password' value={formData.password} onChange={handleChange}onBlur={handleValidation} invalid={isValid.password === false} required></Input>
                        <FormFeedback className='form-errors'>{errorMessage.password}</FormFeedback>
                    </Col>
                    {errorMessage.form ? 
                        <div className='form-errors'>{errorMessage.form}</div> 
                        : null}
                </FormGroup>
                <div className='modal-foot'>
                    <Button color='primary' className='modal-button submit-button'>Log in</Button>
                </div>
            </Form>
        </>

    )
}

export default LoginForm