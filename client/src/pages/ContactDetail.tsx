import { Link ,useParams } from 'react-router-dom';
import Header from '../components/Header';
import Styles from '../css/ContactDetail.module.css';
import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';

const ContactDetail = () => {

    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:8080/contact/${id}`)
            .then(res => res.json())
            .then(data => {
                setPost(data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, [id]);

    if(loading) return <div className={Styles.loading}>불러오는 중...</div>;

    if(!post) return <div className={Styles.error}>게시글을 찾을 수 없습니다.</div>

    return (
        <>
            <div className={Styles.pageEnvelope}>
                <div className={Styles.wrap}>
                    <Header/>

                    <div className={Styles.content}>
                        <h2 className={Styles.title}>{post.title}</h2>

                        <div className={Styles.info}>
                            <span>작성자: {post.memberNickname}</span>
                            <span>조회수: {post.readCount}</span>
                            <span>
                                날짜: {new Date(post.createdAt).toLocaleDateString("ko-KR")}
                            </span>
                        </div>

                        <div className={Styles.bodyBox}>
                            {post.content}
                        </div>

                        <div className={Styles.btnWrap}>
                            <Link to="/contacts" className={Styles.backBtn}>
                                목록으로 돌아가기
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <Footer/>
            <BackToTop/>
        </>
    );
}

export default ContactDetail;