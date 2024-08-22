import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Game.css';
import { useLocation } from 'react-router-dom';


import { useNavigate } from 'react-router-dom';



const NUM_MOLES = 9; // 穴の数

function Game() {
    const lacation = useLocation();
    const searchParams = new URLSearchParams(lacation.search);
    const mode = searchParams.get('mode');
    const [moles, setMoles] = useState(Array(NUM_MOLES).fill(false));
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [gameStarted, setGameStarted] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const [showCountdown, setShowCountdown] = useState(false);
    const [showResetOverlay, setShowResetOverlay] = useState(false);  // リセットオーバーレイの表示状態を管理
    const [showScoreOverlay, setShowScoreOvelay] = useState(false); // スコア表示用のオーバーレイ
    const [isPaused, setIsPaused] = useState(false);  // ゲームが一時停止されているかどうかを管理

    const handleReset = () => {
        setIsPaused(true);  // ゲームを一時停止
        setShowResetOverlay(true);  // リセットオーバーレイを表示
    };
    
    const handleContinue = () => {
        setShowCountdown(true);  // カウントダウンの表示を開始
        setShowResetOverlay(false);  // リセットオーバーレイを非表示にする
    
        const countdownInterval = setInterval(() => {
            setCountdown((prevCountdown) => {
                if (prevCountdown === 1) {
                    clearInterval(countdownInterval);
                    setShowCountdown(false);  // カウントダウンを非表示にする
                    setIsPaused(false);  // ゲームを再開
                    return 3;  // カウントダウンをリセット
                }
                return prevCountdown - 1;
            });
        }, 1000);  // 1秒ごとにカウントダウン
    };
    
    const navigate = useNavigate();
    
    const handleGoToTop = () => {
        setShowResetOverlay(false);
        navigate('/');  // Top画面に戻る
    };
    
    let moleInterval = 1000;
    if (mode === 'medium') moleInterval = 700;
    if (mode === 'hard') moleInterval = 500;

    const handleClick = (index) => {
        if (moles[index]) {
            setScore(score + 1);
            const newMoles = [...moles];
            newMoles[index] = false;
            setMoles(newMoles);
        }
    }

    useEffect(() => {
        if (gameStarted) {
            const interval = setInterval(() => {
            const newMoles = moles.map(() => Math.random() < 0.3);
            setMoles(newMoles);
        }, 1000);
        return () => clearInterval(interval);
        }
    }, [gameStarted]);
    
    useEffect(() => {
        if (gameStarted && timeLeft > 0 && !isPaused) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0) {
            // alert('ゲームオーバー！\nスコア：' + score);
            setShowScoreOvelay(true);
        }
    }, [timeLeft, gameStarted, isPaused]);

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


    const startCountdown = () => {
        setShowCountdown(true);
        const countdownInterval = setInterval(() => {
            setCountdown((prevCountdown) => {
                if (prevCountdown === 1) {
                    clearInterval(countdownInterval);
                    setShowCountdown(false);
                    setGameStarted(true);
                    return 3;
                }
                return prevCountdown - 1;
            });
        }, 1000);
    };

    return (
        <div className="Game potta-one-regular">
            {!gameStarted && !showCountdown && (
                <div className="overlay">
                <button className="start-button potta-one-regular" onClick={startCountdown}>ゲームスタート</button>
                </div>
            )}
            {showCountdown && (
                <div className="overlay">
                <h1 className="countdown">{countdown}</h1>
                </div>
            )}

            {/* リセットオーバーレイ */}
            {showResetOverlay && (
            <div className="overlay">
                <button onClick={handleGoToTop}>Top画面に戻る</button>
                <button onClick={handleContinue}>コンテニュー</button>
            </div>
            )}

            {/* スコア表示オーバーレイ */}
            {showScoreOverlay && (
            <div className="overlay">
                <h2>ゲームオーバー！</h2>
                <h3>スコア: {score}</h3>
                <button onClick={handleGoToTop}>Top画面に戻る</button>
                <button onClick={handleContinue}>リトライ</button>
            </div>
            )}

            <h1>残り時間：{timeLeft}秒</h1>
            <h2>スコア：{score}</h2>
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
            <button onClick={handleReset} className="reset-button potta-one-regular">リセット</button>
        </div>
    );
}

export default Game;