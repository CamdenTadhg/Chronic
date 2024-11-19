import React, {useState, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {selectProfile} from '../redux/selectors/selectors';
import {Button, Form, FormGroup, Label, Input, FormFeedback, Col} from 'reactstrap';
import {editUserProfile} from '../redux/thunks/profileThunks';

function PasswordForm({togglePasswordModal}) {
    const profile = useSelector(selectProfile);
    const initialState = {
        password: '',
        confirmPassword: ''
    };
    const initialValidationState = {
        password: true,
        confirmPassword: true
    };
    const initialErrorMessageState = {
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
        handleValidation(event);
        setFormData(fData => ({
            ...fData,
            [name]: value
        }));
    };

    //validates that password is sufficiently secure and matches confirm password
    const handleValidation = (event) => {
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
    };

    //changes the password on the back end using the API. 
    const handleSubmit = (event) => {
        event.preventDefault();
        try {
            if (errorMessage.password !== '' || errorMessage.confirmPassword !== '' || errorMessage.form !== ''){
                return null;
            }
            const {password} = formData;
            const editData = {password};
            dispatch(editUserProfile(profile.userId, editData));
        } catch (error) {
            setErrorMessage({...errorMessage, form: error});
        }
    };

    //handles changes to profile store as a result of dispatch(editUserProfile)
    const hasMounted = useRef(false);

    useEffect(() => {
        if (hasMounted.current){
            if(profile.loading === false && profile.error === null){
                setIsValid(initialValidationState);
                setErrorMessage(initialErrorMessageState);
                setFormData(initialState);
                togglePasswordModal();
            } else if (profile.loading === false && profile.error !== null){
                setErrorMessage({...errorMessage, form: profile.error});
            }
        } else {
            hasMounted.current = true;
        }
    }, [profile.loading, profile.error])

    return (
        <>
            <h1 className='modal-title'>Change Password</h1>
            <Form className='modal-form' onSubmit={handleSubmit}>
                <FormGroup row>
                    <Label for='password' sm={5}>Password</Label>
                    <Col sm={7}>
                        <Input id='password' name='password' placeholder='password' type='password' value={formData.password} onChange={handleChange} onBlur={handleValidation} invalid={isValid.password === false} required></Input>
                        <FormFeedback className='form-errors'>{errorMessage.password}</FormFeedback>
                    </Col>
                    <Label for='confirm-password' sm={5}></Label>
                    <Col sm={7}>
                        <Input id='confirm-password' name='confirmPassword' placeholder='confirm password' type='password' value={formData.confirmPassword} onChange={handleChange} onBlur={handleValidation} invalid={isValid.confirmPassword === false} required></Input>
                        <FormFeedback className='form-errors'>{errorMessage.confirmPassword}</FormFeedback>
                    </Col>
                    {errorMessage.form ? 
                        <div className='form-errors'>{errorMessage.form}</div>: null}
                </FormGroup>
                <div className='modal-foot'>
                    <Button color='primary' className='modal-button submit-button'>Update</Button>
                </div>
            </Form>
        </>
    )
}

export default PasswordForm;