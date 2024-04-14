import React, { useState } from 'react'
import './Footer.css'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import assets from '../Home/ExploreMenu/assets'
import fb from '../Home/ExploreMenu/iconImage/facebook_icon.png'
import tt from '../Home/ExploreMenu/iconImage/twitter_icon.png'
import li from '../Home/ExploreMenu/iconImage/linkedin_icon.png'
import cel from '../Home/ExploreMenu/iconImage/TheCooperUnion_logo.png'
import { useNavigate } from 'react-router-dom';


const Footer = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false); // State to control the open status of the modal

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const navigateAndScrollTop = (path) => {
        navigate(path);
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
                    <h2 style={{ cursor: 'default' }}>COMPANY</h2>
                    <ul>
                            <li onClick={() => navigateAndScrollTop('/')} style={{cursor: 'pointer'}}>Home</li>
                            <li onClick={() => navigateAndScrollTop('/about')} style={{cursor: 'pointer'}}>About Us</li>
                            <li onClick={handleOpen} style={{cursor: 'pointer'}}>Privacy Policy</li> {/* Update this line */}
                    </ul>
                </div>
                <div className="footer-content-right">
                    <h2 style={{ cursor: 'default' }}>GET IN TOUCH</h2>
                    <ul>
                        <li style={{ cursor: 'default' }}>+1-212-456-7899</li>
                        <li style={{ cursor: 'default' }}>contact@cooper.edu</li>
                    </ul>
                </div>
            </div>
            <hr />
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="footer-modal-title"
                aria-describedby="footer-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 'auto',
                    maxWidth: '600px',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 3,
                    borderRadius: 2,
                    background: 'linear-gradient(to right, #FFFFFF, #F1F1F1)' // Gradient background
                }}>
                    <Typography id="footer-modal-title" variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Privacy Policy
                    </Typography>
                    <Typography id="footer-modal-description" sx={{ mb: 2 }}>
                        <strong>What We Collect:</strong>
                        <p>Personal details like name, contact information, and payment data to provide and enhance our services.</p>

                        <strong>How We Use It:</strong>
                        <p>To manage your account, process transactions, communicate with you about our services, and improve your overall experience.</p>

                        <strong>Who We Share It With:</strong>
                        <p>We share your information only with your consent or for legal obligations.</p>

                        <strong>Security:</strong>
                        <p>We prioritize the security of your information with robust measures.</p>

                        <strong>Changes to Policy:</strong>
                        <p>We may update our privacy policy, and changes will be communicated through our platform.</p>
                    </Typography>
                    <Button
                    onClick={handleClose}
                    variant="contained"
                    sx={{
                        mt: 2, // This adds a margin-top equivalent to the theme's spacing unit multiplied by 2
                        border: 'none',
                        color: '#747474',
                        fontWeight: 500,
                        padding: '0.6vw 1.4vw',
                        backgroundColor: 'white',
                        fontSize: 'max(1vw, 13px)',
                        borderRadius: '25px',
                        textShadow: '0.1px 0.1px 0.1px rgba(0, 0, 0, 0.3)',
                        '&:hover': {
                            backgroundColor: '#f5f5f5',
                            color: '#333'
                        }
                    }}
                >
                    Close
                </Button>
                </Box>
            </Modal>

            <p className="footer-copyright">Copyright 2024 @ cooper.edu - All Right Reserved.</p>
        </div>
    );
}

export default Footer;