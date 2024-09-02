import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import Swal from "sweetalert2";
import { loginIdState, memberTypeState } from "../utils/RecoilData";

const Login = () => {
  //recoil저장소에 접근하는 방법
  const [loginId, setLoginId] = useRecoilState(loginIdState);
  const [memberType, setMemberType] = useRecoilState(memberTypeState);
  console.log(loginId);
  console.log(memberType);
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [member, setMember] = useState({ memberId: "", memberPw: "" });
  const navigate = useNavigate();
  const changeMember = (e) => {
    const name = e.target.name;
    setMember({ ...member, [name]: e.target.value });
  };
  const login = () => {
    if (member.memberId === "" || member.memberPw === "") {
      Swal.fire({
        text: "아이디 또는 비밀번호를 입력하세요",
        icon: "info",
      });
      return;
    }
    axios
      .post(`${backServer}/member/login`, member)
      .then((res) => {
        console.log(res);
        setLoginId(res.data.memberId);
        setMemberType(res.data.memberType);
        //로그인 이후 axios 요청 시 발급받은 토큰값을 자동으로 axios에 추가하는 설정
        axios.defaults.headers.common["Authorization"] = res.data.accessToken;
        //로그인 상태를 지속적으로 유지시키기위해 발급받은 refreshToken을 브라우저에 저장
        window.localStorage.setItem("refreshToken", res.data.refreshToken);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          text: "아이디 또는 비밀번호를 확인해주세요.",
          icon: "warning",
        });
      });
  };
  return (
    <section className="section login-wrap">
      <div className="page-title">로그인</div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          login();
        }}
      >
        <div className="input-wrap">
          <div className="input-title">
            <label htmlFor="memberId">아이디</label>
          </div>
          <div className="input-item">
            <input
              type="text"
              name="memberId"
              id="memberId"
              value={member.memberId}
              onChange={changeMember}
            />
          </div>
        </div>
        <div className="input-wrap">
          <div className="input-title">
            <label htmlFor="memberPw">비밀번호</label>
          </div>
          <div className="input-item">
            <input
              type="password"
              name="memberPw"
              id="memberPw"
              value={member.memberPw}
              onChange={changeMember}
            />
          </div>
        </div>
        <div className="login-button-box">
          <button type="submit" className="btn-primary lg">
            로그인
          </button>
        </div>
        <div className="member-link-box">
          <Link to="/join">회원가입</Link>
          <Link to="#">아이디/비밀번호 찾기</Link>
        </div>
      </form>
    </section>
  );
};

export default Login;
