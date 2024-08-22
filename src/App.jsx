import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Game from './Game';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

    const [gridSize, setGridSize] = useState(2); // 初期値を2（2*2）に設定
    const [difficulty, setDifficulty] = useState('easy'); // 難易度の初期値を設定
    const navigate = useNavigate();

    const handleSliderChange = (event) => {
        setGridSize(Number(event.target.value));
    };

    const handleDifficultyChange = (event) => {
        setDifficulty(event.target.value);
    };

    const handleStartGame = () => {
        navigate(`/game?size=${gridSize}&mode=${difficulty}`);
    };


    return (
        <div>
            <h1 className="game-title potta-one-regular">もぐらたたきゲーム</h1>

            <p className="potta-one-regular">穴の数を選択してください</p>
            <input 
                type="range" 
                min="2" 
                max="5" 
                value={gridSize} 
                onChange={handleSliderChange} 
            />
            <p className="select-size potta-one-regular">選択されたサイズ: {gridSize}x{gridSize}</p>

            <p className="potta-one-regular">ゲームモードを選択してください</p>
            <div className="difficulty-buttons potta-one-regular">
                <label className={`radio-button ${difficulty === 'easy' ? 'easy-selected' : ''}`}>
                    <input 
                        type="radio" 
                        value="easy" 
                        checked={difficulty === 'easy'} 
                        onChange={handleDifficultyChange} 
                    />
                    かんたん
                </label>
                <label className={`radio-button ${difficulty === 'medium' ? 'medium-selected' : ''}`}>
                    <input 
                        type="radio" 
                        value="medium" 
                        checked={difficulty === 'medium'} 
                        onChange={handleDifficultyChange} 
                    />
                    ふつう
                </label>
                <label className={`radio-button ${difficulty === 'hard' ? 'hard-selected' : ''}`}>
                    <input 
                        type="radio" 
                        value="hard" 
                        checked={difficulty === 'hard'} 
                        onChange={handleDifficultyChange} 
                    />
                    むずかしい
                </label>
            </div>


            <button onClick={handleStartGame} className="potta-one-regular">ゲームスタート</button>
        </div>
    );
};



export default App;
