import { Route, Routes } from "react-router-dom";
import Footer from "./components/common/Footer";
import Header from "./components/common/Header";
import Main from "./components/common/Main";
import Join from "./components/member/Join";

function App() {
  return (
    <div className="wrap">
      <Header />
      <main className="content">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/join" element={<Join />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
