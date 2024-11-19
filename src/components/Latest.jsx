import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {selectLatest, selectProfile} from '../redux/selectors/selectors';
import ChronicAPI from '../api/chronicAPI';
import {Row, Container} from 'reactstrap';
import {fetchLatest} from '../redux/thunks/latestThunks';

function Latest() {
    const dispatch = useDispatch();
    const profile = useSelector(selectProfile);
    const latest = useSelector(selectLatest);
    const [articles, setArticles] = useState([]);

    const buildKeywords = (keywordsSource) => {
        let keywords = [];
        for (let diagnosis of keywordsSource){
            keywords.push(diagnosis.diagnosis);
            if (diagnosis.keywords){
                keywords = keywords.concat(diagnosis.keywords)
            }
        }
        return keywords;
    }
    
    useEffect(() => {
        //if no user logged in, pull article ids on chronic illnesses in general
        if (!profile.userId){
            dispatch(fetchLatest());
        } else {
            const keywords = buildKeywords(profile.diagnoses);
            dispatch(fetchLatest(keywords))
        }
    }, [profile]);

    useEffect(() => {
        if (!latest.loading){
            //then pull article details based on the articleIds in the store
            try {
                if (Array.isArray(latest.articleIds) && latest.articleIds.length === 0 && !latest.error){
                    setArticles([{PMID: 1, title: 'No articles found'}]);
                } else {
                    const getArticles = async () => {
                        try{
                            const articleDetails = await ChronicAPI.getArticles(latest.articleIds);
                            setArticles(articleDetails);
                        } catch (error) {
                            const articleDetails = [{PMID: null, title: error.message}];
                            setArticles(articleDetails);
                        }
                    }
                    getArticles();
                }
            } catch (error) {
            }
        }
    }, [latest.articleIds]);

    return (
        <Container fluid className='p-0 white-page'>
            <Row className='navbar-space m-0 p-0'>
            </Row>
            <Row className='latest-content m-0 p-0'>
                <h2 className='page-title'>THE LATEST</h2>
                <div className='text-content'>
                    {Array.isArray(articles) && articles.length > 0 ? 
                        (articles.map((article) => {
                            return (
                                <div key={article.PMID} >
                                <p className="title-text">
                                    <a href={`https://pubmed.ncbi.nlm.nih.gov/${article.PMID}`} target="_blank" rel="noopener noreferrer">{article.title}</a>
                                </p>
                                <p className='abstract-text'>{article.abstract}</p>
                                </div>
                            )
                        }))
                        : latest.loading === true ? <p>Loading...</p> : 
                        <p>An error occurred. Please try again later</p>
                }

                </div>
            </Row>
        </Container>
    )
}

export default Latest;

