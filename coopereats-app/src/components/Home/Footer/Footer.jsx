import React from 'react'
import './Footer.css'
import assets from '../ExploreMenu/assets'
import fb from '../ExploreMenu/iconImage/facebook_icon.png'
import tt from '../ExploreMenu/iconImage/twitter_icon.png'
import li from '../ExploreMenu/iconImage/facebook_icon.png'
import cel from '../ExploreMenu/iconImage/TheCooperUnion_logo.png'

const Footer = () => {
    return (
        <div className='footer' id='footer'>
            <div className="footer-content">
                <div className="footer-content-left">
                    <img src={cel} alt="" />
                    <div className="footer-social-icons">
                        <img src={fb} alt="" />
                        <img src={tt} alt="" />
                        <img src={li} alt="" />
                    </div>
                </div>
                <div className="footer-content-center">
                    <h2>COMPANY</h2>
                    <ul>
                        <li>Home</li>
                        <li>About us</li>
                        <li>Private policy</li>
                    </ul>
                </div>
                <div className="footer-content-right">
                    <h2>GET IN TOUCH</h2>
                    <ul> 
                        <li>+1-212-456-7899</li>
                        <li>contant@cooper.edu</li>
                    </ul>
                </div>
                </div>
                <hr />
                <p className="footer-copyright">Copyright 2024 @ cooper.edu - All Right Reserved.</p>

        </div>
    )
}

export default Footer