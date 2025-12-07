import { FaEnvelope, FaGithub } from 'react-icons/fa';
import Styles from '../css/Footer.module.css';

const Footer = () => {
    return(
        <footer className={Styles.footer}>
            <div className={Styles.inner}>
                <div className={Styles.brand}>
                    <h3>화상 통화 서비스</h3>
                    <p>간편하고 빠른 화상 통화 서비스를 제공합니다.</p>
                </div>

                <ul className={Styles.links}>
                    <li><a href="/">Home</a></li>
                    <li><a href="/">About</a></li>
                    <li><a href="/">Service</a></li>
                    <li><a href="/">Contact</a></li>
                </ul>

                <div className={Styles.icons}>
                    <a href="mailto:example@example.com"><FaEnvelope /></a>
                    <a href="https://github.com/shincharl" target='_blank'><FaGithub/></a>
                </div>
            </div>

            <div className={Styles.copy}>
                © 2025 My WebRTC Service. All rights reserved.
            </div>
        </footer>
    );
} 

export default Footer;