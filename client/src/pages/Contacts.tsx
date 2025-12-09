import { useEffect, useState } from 'react';
import BackToTop from '../components/BackToTop';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Styles from '../css/Contact.module.css';
import {Link} from "react-router-dom";

const Contact = () => {

    const [posts, setPosts] = useState([]);

    // 컴포넌트가 마운트될 때 API 호출
    useEffect(() => {
        fetch("http://localhost:8080/contacts")
        .then(response => response.json())
        .then(data => {
            setPosts(data);
        }).catch(error => console.error('Error fetching contacts:', error));
    }, []);

    return (
        <>
            <div className={Styles.pageEnvelope}> {/* 바깥 배경 */}
                <div className={Styles.wrap}>
                    <Header/>
                    <div className={Styles.content}>
                        
                        <h2>게시판</h2>

                        <table className={Styles.table}>
                            <thead>
                                <tr>
                                    <th>제목</th>
                                    <th>닉네임</th>
                                    <th>날짜</th>
                                    <th>조회수</th>
                                </tr>
                            </thead>

                            <tbody>
                               {posts.map(post => (
                                    <tr key={post.id} className={Styles.row}>
                                       <td data-label="제목">
                                            <Link to={`/contact/${post.id}`} className={Styles.link}>
                                                {post.title}
                                            </Link>
                                       </td>
                                       <td data-label="닉네임">{post.memberNickname}</td>
                                       <td data-label="날짜">
                                            {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                                       </td>
                                       <td data-label="조회수">{post.readCount}</td>
                                    </tr>
                               ))}
                            </tbody>
                        </table>

                    </div>
                </div>
            </div>

            <Footer/>
            <BackToTop/>
        </>
    );
}

export default Contact;