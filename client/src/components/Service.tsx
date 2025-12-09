import Styles from '../css/Service.module.css'

const Service = ({id}) => {
    return (
        <section id={id} >
           <div className={Styles.wrap}>
                <div className={Styles.header}>
                    <h3>제공하는 서비스</h3>
                    <p>멋진 선생님과 열의있는 학생들은<br/>
                       새로운 세상을 만들 준비를 할 수 있습니다.</p>
                </div>
                
                <div className={Styles.mains}>
                        <div className={Styles.item}>
                            <img className={Styles.profile} src="/image/welcome.png" alt="환영합니다" />
                            <h4>1. 로그인 후 접속</h4>
                            <p className={Styles.desc}>
                                학생/선생님 선택 후 로그인 해서 해당 기능을 이용해보세요!
                            </p>
                        </div>
                        <div className={Styles.item}>
                            <img className={Styles.profile} src="/image/remote.png" alt="화상채팅" />
                            <h4>2. 약속한 선생님과 서로 대화하기</h4>
                            <p className={Styles.desc}>
                                어떠한 교과목, 인생이야기, 책쓰는 법, 화분 관리법 모든 걸 가르치고
                                배워보세요!
                            </p>
                        </div>
                        <div className={Styles.item}>
                            <img className={Styles.profile} src="/image/grandmother.jpg" alt="할머니" />
                            <h4>3. 이 모든 기능이 무료입니다!</h4>
                            <p className={Styles.desc}>
                                이 멋진 기능을 세상 사람들에게 알려주세요!<br/>
                                친절한 팀원이 추가되고, 규모가 커지면 새로운 기능들이 업데이트 됩니다!
                            </p>
                        </div>
                 </div>
            </div>
        </section>
    );
}

export default Service;