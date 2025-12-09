import { useEffect, useState } from "react";
import Styles from '../css/BackToTop.module.css';

const SCROLL_SHOW_THRESHOLD = 300; // 이 값보다 아래로 내려가면 버튼 표시

const BackToTop = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        let ticking = false;

        const onScroll = () => {
            if(!ticking){
                window.requestAnimationFrame(() => {
                    setVisible(window.pageYOffset > SCROLL_SHOW_THRESHOLD);
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, {passive: true});
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
    
    const scrollToTop = () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    }

    return (
        <>
            <button
                className={`${Styles.btn} ${visible ? Styles.show : ''}`} 
                onClick={scrollToTop} 
                aria-label="맨 위로 이동">
                ▲
            </button>
        </>
    );
}

export default BackToTop;