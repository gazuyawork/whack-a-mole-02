import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Game.css';
import { useNavigate, useLocation } from 'react-router-dom';

// const NUM_MOLES = 9; // 穴の数

function Game() {
    // React Routerの機能を使用してURLのクエリパラメータからモードを取得
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const gridSize = parseInt(searchParams.get('size')) || 2; // デフォルト値は2（2x2グリッド）
    const numMoles = gridSize * gridSize;  // グリッド全体の穴の数    
    const mode = searchParams.get('mode') || 'easy'; // デフォルト値はeasy

    // ゲームの状態管理用のステート
    const [moles, setMoles] = useState(Array(numMoles).fill(false));
    const [moleTypes, setMoleTypes] = useState(Array(numMoles).fill(null));
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [gameStarted, setGameStarted] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const [showCountdown, setShowCountdown] = useState(true);
    const [showResetOverlay, setShowResetOverlay] = useState(false);
    const [showScoreOverlay, setShowScoreOvelay] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    // モグラの画像のパス
    const moleImages = [
        '/images/mole.png',
        '/images/mole1.png',
        // '/images/mole2.png',
        '/images/mole3.png',
        '/images/mole4.png',
        '/images/mole5.png',
        '/images/mole6.png',
        '/images/mole7.png',
    ];
    

    // ゲームモードに応じたモグラ出現のインターバル設定
    let moleInterval = 1000;
    if (mode === 'medium') moleInterval = 700;
    if (mode === 'hard') moleInterval = 500;

    const navigate = useNavigate(); // React Routerのナビゲート機能を使用

    // ゲームのスコアやタイマーをリセットする関数
    const resetGame = () => {
        setScore(0);
        setTimeLeft(30); // タイマーをリセット
        setMoles(Array(numMoles).fill(false)); // モグラをリセット
    };

    // カウントダウンを開始するuseEffect
    useEffect(() => {
        if (showCountdown) {
            const countdownInterval = setInterval(() => {
                setCountdown((prevCountdown) => {
                    if (prevCountdown <= 1) {
                        clearInterval(countdownInterval);
                        setShowCountdown(false); // カウントダウンを非表示にする
                        setGameStarted(true); // ゲームを開始する
                        return 0; // カウントダウンを0にして終了
                    }
                    return prevCountdown - 1; // カウントダウンを1ずつ減らす
                });
            }, 1000);

            return () => clearInterval(countdownInterval);
        }
    }, [showCountdown]); 

    // ゲームを一時停止し、リセットオーバーレイを表示
    const handleReset = () => {
        setIsPaused(true);  // ゲームを一時停止
        setShowResetOverlay(true);  // リセットオーバーレイを表示
    };

    const handleContinue = () => {
        setCountdown(3); // カウントダウンをリセット
        setShowCountdown(true);  // カウントダウンの表示を開始
        setShowResetOverlay(false);  // リセットオーバーレイを非表示にする
        setIsPaused(false);  // ゲームを再開
    };

    const handleOneceContinue = () => {
        setCountdown(3); // カウントダウンをリセット
        setShowCountdown(true);  // カウントダウンの表示を開始
        setShowScoreOvelay(false);  // スコア表示オーバーレイを非表示にする
        resetGame();  // ゲームをリセット
        setIsPaused(false);  // ゲームを再開
    };

    // Top画面に戻る関数
    const handleGoToTop = () => {
        setShowResetOverlay(false);
        navigate('/');  // Top画面に戻る
    };

    // モグラをクリックした時のスコア加算処理
    // const handleClick = (index) => {
    //     if (moles[index]) {
    //         setScore(score + 1);
    //         const newMoles = [...moles];
    //         newMoles[index] = false;
    //         setMoles(newMoles);
    //     }
    // };

    // モグラをクリックした時のスコア加算処理
    const handleClick = (index) => {
        if (moles[index]) {
            setScore(score + 1);

            // バイブレーションを実行（50msのバイブレーション）
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }

            const newMoles = [...moles];
            newMoles[index] = false;
            setMoles(newMoles);
        }
    };





    // ゲームが開始されたら、モグラの出現を制御
    useEffect(() => {
        if (gameStarted) {
            const interval = setInterval(() => {
                const newMoles = moles.map(() => Math.random() < 0.3);

                const newMoleTypes = newMoles.map((isMoleVisible, index) => {
                    return isMoleVisible ? moleImages[Math.floor(Math.random() * moleImages.length)] : null;
                });
                setMoles(newMoles);
                setMoleTypes(newMoleTypes);

                // setMoles(newMoles);
            }, moleInterval);
            return () => clearInterval(interval);
        }
    }, [gameStarted]);









    // タイマーのカウントダウンを制御
    useEffect(() => {
        if (gameStarted && timeLeft > 0 && !isPaused && !showCountdown) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0) {
            setShowScoreOvelay(true);  // タイムアップ時にスコア表示オーバーレイを表示
        }
    }, [timeLeft, gameStarted, isPaused, showCountdown]);

    return (
        <div className="Game potta-one-regular">

            {/* カウントダウン表示 */}
            {showCountdown && (
                <div className="overlay">
                    <h1 className="countdown">{countdown}</h1>
                </div>
            )}

            {/* リセットオーバーレイ */}
            {showResetOverlay && (
                <div className="overlay">
                    <button onClick={handleGoToTop} className="potta-one-regular">Top画面に戻る</button>
                    <button onClick={handleContinue} className="potta-one-regular">コンテニュー</button>
                </div>
            )}

            {/* スコア表示オーバーレイ */}
            {showScoreOverlay && (
                <div className="overlay">
                    <h2 className="timeup">タイムアップ！</h2>
                    <h3 className="end-score">スコア: <span className="end-score-num">{score}</span></h3>
                    <button onClick={handleGoToTop} className="potta-one-regular">Top画面に戻る</button>
                    <button onClick={handleOneceContinue} className="potta-one-regular">もう一度</button>
                </div>
            )}

            {/* ゲーム情報表示 */}
            <h1>残り時間：{timeLeft}秒</h1>
            <h2>スコア：{score}</h2>

            {/* モグラが表示されるグリッド */}
            <div className="mole-grid" style={{
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                gridTemplateRows: `repeat(${gridSize}, 1fr)`
            }}>
                {moles.map((mole, index) => (
                    <div key={index} className="hole" onClick={() => handleClick(index)}>
                        {mole && (
                            <motion.img
                                // src="/images/mole.png"
                                src={moleTypes[index]} // ランダムに選ばれたモグラの種類を表示
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


            {/* ゲームを一時停止するためのボタン */}
            <button onClick={handleReset} className="stop-button potta-one-regular">ストップ</button>
        </div>
    );
}

export default Game;
