import Styles from '../css/Header.module.css';

const Header = () => {
    return(
        <>
            <div className={Styles.wrap}>
                <div className={Styles.logo}>
                    <h2>화상 통화 서비스</h2>
                </div>
                <div className={Styles.menu_container}>
                    <ul>
                        <li><a href="#"><span>About</span>소개</a></li>
                        <li><a href="#"><span>Service</span>서비스</a></li>
                        <li><a href="#"><span>Contact</span>문의</a></li>
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