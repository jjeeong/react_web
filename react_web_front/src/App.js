import { Route, Routes } from "react-router-dom";
import Footer from "./components/common/Footer";
import Header from "./components/common/Header";
import Main from "./components/common/Main";

function App() {
  return (
    <div className="wrap">
      <Header />
      <main className="content">
        <Routes>
          <Route path="/" element={<Main />}></Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
