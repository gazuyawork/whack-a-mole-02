import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Game from './Game';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<TopPage />} />
                    <Route path="/game" element={<Game />} />
                </Routes>
            </div>
        </Router>
    );
}

const TopPage = () => {
    return (
        <div>
            <h1 className="potta-one-regular">もぐらたたきゲーム</h1>
            <p className="potta-one-regular">ゲームモードを選択してください</p>
            <div className="mode-buttons">
                <Link to="/game?mode=easy" className="mode-button easy-button potta-one-regular">かんたん</Link>
                <Link to="/game?mode=medium" className="mode-button medium-button potta-one-regular">ふつう</Link>
                <Link to="/game?mode=hard" className="mode-button hard-button potta-one-regular">むずかしい</Link>
            </div>
        </div>
    );
};



export default App;
