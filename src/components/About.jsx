import React from 'react';
import {Row, Container} from 'reactstrap';
import javascript from '../assets/javascript.webp';
import node from '../assets/node_logo.png';
import postgresql from '../assets/PostgreSQL-Logo.jpg';
import vite from '../assets/vite.jpg';
import react from '../assets/react.jpg';
import redux from '../assets/redux.jpg';

function About() {
    return (
        <Container fluid className='p-0 white-page'>
            <Row className='navbar-space m-0 p-0'>
            </Row>
            <Row className='about-content m-0 p-0'>
                <h2 className='page-title'>ABOUT CHRONIC</h2>
                <div className='text-content'>
                    <p>Take charge of your health with Chronic. No more digging through notes or trying to remember what you felt like last week. Everything you need is in one place -- your symptoms, your meds, and the trends that tell your story.</p>
                    <p>Spot patterns in your health that you might not have noticed before with simple graphs. Is a new treatment working? Are your symptoms getting worse? You'll see it clearly. When it's time to see your doctor, share your up-to-date data with confidence. Better communication means better care and we've got you covered. </p>
                    <p>The more you track, the more control you'll have. It's your health, organized, insightful, and ready for whatever comes next. </p>
                    <p className='second-section'>This website was built with:</p>
                    <div className='logos'>
                        <img className="tech-logo-tall" src={javascript}/>
                        <a href="https://nodejs.org/en"><img className="tech-logo-wide" src={node}/></a>
                        <a href="https://www.postgresql.org/"><img className="tech-logo-wide" src={postgresql}/></a>
                        <a href="https://vite.dev/"><img className="tech-logo-tall" src={vite}/></a>
                        <a href="https://react.dev/"><img className="tech-logo-tall" src={react}/></a>
                        <a href="https://redux.js.org/"><img className="tech-logo-tall" src={redux}/></a>
                    </div>
                </div>
            </Row>
        </Container>
    )
}

export default About;