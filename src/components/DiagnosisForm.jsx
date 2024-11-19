import React, {useEffect, useState, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {selectProfile} from '../redux/selectors/selectors';
import {Button, Form, FormGroup, Label, Input, Col, Tooltip, Dropdown, DropdownMenu, DropdownItem} from 'reactstrap';
import ChronicAPI from '../api/chronicAPI';
import {connectDiagnosis} from '../redux/thunks/profileThunks';

function DiagnosisForm({toggleDiagnosisModal}) {
    const profile = useSelector(selectProfile);
    const [diagnoses, setDiagnoses] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const initialState = {
        diagnosis: '',
        keywords: ''
    }
    const [formData, setFormData] = useState(initialState);
    const [errorMessage, setErrorMessage] = useState('');
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const dispatch = useDispatch();

    //auto complete of diagnosis field with existing diagnoses in the database
    useEffect(() => {
        const getDiagnoses = async () => {
            const diagnosesList = await ChronicAPI.getAllDiagnoses();
            setDiagnoses(diagnosesList);
        }
        getDiagnoses();
    }, []);

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData(fData => ({
            ...fData,
            [name]: value
        }));
        //suggests autocomplete options
        if (name === 'diagnosis') {
            if (value.length > 0){
                const results = search(value);
                setSuggestions(results);
                setDropdownOpen(results.length > 0);
            } else {
                setDropdownOpen(false);
            }
        }
    };

    //functions to search for and suggest autocompletions for diagnosis field
    function search(str) {
        let results = [];
        for (let diagnosis of diagnoses){
            if (diagnosis.diagnosis.toLowerCase().includes(str.toLowerCase())){
                results.push(diagnosis);
            }
        }
        sortResults(results, str);
        return results;
    };

    function sortResults(results, str){
        for (let i = 0; i < results.length; i++){
            let index = results[i].diagnosis.toLowerCase().indexOf(str.toLowerCase());
            let counter = 0;
            if (index === 0) {
                results.splice(counter, 0, results[i]);
                results.splice(i + 1, 1);
                counter++;
            }
        }
    };

    //adds the diagnosis to the user's record in the database
    const handleSubmit = (event) => {
        event.preventDefault();
        try {
            const {diagnosis, keywords} = formData;
            let keywordsArray = keywords.split(', ');
            let diagnosisId;
            let diagnosisIndex;
            if (diagnosis) {
                diagnosisIndex = diagnoses.findIndex(({diagnosis: d, synonyms}) => d.toLowerCase() === diagnosis.toLowerCase() || 
                (Array.isArray(synonyms) && synonyms.some((syn) => syn.toLowerCase() === diagnosis.toLowerCase())))
                if (diagnosisIndex !== -1) {
                    diagnosisId = diagnoses[diagnosisIndex].diagnosisId;
                } else {
                    diagnosisId = 0
                }
            };
            let diagnosisData;
            let dataForStore;
            if (diagnosisId === 0){
                diagnosisData = {diagnosis: diagnosis, keywords :keywordsArray};
                dataForStore = {diagnosis: diagnosis, keywords: keywordsArray};
            } else {
                diagnosisData = {keywords: keywordsArray};
                dataForStore = {diagnosis: diagnoses[diagnosisIndex].diagnosis, keywords: keywordsArray};
            }
            dispatch(connectDiagnosis(profile.userId, diagnosisId, diagnosisData, dataForStore));
        } catch(error) {
            setErrorMessage(error)
        }
    };

    //handles changes to state as a result of dispatch(connectDiagnosis)
    const hasMounted = useRef(false);

    useEffect(() => {
        if (hasMounted.current) {
            if(profile.loading === false && profile.error === null){
                setErrorMessage('');
                setFormData(initialState);
                toggleDiagnosisModal();
            } else if (profile.loading === false && profile.error !== null){
                setErrorMessage(profile.error);
            }
        } else {
            hasMounted.current = true;
        }
    }, [profile.loading, profile.error]);

    return (
        <>
            <h1>Add Diagnosis</h1>
            <Form className="modal-form" onSubmit={handleSubmit}>
                <FormGroup row>
                    <Label for='diagnosis' sm={5}>Diagnosis</Label>
                    <Col sm={7}>
                        <Input id='diagnosis' name='diagnosis' placeholder='diagnosis' type='text' value={formData.diagnosis} onChange={handleChange} required></Input>
                        <Dropdown isOpen={isDropdownOpen} toggle={() => setDropdownOpen(!isDropdownOpen)}>
                            <DropdownMenu>
                                {suggestions.map((item) => (
                                    <DropdownItem key={item.id} onClick={() => setFormData({...formData, diagnosis: item.diagnosis})}>
                                        {item.diagnosis}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    </Col>
                    <Label for='keywords' sm={5}>Keywords</Label>
                    <Col sm={7}>
                        <Tooltip target='keywords' isOpen={tooltipOpen}>Enter keywords without quotes separated by commas</Tooltip>
                        <Input id='keywords' name='keywords' placeholder='keywords' type='text' value={formData.keywords} onChange={handleChange}onFocus={() => setTooltipOpen(true)} onBlur={() => setTooltipOpen(false)}></Input>
                    </Col>
                    <div className='notes'>Add any keywords you would like to be included in the PubMed database search.</div>
                    {errorMessage ? 
                        <div className='form-errors'>{errorMessage}</div>: null}
                </FormGroup>
                <div className='modal-foot'>
                    <Button color='primary' className='modal-button submit-button'>Add</Button>
                </div>
            </Form>
        </>

    )
}

export default DiagnosisForm;