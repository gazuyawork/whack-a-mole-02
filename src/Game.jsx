import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Game.css';
import { useLocation } from 'react-router-dom';

const NUM_MOLES = 9; // 穴の数

function Game() {
    const [moles, setMoles] = useState(Array(NUM_MOLES).fill(false));
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const lacation = useLocation();
    const searchParams = new URLSearchParams(lacation.search);
    const mode = searchParams.get('mode');

    let moleInterval = 1000;
    if (mode === 'medium') moleInterval = 700;
    if (mode === 'hard') moleInterval = 500;

    useEffect(() => {
        const interval = setInterval(() => {
            const newMoles = moles.map(() => Math.random() < 0.3);
            setMoles(newMoles);
        }, moleInterval);
        return () => clearInterval(interval);
    }, [moles]);

    const handleClick = (index) => {
        if (moles[index]) {
            setScore(score + 1);
            const newMoles = [...moles];
            newMoles[index] = false;
            setMoles(newMoles);
        }
    }

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            alert('ゲームオーバー！\nスコア：' + score);
        }
    }, [timeLeft]);


    useEffect(() => {
        if (timeLeft === 0) {
            setMoles(Array(9).fill(false)); // 全てのモグラを非表示
            alert(`ゲームオーバー！最終スコアは ${score} です。`);
        }
    }, [timeLeft]);
    
    const resetGame = () => {
        setScore(0);
        setTimeLeft(30); // タイマーをリセット
        setMoles(Array(9).fill(false)); // モグラをリセット
    };


    return (
        <div className="Game">
            <h1>スコ：{score}</h1>
            <h2>残り時間：{timeLeft}秒</h2>
            <div className="mole-grid">
                {moles.map((mole, index) => (
                <div key={index} className="hole" onClick={ () => handleClick(index) }>
                    {mole && (
                    <motion.img
                        src="/images/mole.png"
                        alt="mole"
                        className="mole"
                        initial={{ y: 15, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    />
                    )}
                </div>
                ))}
            </div>
            <button onClick={resetGame}>リセット</button>
        </div>
    );
}

export default Game;