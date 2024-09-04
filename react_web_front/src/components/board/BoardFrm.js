import { useRef, useState } from "react";

const BoardFrm = (props) => {
  const loginId = props.loginId;
  const boardTitle = props.boardTitle;
  const setBoardTitle = props.setBoardTitle;
  const thumbnail = props.thumbnail;
  const setThumbnail = props.setThumbnail;
  const boardFile = props.boardFile;
  const setBoardFile = props.setBoardFile;
  const thumbnailRef = useRef(null);
  //썸네일 미리보기용 state
  const [boardImg, setBoardImg] = useState(null);

  //썸네일 이미지 첨부파일이 변경되면 동작할 함수
  const changeThumnail = (e) => {
    //요소들이 겹쳐있는 상태에서 해당 요소를 선택할 때는 currentTarget(target을 사용하면 여러요소가 한번에 선택)
    const files = e.currentTarget.files;
    if (files.length !== 0 && files[0] !== 0) {
      //썸네일 파일 객체를 글작성 시 전송하기위한 값 저장
      setThumbnail(files[0]);
      //화면에 썸네일 미리보기
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onloadend = () => {
        setBoardImg(reader.result);
      };
    }
  };
  //첨부파일 화면에 띄울 state
  const [showBoardFile, setShowBoardFile] = useState([]);
  const addBoardFile = (e) => {
    const files = e.currentTarget.files;
    const fileArr = new Array(); //글작성 시 전송할 파일 배열
    const filenameArr = new Array(); //화면에 노출시킬 파일이름 배열
    for (let i = 0; i < files.length; i++) {
      fileArr.push(files[i]);
      filenameArr.push(files[i].name);
    }
    setBoardFile([...boardFile, ...fileArr]);
    setShowBoardFile([...showBoardFile, ...filenameArr]);
  };
  console.log(boardFile);
  console.log(showBoardFile);
  return (
    <div>
      <div className="board-thumb-wrap">
        {boardImg ? (
          <img
            src={boardImg}
            onClick={() => {
              thumbnailRef.current.click();
            }}
          />
        ) : (
          <img
            src="/image/default_img.png"
            onClick={() => {
              thumbnailRef.current.click();
            }}
          />
        )}
        <input
          ref={thumbnailRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={changeThumnail}
        />
      </div>
      <div className="board-info-wrap">
        <table className="tbl">
          <tbody>
            <tr>
              <th style={{ width: "30%" }}>
                <label htmlFor="boardTitle">제목</label>
              </th>
              <td>
                <div className="input-item">
                  <input
                    type="text"
                    id="boardTitle"
                    name="boardTitle"
                    value={boardTitle}
                    onChange={setBoardTitle}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <th>작성자</th>
              <td className="left">{loginId}</td>
            </tr>
            <tr>
              <th>
                <label htmlFor="boardFile">첨부파일</label>
              </th>
              <td className="left">
                <label htmlFor="boardFile" className="btn-primary sm">
                  파일첨부
                </label>
                <input
                  type="file"
                  id="boardFile"
                  style={{ display: "none" }}
                  onChange={addBoardFile}
                  multiple
                />
              </td>
            </tr>
            <tr>
              <th>첨부파일 목록</th>
              <td>
                <div className="board-file-wrap"></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default BoardFrm;
