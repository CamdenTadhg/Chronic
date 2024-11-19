import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {selectProfile, selectLatest} from '../redux/selectors/selectors';
import ChronicAPI from '../api/chronicAPI';
import {fetchLatest} from '../redux/thunks/latestThunks';

function LatestSidebar() {
    const dispatch = useDispatch();
    const profile = useSelector(selectProfile);
    const latest = useSelector(selectLatest);
    const [articles, setArticles] = useState([]);
    const [loadingMessage, setLoadingMessage] = useState('Waking up server, please wait');
    const [showError, setShowError] = useState(false);

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
    
    useEffect(async () => {
        //check that the server is spun up
        const readiness = await ChronicAPI.ready();
        if (readiness.status === "ok" && readiness.delay > 5000) {
            setLoadingMessage("Waking up server, please wait");
        } else if (readiness.status === "error") {
            setLoadingMessage("Server is currently unavailable. Please try again.");
            return;
        } else {
            setLoadingMessage("Loading...");
        }
        //if no user logged in, pull article ids on chronic illnesses in general
        if (!profile.userId){
            dispatch(fetchLatest());
        //else pull article ids on the user's chosen diagnoses & keywords
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
                    const sixArticleIds = latest.articleIds.slice(0, 7);
                    const getArticles = async () => {
                        try{
                            const articleDetails = await ChronicAPI.getArticles(sixArticleIds);
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

    //give articles time to populate before displaying error message
    useEffect(() => {
        if (!latest.loading) {
            const timeoutId = setTimeout(() => {
                if (articles.length === 0){
                    setShowError(true);
                }
            }, 1000);
            return () => clearTimeout(timeoutId);
        }
    }, [latest.loading]);

    return (
        <>
            <Link to='/latest'><h2 className='latest-head'>The Latest</h2></Link>
            <div className='articles-sidebar'>
                {Array.isArray(articles) && articles.length > 0 ? 
                (articles.map((article) => (
                    <p key={article.PMID}>
                        <a href={`https://pubmed.ncbi.nlm.nih.gov/${article.PMID}`} target="_blank" rel="noopener noreferrer">{article.title}</a>
                    </p>
                )))
                : latest.loading === true || showError === false ? <p>{loadingMessage}</p>:
                <p>An error occurred. Please try again later</p>}
            </div>
        </>
    )
}

export default LatestSidebar;
