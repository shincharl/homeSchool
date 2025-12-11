import Styles from '../css/Header.module.css';
import {HashLink} from 'react-router-hash-link';
import { useAuth } from './AuthContextType';

const Header = () => {

    const {nickname, handleLogout, timeLeft, resetTimer} = useAuth();

    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);


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
                            {nickname ? (
                                <>
                                    <li className={Styles.user} onClick={resetTimer}> 
                                        {nickname} 님 🌱
                                        <span style={{marginLeft: '10px', fontSize: '0.8rem'}}>
                                            ({minutes}:{seconds.toString().padStart(2,'0')})
                                        </span>
                                    </li>
                                    <li className={Styles.logout}>
                                        <button onClick={handleLogout}>Logout</button>
                                    </li>
                                    <li className={Styles.Start}><a href="#">Get started</a></li>
                                </>
                        ) : (
                            <>
                                 <li className={Styles.login}><a href="/login">Login</a></li>
                                 <li className={Styles.Start}><a href="#">Get started</a></li>
                            </>
                        )}
                        </ul>
                </div>
            </div>
        </>
    );
}

export default Header;