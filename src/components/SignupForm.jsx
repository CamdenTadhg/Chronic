import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {Button, Form, FormGroup, Label, Input, Col, FormFeedback} from 'reactstrap';
import ChronicAPI from '../api/chronicAPI';
import {fetchUserProfile} from '../redux/thunks/profileThunks';

function SignupForm({toggleSignupModal}) {
    const initialState = {
        email: '',
        password: '',
        confirmPassword: '',
        name: ''
    }
    const initialValidationState = {
        email: true,
        password: true,
        confirmPassword: true    }
    const initialErrorMessageState = {
        email: '',
        password: '',
        confirmPassword: '',
        form: ''
    }
    const [formData, setFormData] = useState(initialState);
    const [isValid, setIsValid] = useState(initialValidationState);
    const [errorMessage, setErrorMessage] = useState(initialErrorMessageState);
    const dispatch = useDispatch();

    const handleChange = (event) => {
        const {name, value} = event.target;
        handleValidation(event)
        setFormData(fData => ({
            ...fData,
            [name]: value
        }));
    };

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
        if (event.target.name === 'confirmPassword') {
            if (formData.password !== event.target.value){
                setIsValid({...isValid, confirmPassword: false});
                setErrorMessage({...errorMessage, confirmPassword: 'Passwords do not match'});
            }
            else {
                setIsValid({...isValid, confirmPassword: true});
                setErrorMessage({...errorMessage, confirmPassword: ''});
            }
        }
    }

    //registers the user in the API, fetches the new User Profile, clears out the current state to reset, closes the modal
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (errorMessage.email !== '' || errorMessage.password !== '' || errorMessage.confirmPassword !== '' || errorMessage.form !== ''){
                return null;
            }
            const {email, password, name} = formData;
            const registerData = {email, password, name};
            const user = await ChronicAPI.register(registerData);
            dispatch(fetchUserProfile(user.userId));
            setFormData(initialState);
            setIsValid(initialValidationState);
            setErrorMessage(initialErrorMessageState);
            toggleSignupModal();
        } catch (error){
            setErrorMessage({...errorMessage, form: error});
        }
    }

    return (
        <>
            <h1 className='modal-title'>Signup Form</h1>
            <Form className='signup-form modal-form' onSubmit={handleSubmit}>
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
                    <Label for='confirm-password' sm={5}></Label>
                    <Col sm={7}>
                        <Input id='confirm-password' name='confirmPassword' placeholder='confirm password' type='password' value={formData.confirmPassword} onChange={handleChange} onBlur={handleValidation} invalid={isValid.confirmPassword === false} required></Input>
                        <FormFeedback className='form-errors'>{errorMessage.confirmPassword}</FormFeedback>
                    </Col>
                    <Label for='name' sm={5}>Name</Label>
                    <Col sm={7}>
                        <Input id='name' name='name' placeholder='name' type='text' value={formData.name} onChange={handleChange} required></Input>
                    </Col>
                    {errorMessage.form ? 
                        <div className='form-errors'>{errorMessage.form}</div> 
                        : null}
                </FormGroup>
                <div className='modal-foot'>
                    <Button color='primary' className='modal-button submit-button'>Sign up</Button>
                </div>
            </Form>
        </>

    )
}

export default SignupForm