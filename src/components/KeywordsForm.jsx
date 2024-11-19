import React, {useState, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Button, Form, FormGroup, Label, Input, Tooltip, Col} from 'reactstrap';
import {updateUserDiagnosis} from '../redux/thunks/profileThunks';
import {selectProfile} from '../redux/selectors/selectors';

function KeywordForm({toggleKeywordsModal, diagnosisId}) {
    const profile = useSelector(selectProfile);
    const dispatch = useDispatch();
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const [diagnosisIndex, setDiagnosisIndex] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const initialState = {
        diagnosisId: null,
        diagnosis: '',
        currentKeywords: '',
        newKeywords: ''
    }
    const [formData, setFormData] = useState(initialState);

    useEffect(() => {
        setDiagnosisIndex(profile.diagnoses.findIndex((diagnosis) => diagnosis.diagnosisId === diagnosisId))
    }, [profile.diagnoses, diagnosisId]);

    useEffect(() => {
        if (diagnosisIndex !== null && diagnosisIndex >= 0) {
            if (profile.diagnoses[diagnosisIndex].keywords){
                setFormData({
                    diagnosisId: diagnosisId,
                    diagnosis: profile.diagnoses[diagnosisIndex].diagnosis,
                    currentKeywords: profile.diagnoses[diagnosisIndex].keywords.join(', '),
                    newKeywords: ''
                });
            } else {
                setFormData({
                    diagnosisId: diagnosisId,
                    diagnosis: profile.diagnoses[diagnosisIndex].diagnosis,
                    currentKeywords: [],
                    newKeywords: ''
                });
            }

        }
    }, [diagnosisIndex, diagnosisId, profile.diagnoses]);

    const handleValidation = (event) => {
        if (event.target.name === 'newKeywords') {
            if (event.target.value.indexOf(`"`) !== -1) {
                setErrorMessage('Please enter keywords without quotes separated by commas');
            }
        }
    }

    const handleChange = (event) => {
        const {name, value} = event.target;
        handleValidation(event);
        setFormData(fData => ({
            ...fData,
            [name]: value
        }));
    };

    //adds the new keywords to the user's record in the database
    const handleSubmit = (event) => {
        event.preventDefault();
        try{
            if (errorMessage !== ''){
                return null;
            }
            const {diagnosisId, newKeywords, diagnosis} = formData;
            let keywordsArray;
            if (newKeywords.indexOf(', ') === -1){
                keywordsArray = [newKeywords];
            } else {
                keywordsArray = newKeywords.split(", ");
            }
            let keywordData = {keywords: keywordsArray};
            let dataForStore = {keywords: keywordsArray, diagnosis: diagnosis}
            dispatch(updateUserDiagnosis(profile.userId, diagnosisId, keywordData, dataForStore));
        } catch(error) {
            setErrorMessage(error.message);
        }
    }

    const hasMounted = useRef(false)
 
    //handles changes to state as a result of dispatch(updateUserDiagnosis)
    useEffect(() => {
        if (hasMounted.current) {
            if(profile.loading === false && profile.error === null) {
                setErrorMessage('');
            } else if (profile.loading === false && profile.error !== null) {
                setErrorMessage(profile.error);
            }
        } else {
            hasMounted.current = true;
        }
    }, [profile.loading, profile.error]);

    if (diagnosisIndex === null) {
        return <div>Loading...</div>;
    }


    return (
        <>
            <h1>Change Keywords</h1>
            <Form className="modal-form" onSubmit={handleSubmit}>
                <FormGroup row>
                    <Label for='diagnosis' sm={5}>Diagnosis</Label>
                    <Col sm={7}>
                        <Input id='diagnosis' name='diagnosis' type='text' value={formData.diagnosis || ''} required disabled></Input>
                    </Col>
                    <Label for='currentKeywords' sm={5}>Current Keywords</Label>
                    <Col sm={7}>
                        <Input className="textarea" id="currentKeywords" name="currentKeywords" type="textarea" value={formData.currentKeywords || ''} required disabled></Input>
                    </Col>
                    <Label for='newKeywords' sm={5}>New Keywords</Label>
                    <Col sm={7}>
                        <Tooltip target='newKeywords' isOpen={tooltipOpen}>Enter keywords without quotes separated by commas</Tooltip>
                        <Input id='newKeywords' name='newKeywords' placeholder='new keywords' type='text' value={formData.newKeywords} onChange={handleChange}onFocus={() => setTooltipOpen(true)} onBlur={() => setTooltipOpen(false)}></Input>
                    </Col>
                    <div className='notes'>Add any keywords you would like to be included in the PubMed database search.</div>
                    {errorMessage ? 
                        <div className='form-errors'>{errorMessage}</div>: null}
                </FormGroup>
                <div className='modal-foot'>
                    <Button color='primary' className='modal-button submit-button'>Save</Button>
                </div>
            </Form>
        </>

    )
}

export default KeywordForm;