import React, {useState, useEffect, useRef} from 'react';
import {Row, Container, Button, Form, FormGroup, Label, Modal, FormText, Input, FormFeedback} from 'reactstrap';
import {useDispatch, useSelector} from 'react-redux';
import {selectProfile} from '../redux/selectors/selectors';
import {editUserProfile, disconnectFromDiagnosis} from '../redux/thunks/profileThunks'
import moment from 'moment';
import PasswordForm from './PasswordForm';
import DiagnosisForm from './DiagnosisForm';
import KeywordsForm from './KeywordsForm';

function Profile() {
    const dispatch = useDispatch();
    const profile = useSelector(selectProfile);
    const initialState = {
        userId: profile.userId,
        email: profile.email,
        name: profile.name,
    };
    const [emailValid, setEmailValid] = useState(true);
    const initialErrorMessageState = {
        email: '',
        form: ''
    };
    const [formData, setFormData] = useState(initialState);
    const [errorMessage, setErrorMessage] = useState(initialErrorMessageState);
    const [passwordOpen, setPasswordOpen] = useState(false);
    const [diagnosisOpen, setDiagnosisOpen]  = useState(false);
    const [keywordsOpen, setKeywordsOpen] = useState(false);
    const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);

    const togglePasswordModal = () => setPasswordOpen(!passwordOpen);
    const toggleDiagnosisModal = () => {
        setDiagnosisOpen(!diagnosisOpen);
    } 
    const toggleKeywordsModal = (diagnosisId = null) => {
        setSelectedDiagnosis(diagnosisId);
        setKeywordsOpen(!keywordsOpen);
    }
    const handleChange = (event) => {
        const {name, value} = event.target;
        handleValidation(event);
        setFormData(fData => ({
            ...fData,
            [name]: value
        }));
    };

    const handleValidation = (event) => {
        if (event.target.name === 'email'){
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(event.target.value)){
                setEmailValid(false);
                setErrorMessage({...errorMessage, email: 'Please enter a valid email address.'});
            } else {
                setEmailValid(true);
                setErrorMessage({...errorMessage, email: ''});
            }
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (errorMessage.email !== ''){
                return;
            }
            const {email, name, userId} = formData;
            let editData;
            if (email === profile.email) {
                editData = {name}
            } else {
                editData = {email, name}
            }
            dispatch(editUserProfile(userId, editData));
        } catch (error) {
            setErrorMessage({...errorMessage, form: error.message})
        }
    }

    const disconnectDiagnosis = async (event) => {
        const diagnosisId = Number(event.currentTarget.id);
        const dataForStore = {diagnosisId: diagnosisId};
        dispatch(disconnectFromDiagnosis(profile.userId, diagnosisId, dataForStore));
    }

    const hasMounted = useRef(false);

    //handles changes to state as a result of dispatch(editUserProfile) or dispatch(disconnectFromDiagnosis)
    useEffect(() => {
        if (hasMounted.current) {
            if(profile.loading === false && profile.error === null){
                setErrorMessage({email: '', form: ''});
                setEmailValid(true);
            } else if (profile.loading === false && profile.error !== null){
                setErrorMessage({...errorMessage, form: profile.error});
            }
        } else {
            hasMounted.current = true
        }
    }, [profile.loading, profile.error])



    return (
        <Container fluid className='p-0 white-page'>
            <Row className='navbar-space m-0 p-0'>
            </Row>
            <Row className='m-0 p-0'>
                <h2 className='page-title'>PROFILE</h2>
                <Form onSubmit={handleSubmit} className='text-content' id='profile-form'>
                    {errorMessage.form ? 
                        <div className='form-errors'>{errorMessage.form}</div>: null}
                    <Button color='secondary' className='body-button submit-button profile-button' type="submit">Save Profile</Button>
                    <FormGroup className="flex-form-group">
                        <Label for='email' className="flex-label">Email</Label>
                        <Input id='email' name='email' type='email' value={formData.email} onChange={handleChange} onBlur={handleValidation} invalid={emailValid === false} required className="flex-input"></Input>
                        <FormFeedback className='form-errors'>{errorMessage.email}</FormFeedback>
                    </FormGroup>
                    <FormGroup className="flex-form-group">
                        <Label for='password' className="flex-label">Password</Label>
                        <Button color='secondary' className='body-button' onClick={togglePasswordModal}>Change Password</Button>
                    </FormGroup>
                    <FormGroup className="flex-form-group">
                        <Label for="name" className="flex-label">Name</Label>
                        <Input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required className="flex-input"></Input>
                    </FormGroup>
                    <FormGroup className="flex-form-group">
                        <Label for="since" className="flex-label">User Since</Label>
                        <FormText id="since" className="flex-text">{moment(profile.since).format('MM-DD-YYYY')}</FormText>
                    </FormGroup>
                    <FormGroup className="flex-form-group">
                        <Label for="lastLogin" className="flex-label">Last Log In</Label>
                        <div id="lastLogin" className="flex-text">{moment(profile.lastLogin).format('MM-DD-YYYY h:mm a')}</div>
                    </FormGroup>
                    <FormGroup className="flex-form-group">
                        <Label for="diagnoses" className="flex-label">Diagnoses</Label>
                        <Button color="secondary" className="body-button" onClick={toggleDiagnosisModal}>Add a Diagnosis</Button>
                    </FormGroup>
                        {profile.diagnoses.map((diagnosis) => {
                            return (
                                <FormGroup className='flex-form-group diagnosis-item' key={diagnosis.diagnosis}>
                                    <div className='delete-button' data-testid="delete-button" onClick={disconnectDiagnosis} id={diagnosis.diagnosisId}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9B2915" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1="18" y1="2" x2="2" y2="18"></line><line x1="2" y1="2" x2="18" y2="18"></line></svg></div>
                                    <Label className="flex-label-diagnosis">{diagnosis.diagnosis}</Label>
                                    <Button color="secondary" className="body-button" id={diagnosis.diagnosisId} onClick={() => toggleKeywordsModal(diagnosis.diagnosisId)}>Keywords</Button>
                                </FormGroup>
                            )
                        })}
                </Form>
                <Modal isOpen={passwordOpen} toggle={togglePasswordModal} size='lg' centered={true}>
                    <PasswordForm togglePasswordModal={togglePasswordModal}/>
                </Modal>
                <Modal isOpen={diagnosisOpen} toggle={toggleDiagnosisModal} size='lg' centered={true}>
                    <DiagnosisForm toggleDiagnosisModal={toggleDiagnosisModal}/>
                </Modal>
                <Modal isOpen={keywordsOpen} toggle={toggleKeywordsModal} size='lg' centered={true}>
                    <KeywordsForm toggleKeywordsModal={toggleKeywordsModal} diagnosisId={selectedDiagnosis}/>
                </Modal>
            </Row>
        </Container>
    )
}

export default Profile;