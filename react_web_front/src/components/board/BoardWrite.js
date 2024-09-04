import { useState } from "react";
import { useRecoilState } from "recoil";
import { loginIdState } from "../utils/RecoilData";
import BoardFrm from "./BoardFrm";

const BoardWrite = () => {
  //글작성 시 전송할 데이터 선언
  const [loginId, setLoginId] = useRecoilState(loginIdState); //로그인한 회원 아이디 값(입력할게 아니기 때문에 state사용안하고 작성자(로그인한 아이디)는 변경하지 않을 것이므로 set은 사용하지 않음)
  const [boardTitle, setBoardTitle] = useState(""); //사용자가 입력할 제목
  const [thumbnail, setThumbnail] = useState(null); //썸네일은 첨부파일로 처리
  const [boardContent, setBoardContent] = useState(""); //사용자가 입력할 내용
  const [boardFile, setBoardFile] = useState([]); //첨부파일(여러개일 수 있으므로 배열 처리)
  const inputTitle = (e) => {
    setBoardTitle(e.target.value);
  };
  const inputContent = (e) => {
    setBoardContent(e.target.value);
  };

  return (
    <section className="section board-content-wrap">
      <div className="page-title">게시글 작성</div>
      <form
        className="board-write-frm"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <BoardFrm
          loginId={loginId}
          boardTitle={boardTitle}
          setBoardTitle={inputTitle}
          thumbnail={thumbnail}
          setThumbnail={setThumbnail}
          boardFile={boardFile}
          setBoardFile={setBoardFile}
        />
      </form>
    </section>
  );
};

export default BoardWrite;
