import { Link } from "react-router-dom";
import "./default.css";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  loginIdState,
  memberTypeState,
  isLoginState,
} from "../utils/RecoilData";
import axios from "axios";

const Header = () => {
  return (
    <header className="header">
      <div>
        <div className="logo">
          <Link to="/">MOON'S WORLD</Link>
        </div>
        <MainNavi />
        <HeaderLink />
      </div>
    </header>
  );
};

const MainNavi = () => {
  return (
    <nav className="nav">
      <ul>
        <li>
          <Link to="#">메뉴1</Link>
        </li>
        <li>
          <Link to="#">메뉴2</Link>
        </li>
        <li>
          <Link to="#">메뉴3</Link>
        </li>
        <li>
          <Link to="#">메뉴4</Link>
        </li>
      </ul>
    </nav>
  );
};

const HeaderLink = () => {
  const [loginId, setLoginId] = useRecoilState(loginIdState);
  const [memberType, setMemberType] = useRecoilState(memberTypeState);

  const isLogin = useRecoilValue(isLoginState);
  //console.log("header : ", loginId, memberType);
  const logout = () => {
    setLoginId("");
    setMemberType(0);
    delete axios.defaults.headers.common["Authorization"];
    window.localStorage.removeItem("refreshToken");
  };
  return (
    <ul className="user-menu">
      {isLogin ? (
        <>
          <li>
            <Link to="/member">{loginId}</Link>
          </li>
          <li>
            <Link to="#" onClick={logout}>
              로그아웃
            </Link>
          </li>
        </>
      ) : (
        <>
          <li>
            <Link to="/login">로그인</Link>
          </li>
          <li>
            <Link to="/join">회원가입</Link>
          </li>
        </>
      )}
    </ul>
  );
};

export default Header;
