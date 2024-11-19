import React from 'react';
import {useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import {selectProfile} from '../redux/selectors/selectors';
import {Col, Row, Container} from 'reactstrap';
import LatestSidebar from './LatestSidebar';
import logo from '../assets/Chronic_dark.png';

function Home() {
    const profile = useSelector(selectProfile);

    return (
        <Container fluid className='p-0'>
            <Row className='navbar-space m-0 p-0'>
            </Row>
            <Row className='main-body m-0 p-0'>
                <Col className='home' xs='9'>
                    {profile.userId ? 
                        <div className='in-home-page'>
                            <Link to='/tracking' className='link-box-a'><div className='link-box'>Tracking</div></Link>
                            <div className='central-directions'>
                                <div className='directions'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={5} stroke="currentColor" className="arrow">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5" />
                                    <path strokeLinecap="butt" strokeLinejoin="round" d="M3 12h18"/></svg>
                                    <div className='directions-text'>To track your symptoms and medications, click here</div>
                                </div>
                                <div className='directions'>
                                    <div className='directions-text'>To see your tracking data in a graph, click here</div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={5} stroke="currentColor" className="arrow">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5" />
                                    <path strokeLinecap='butt' strokeLinejoin='round' d='M21 12H3'/></svg>
                                </div>
                            </div>
                            <Link to='/data' className='link-box-a'><div className='link-box'>Data</div></Link>
                        </div>
                        : 
                        <div className='out-home-page'>
                            <div className='hero-text'>Your Health. Your Data. Your Power.</div>
                            <img className='hero-image' src={logo} alt='Logo'></img>
                            <div className='hero-text'>CHRONIC</div>

                        </div>
                    }
                </Col>
                <Col className='sidebar' xs='3'>
                    <LatestSidebar/>
                </Col>
            </Row>
        </Container>

    )
}

export default Home;