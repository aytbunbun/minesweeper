import type { MouseEvent } from 'react';
import { useState } from 'react';
import styles from './index.module.css';

const Home = () => {
  const directions = [
    [-1, 0],
    [-1, -1],
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
  ];
  // 0 => 未クリック
  // 1 => 左クリック
  // 2 => はてな
  // 3 => 旗
  const [userInputs, setUserInputs] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const bombCount = 10;
  // 0 => ボム無し
  // 1 => ボム有り
  const [bombMap, setBombMap] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const newUserInputs: number[][] = JSON.parse(JSON.stringify(userInputs));
  let gameState: 0 | 1 | 2 = 0;
  // 0 => ゲーム中
  // 1 => 成功
  // 2 => 失敗

  let openedCount = 0;
  for (let l = 0; l < 9; l++) {
    for (let m = 0; m < 9; m++) {
      if (userInputs[l][m] === 1) {
        openedCount++;
      }
    }
  }
  let isStarted: boolean;
  if (newUserInputs.some((row: number[]) => row.includes(1))) {
    isStarted = true;
    gameState = 0;
  } else {
    isStarted = false;
  }

  const board: number[][] = Array.from({ length: 9 }, () => Array(9).fill(-1));
  // -1 => 石
  // 0 => 画像無しセル
  // 1~8 => 数字セル
  // 9 => 石＋はてな
  // 10 => 石＋旗
  // 11 => ポムセル
  const setBombRandom = (x: number, y: number) => {
    const numA = Math.floor(9 * Math.random());
    const numB = Math.floor(9 * Math.random());
    if (numA === x && numB === y) {
      setBombRandom(x, y);
    } else if (bombMap[numA][numB] === 0) {
      bombMap[numA][numB] = 1;
      setBombMap(bombMap);
    } else {
      setBombRandom(x, y);
    }
  };
  const addZeroAroundZero = (x: number, y: number) => {
    const checkAround = (x: number, y: number) => {
      if (board[x][y] === 0) {
        for (let i = 0; i < directions.length; i++) {
          const checkX = x + directions[i][0];
          const checkY = y + directions[i][1];
          if (checkX < 0 || checkX > 8 || checkY < 0 || checkY > 8) {
            continue;
          }
          if (newInputs[checkX][checkY] === 0) {
            if (bombMap[checkX][checkY] === 0) {
              newInputs[checkX][checkY] = 1;
              reloadBoard();
              checkAround(checkX, checkY);
            }
          }
        }
      }
    };

    if (bombMap[x][y] === 1) return;
    const newInputs = [...userInputs];

    checkAround(x, y);

    setUserInputs([...newInputs]);
  };
  const endGameByRefuse = () => {
    if (openedCount === 81 - bombCount) {
      gameState = 1;
    }
  };

  const endGameByBomb = () => {
    gameState = 2;
  };
  const reloadBoard = () => {
    for (let l = 0; l < 9; l++) {
      for (let m = 0; m < 9; m++) {
        if (userInputs[l][m] === 1) {
          if (bombMap[l][m] === 1) {
            board[l][m] = 11;
            for (let i = 0; i < 9; i++) {
              for (let j = 0; j < 9; j++) {
                if (bombMap[i][j] === 1) {
                  board[i][j] = 11;
                }
              }
            }
            endGameByBomb();
            continue;
          }
          if (userInputs[l][m] === 9) {
            board[l][m] = 9;
            continue;
          } else if (userInputs[l][m] === 10) {
            board[l][m] = 10;
            continue;
          }
          let tempCount = 0;
          for (let n = 0; n < directions.length; n++) {
            const tempX = l + directions[n][0];
            const tempY = m + directions[n][1];
            if (tempX < 0 || tempX > 8 || tempY < 0 || tempY > 8) {
              continue;
            }
            if (bombMap[tempX][tempY] === 1) {
              tempCount++;
            }
          }
          board[l][m] = tempCount;
        }
      }
    }
    endGameByRefuse();
  };

  const reset = () => {
    setUserInputs([
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]);
    setBombMap([
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]);
    gameState = 0;
  };
  const openNearTile = (x: number, y: number) => {
    const tempInputs: number[][] = Array.from({ length: 9 }, () => Array(9).fill(0));
    const nearBombCount = board[x][y];
    let nearFlagCount = 0;
    for (let i = 0; i < 8; i++) {
      const tempX = x + directions[i][0];
      const tempY = y + directions[i][1];
      if (tempX < 0 || tempX > 8 || tempY < 0 || tempY > 8) {
        continue;
      }
      if (userInputs[tempX][tempY] === 10) {
        nearFlagCount++;
      } else if (userInputs[tempX][tempY] === 0) {
        tempInputs[tempX][tempY] = 1;
      }
    }

    if (nearBombCount !== nearFlagCount) {
      return;
    }
    const newInputs = [...userInputs];
    for (let l = 0; l < 9; l++) {
      for (let m = 0; m < 9; m++) {
        if (tempInputs[l][m] === 1) {
          newInputs[l][m] = 1;
        }
        setUserInputs([...newInputs]);
        reloadBoard();
      }
    }
    for (let l = 0; l < 9; l++) {
      for (let m = 0; m < 9; m++) {
        if (board[l][m] === 0) {
          addZeroAroundZero(l, m);
        }
      }
    }
  };

  const clickCell = (x: number, y: number, event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (userInputs[y][x] === 9 || userInputs[y][x] === 10 || gameState === 1 || gameState === 2) {
      return;
    }
    if (userInputs[y][x] === 1) {
      openNearTile(y, x);

      return;
    }
    if (!isStarted) {
      for (let i = 0; i < bombCount; i++) {
        setBombRandom(y, x);
      }
    }
    const newInputs = [...userInputs];
    newInputs[y][x] = 1;
    setUserInputs(newInputs);
    reloadBoard();
    if (board[y][x] === 0) {
      addZeroAroundZero(y, x);
    }
  };
  const rightClickCell = (x: number, y: number, event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (gameState === 1 || gameState === 2) {
      return;
    }
    const newInputs = [...userInputs];
    if (userInputs[y][x] === 10) {
      newInputs[y][x] = 9;
    } else if (userInputs[y][x] === 9) {
      newInputs[y][x] = 0;
    } else if (userInputs[y][x] !== 0) {
      return;
    } else {
      newInputs[y][x] = 10;
    }
    setUserInputs(newInputs);
    reloadBoard();
  };

  reloadBoard();

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        <header className={styles.header}>
          <button
            className={styles['reset-button']}
            onClick={reset}
            style={{ backgroundPosition: gameState === 0 ? 96 : 97 - 33 * gameState }}
          />
        </header>
        <div className={styles.main}>
          {board.map((row, y) =>
            row.map((cell, x) => (
              <div
                className={styles.cell}
                key={`${x}-${y}`}
                onClick={(event) => clickCell(x, y, event)}
                onContextMenu={(event) => rightClickCell(x, y, event)}
              >
                {cell !== 0 && (
                  <div
                    className={styles.tile}
                    style={{ backgroundPosition: -30 * (board[y][x] - 1) }}
                  >
                    {cell === 0 && <div className={styles.tile} />}
                    {(userInputs[y][x] === 0 ||
                      userInputs[y][x] === 9 ||
                      userInputs[y][x] === 10) && (
                      <div className={styles.stone}>
                        {(userInputs[y][x] === 9 || userInputs[y][x] === 10) && (
                          <div
                            className={styles.flag}
                            style={{ backgroundPosition: -30 * (userInputs[y][x] - 1) }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
export default Home;
