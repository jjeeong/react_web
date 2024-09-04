import { Route, Routes } from "react-router-dom";
import BoardList from "./BoardList";
import "./board.css";
import BoardWrite from "./BoardWrite";

const BoardMain = () => {
  return (
    <Routes>
      <Route path="list" element={<BoardList />} />
      <Route path="write" element={<BoardWrite />} />
    </Routes>
  );
};
export default BoardMain;
