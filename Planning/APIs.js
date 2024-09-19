// National Center for Biotechnology Information API
const {convertXML} = require('simple-xml-to-json');

    let lastlogin = '2024%2F09%2F01';
    let today = '2024%2F09%2F15';
    let keywords = ['ME', 'CFS', 'Chronic+Fatigue+Symdrome', 'Myalgic+Encephamyaltis'];
    let articleIds = [];
    for (let keyword of keywords){
        let response = await axios.get(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${keyword}&mindate=${lastlogin}&maxdate=${today}&retmode=json&retmax=50&sort=pub_date`)
        let error = response.esearchresult.errorlist.phrasesnotfound[0];
        if (error === keyword) continue;
        for (let id of response.esearchresult.idlist){
            articleIds.push(id);
        }
    }

    //ON SIDEBAR: 
    let articleString = ''
    for (let i=0; i < 6; i++) {
        let articleString = articleString + `${articleIds[i]},`
    }
    let response = await axios.get(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${articleString}&retmode=xml`)
    const jsonResponse = convertXML(response);
    return (
        <div>
            {jsonResponse.PubmedArticleSet.map((item) => {
                return <p key={item.PMID}><a href={`https://pubmed.ncbi.nlm.nih.gov/${item.PMID}`}>{item.Article.ArticleTitle}</a></p>
            })}
        </div>
    )
    //ON FULL PAGE: 
    let articleString = '';
    for (let article of articleIds){
        let articleString = articleString + `${article},`;
    }
    let response = await axios.get(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${articleString}&retmode=xml`);
    const jsonResponse = convertXML(response)
    return (
        <div>
            {jsonResponse.PubmedArticleSet.map((item) => {
                return (
                    <>
                        <p key={item.PMID} class='article-title'><a href={`https://pubmed.ncbi.nlm.nih.gov/${item.PMID}`}>{item.Article.ArticleTitle}</a></p>
                        <p class='article-abstract'>{item.Article.Abstract.AbstractText.CONCLUSIONS}</p>
                    </>
                ) 
            })}
        </div>
    )


//Datamuse API
//On typing in medication add form
let med = event.target.value;
let suggList = [];
if (med.length > 3){
    let response = await axios.get(`https://api.datamuse.com/words?sp=${med}*&topics=medicine&max=3`);
    for (let item in response){
        suggList.push(item.word);
    }
}

//On searching in medication add form
let med = event.target.value;
let suggList = [];
let response = await axios.get(`https://api.datamuse.com/words?sp=${med}&topics=medicine`);
for (let item in response){
    suggList.push(item.word);
}

//On typing in symptom add form
let symp = event.target.value;
let suggList = [];
if (symp.length > 3){
    let response = await axios.get(`https://api.datamuse.com/words?sp=${symp}*&topics=health&max=3`);
    for (let item in response){
        suggList.push(item.word)
    }
}

//On searching in symptom add form
let symp = event.target.value;
let suggList = [];
let response = await axios.get(`https://api.datamuse.com/words?sp=${symp}&topics=health`);
for (let item in response){
    suggList.push(item.word);
}