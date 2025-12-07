import { FaEnvelope, FaGithub, FaPhone } from "react-icons/fa";
import Styles from "../css/Introduce.module.css";
const Introduce = () => {
    return (
        <>
            <div className={Styles.wrap}>
                <div className={Styles.header}>
                    <h3>팀원들을 소개합니다.</h3>
                    <p>우리는 고객들의 변화에 대해서 생각하며,<br/>
                       세부 사항에 대한 주의와 창의적인 감각을 강조합니다.</p>
                </div>

                <div className={Styles.item}>
                    <img className={Styles.profile} src="/image/robot.jpg" alt="로봇" />
                    <h4>God_Win_Iorn</h4>
                    <p className={Styles.desc}>
                        평범한 일상을 가진 개발자를 꿈꾸는 팀원입니다.
                        취미는 사진찍기, 기타연주하기, 카드 게임 등
                    </p>
                    <div className={Styles.buttons}>
                        <button onClick={() => window.location.href = "mailto:example@example.com"}>
                            <FaEnvelope size={24}/>
                        </button>
                        <button onClick={() => window.location.href = "tel:01012345678"}>
                            <FaPhone size={24}/>
                        </button>
                        <button onClick={() => window.open("https://github.com/shincharl", "_blank")}>
                            <FaGithub size={24}/>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Introduce;