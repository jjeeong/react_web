import { Route, Routes } from "react-router-dom";
import Footer from "./components/common/Footer";
import Header from "./components/common/Header";
import Main from "./components/common/Main";
import Join from "./components/member/Join";
import Login from "./components/member/Login";
import axios from "axios";
import { useRecoilState, useRecoilStateLoadable } from "recoil";
import { loginIdState, memberTypeState } from "./components/utils/RecoilData";
import { useEffect } from "react";
import MemberMain from "./components/member/MemberMain";
import BoardMain from "./components/board/BoardMain";
import AdminMain from "./components/admin/AdminMain";
import ChatMain from "./components/utils/ChatMain";

function App() {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [loginId, setLoginId] = useRecoilState(loginIdState);
  const [memberType, setMemberType] = useRecoilState(memberTypeState);
  useEffect(() => {
    refreshLogin();
    window.setInterval(refreshLogin, 60 * 60 * 1000); //한시간이 지나면 자동으로 refresh될 수 있게
  }, []);
  const refreshLogin = () => {
    //최초화면 접속하면 localStorage에 저장한 refreshToken을 가져와서 자동으로 로그인 처리
    const refreshToken = window.localStorage.getItem("refreshToken");
    //한번도 로그인 하지 않았거나, 로그아웃 했으면 refreshToken은 존재하지 않음
    if (refreshToken != null) {
      //refreshToken이 존재하면 -> 해당토큰으로 다시 로그인 처리
      axios.defaults.headers.common["Authorization"] = refreshToken;
      axios
        .post(`${backServer}/member/refresh`)
        .then((res) => {
          //refresh토큰을 전송해서 로그인 정보를 새로 갱신해옴
          console.log(res);
          setLoginId(res.data.memberId);
          setMemberType(res.data.memberType);
          axios.defaults.headers.common["Authorization"] = res.data.accessToken;
          window.localStorage.setItem("refreshToken", res.data.refreshToken);
        })
        .catch((err) => {
          console.log(err);
          setLoginId("");
          setMemberType("");
          delete axios.defaults.headers.common["Authorization"];
          window.localStorage.removeItem("refreshToken");
        });
    }
  };
  return (
    <div className="wrap">
      <Header />
      <main className="content">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/join" element={<Join />} />
          <Route path="/login" element={<Login />} />
          <Route path="/member/*" element={<MemberMain />} />
          <Route path="/board/*" element={<BoardMain />} />
          <Route path="/admin/*" element={<AdminMain />} />
          <Route path="/chat" element={<ChatMain />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
