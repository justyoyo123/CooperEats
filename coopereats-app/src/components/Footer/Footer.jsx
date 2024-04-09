import React from 'react'
import './Footer.css'
import assets from '../Home/ExploreMenu/assets'
import fb from '../Home/ExploreMenu/iconImage/facebook_icon.png'
import tt from '../Home/ExploreMenu/iconImage/twitter_icon.png'
import li from '../Home/ExploreMenu/iconImage/linkedin_icon.png'
import cel from '../Home/ExploreMenu/iconImage/TheCooperUnion_logo.png'
import { useNavigate } from 'react-router-dom';


const Footer = () => {
    const navigate = useNavigate();

    const handleHomeClick = () => {
        navigate('/');
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };
    return (
        <div className='footer' id='footer'>
            <div className="footer-content">
                <div className="footer-content-left">
                    <a href="https://cooper.edu/welcome" target="_blank" rel="noopener noreferrer">
                    <img src={cel} alt="Cooper Union" />
                    </a>
                    <div className="footer-social-icons">
                        <a href="https://www.facebook.com/cooperunion" target="_blank" rel="noopener noreferrer">
                            <img src={fb} alt="Facebook" />
                        </a>
                        <a href="https://twitter.com/cooperunion?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor" target="_blank" rel="noopener noreferrer">
                            <img src={tt} alt="Twitter" />
                        </a>
                        <a href="https://www.linkedin.com/school/the-cooper-union/" target="_blank" rel="noopener noreferrer">
                            <img src={li} alt="LinkedIn" />
                        </a>
                    </div>
                </div>
                <div className="footer-content-center">
                    <h2>COMPANY</h2>
                    <ul>
                            <li onClick={handleHomeClick} style={{cursor: 'pointer'}}>Home</li>
                            <li>About us</li>
                            <li>Private policy</li>
                    </ul>
                </div>
                <div className="footer-content-right">
                    <h2>GET IN TOUCH</h2>
                    <ul> 
                        <li>+1-212-456-7899</li>
                        <li>contact@cooper.edu</li>
                    </ul>
                </div>
                </div>
                <hr />
                <p className="footer-copyright">Copyright 2024 @ cooper.edu - All Right Reserved.</p>

        </div>
    )
}

export default Footer