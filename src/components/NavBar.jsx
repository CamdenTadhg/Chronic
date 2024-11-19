import React, {useState, useEffect} from 'react';
import {useNavigate, NavLink} from 'react-router-dom';
import {Navbar, Nav, NavbarBrand, Modal} from 'reactstrap';
import {useSelector} from 'react-redux';
import logo from '../assets/Chronic.png';
import SignupForm from './SignupForm';
import LoginForm from './LoginForm';
import {useDispatch} from 'react-redux';
import {logoutAction} from '../redux/actions/logout';
import ChronicAPI from '../api/chronicAPI';

function NavBar() {
    const [loginOpen, setLoginOpen] = useState(false);
    const [signupOpen, setSignupOpen] = useState(false);
    const navigate = useNavigate();
    const currentUser = useSelector(store => store.profile.userId);
    const dispatch = useDispatch();


    const handleLogout = () => {
        ChronicAPI.token = '';
        dispatch(logoutAction());
        navigate('/');
    }

    const handleHome = () => {
        navigate('/');
    }

    useEffect(() => {
        if (!signupOpen) {
            document.querySelector('.nav-link').blur();
            document.body.focus();
        }
    }, [signupOpen]);

    const toggleLoginModal = () => setLoginOpen(!loginOpen);
    const toggleSignupModal = () => setSignupOpen(!signupOpen);

    return (
        <nav>
            <Navbar color='secondary' full='true' expand='lg' fixed='top'>
                    <NavbarBrand className='brand' onClick={handleHome}>
                        <img className="chronic-logo" src={logo} alt="Logo" />
                        <h6 className='logo-text'>CHRONIC</h6>
                    </NavbarBrand>
                <Nav>
                    {currentUser ?
                        <>
                            <NavLink className="nav-link" to='/profile'>Profile</NavLink>
                            <NavLink className="nav-link" to='/about'>About</NavLink>
                            <button className="nav-link" onClick={handleLogout}>Logout</button>
                        </>:
                        <>
                            <NavLink className="nav-link" to='/about'>About</NavLink>
                            <button className="nav-link" onClick={toggleLoginModal}>Login</button>
                            <button className="nav-link signup" onClick={toggleSignupModal}>Signup</button>
                        </>
                    }
                </Nav>
            </Navbar>
            <Modal isOpen={loginOpen} toggle={toggleLoginModal} size='lg' centered={true}>
                <LoginForm toggleLoginModal={toggleLoginModal}/>
            </Modal>
            <Modal isOpen={signupOpen} toggle={toggleSignupModal} size='lg' centered={true}>
                <SignupForm toggleSignupModal={toggleSignupModal}/>
            </Modal>
        </nav>
    )
}

export default NavBar