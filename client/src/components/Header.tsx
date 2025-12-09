import Styles from '../css/Header.module.css';
import {HashLink} from 'react-router-hash-link';

const Header = () => {
    return(
        <>
            <div className={Styles.wrap}>
                <div className={Styles.logo}>
                    <h2>화상 통화 서비스</h2>
                </div>
                <div className={Styles.menu_container}>
                    <ul>
                        <li><HashLink smooth to="/#about"><span>About</span>소개</HashLink></li>
                        <li><HashLink smooth to="/#service"><span>Service</span>서비스</HashLink></li>
                        <li><HashLink smooth to="/contacts"><span>Contact</span>문의</HashLink></li>
                    </ul>

                        <ul>
                            <li className={Styles.login}><a href="#">Login</a></li>
                            <li className={Styles.Start}><a href="#">Get started</a></li>
                        </ul>
                </div>
            </div>
        </>
    );
}

export default Header;