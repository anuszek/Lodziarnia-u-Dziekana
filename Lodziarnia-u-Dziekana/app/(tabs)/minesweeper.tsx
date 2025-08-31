import { Cell } from "@/components/minesweeper/Cell";
import { Scoreboard } from "@/components/minesweeper/Scoreboard";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import { useState, useEffect, useRef } from "react";

const GRID_SIZE = 10;
const MINE_COUNT = 10;
const { width: screenWidth } = Dimensions.get("window");

type CellData = {
  row: number;
  col: number;
  isOpen: boolean;
  isMine: boolean;
  isFlagged: boolean;
  adjacentMines: number;
  isClickedMine?: boolean;
};

export default function Minesweeper() {
  const boardPadding = 20;
  const availableWidth = screenWidth - boardPadding * 2;
  const cellSize = Math.floor(availableWidth / GRID_SIZE);

  const [time, setTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameState, setGameState] = useState<
    "playing" | "pressed" | "gameOver" | "gameWon"
  >("playing");
  const [minesLeft, setMinesLeft] = useState(MINE_COUNT);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [board, setBoard] = useState<CellData[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    if (gameStarted && gameState === "playing" && !gameOver && !gameWon) {
      timerRef.current = setInterval(() => {
        setTime((prev) => Math.min(999, prev + 1));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStarted, gameState, gameOver, gameWon]);

  useEffect(() => {
    if (gameOver) {
      setGameState("gameOver");
    } else if (gameWon) {
      setGameState("gameWon");
    } else {
      setGameState("playing");
    }
  }, [gameOver, gameWon]);

  useEffect(() => {
    initializeBoard();
  }, []);

  const initializeBoard = () => {
    const newBoard: CellData[][] = Array.from({ length: GRID_SIZE }, (_, row) =>
      Array.from({ length: GRID_SIZE }, (_, col) => ({
        row,
        col,
        isOpen: false,
        isMine: false,
        isFlagged: false,
        adjacentMines: 0,
      }))
    );

    // Place mines randomly
    const minePositions = new Set<string>();
    while (minePositions.size < MINE_COUNT) {
      const row = Math.floor(Math.random() * GRID_SIZE);
      const col = Math.floor(Math.random() * GRID_SIZE);
      minePositions.add(`${row},${col}`);
    }

    // Set mines
    minePositions.forEach((pos) => {
      const [row, col] = pos.split(",").map(Number);
      newBoard[row][col].isMine = true;
    });

    // Calculate adjacent mines
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (!newBoard[row][col].isMine) {
          newBoard[row][col].adjacentMines = countAdjacentMines(
            newBoard,
            row,
            col
          );
        }
      }
    }

    setBoard(newBoard);

    setTime(0);
    setGameStarted(false);
    setGameState("playing");
    setMinesLeft(MINE_COUNT);
    setGameOver(false);
    setGameWon(false);
  };

  const countAdjacentMines = (
    board: CellData[][],
    row: number,
    col: number
  ): number => {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const newRow = row + i;
        const newCol = col + j;
        if (
          newRow >= 0 &&
          newRow < GRID_SIZE &&
          newCol >= 0 &&
          newCol < GRID_SIZE
        ) {
          if (board[newRow][newCol].isMine) count++;
        }
      }
    }
    return count;
  };

  const handleCellPress = (row: number, col: number) => {
    if (
      gameOver ||
      gameWon ||
      board[row][col].isFlagged ||
      board[row][col].isOpen
    )
      return;

    if (!gameStarted) {
      setGameStarted(true);
    }

    const newBoard = [...board];

    if (newBoard[row][col].isMine) {
      // Mark this mine as the clicked one
      newBoard[row][col].isClickedMine = true;

      // Game over - reveal all mines
      for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
          if (newBoard[i][j].isMine) {
            newBoard[i][j].isOpen = true;
          }
        }
      }
      setGameOver(true);
    } else {
      // Open cell and adjacent empty cells
      openCell(newBoard, row, col);
      checkWinCondition(newBoard);
    }

    setBoard(newBoard);
  };

  const handleCellLongPress = (row: number, col: number) => {
    if (gameOver || gameWon || board[row][col].isOpen) return;

    const newBoard = [...board];
    const wasFlagged = newBoard[row][col].isFlagged;
    newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;

    setMinesLeft((prev) => (wasFlagged ? prev + 1 : prev - 1));

    setBoard(newBoard);
  };

  const openCell = (board: CellData[][], row: number, col: number) => {
    if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) return;
    if (
      board[row][col].isOpen ||
      board[row][col].isFlagged ||
      board[row][col].isMine
    )
      return;

    board[row][col].isOpen = true;

    // If cell has no adjacent mines, open surrounding cells
    if (board[row][col].adjacentMines === 0) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          openCell(board, row + i, col + j);
        }
      }
    }
  };

  const checkWinCondition = (board: CellData[][]) => {
    let closedNonMines = 0;
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (!board[i][j].isOpen && !board[i][j].isMine) {
          closedNonMines++;
        }
      }
    }
    if (closedNonMines === 0) {
      setGameWon(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minesweeper</Text>

      <Scoreboard
        minesLeft={minesLeft}
        elapsedTime={time}
        gameState={gameState}
        onFacePress={initializeBoard}
        size={cellSize * 0.8}
      />

      <View style={[styles.board, { width: cellSize * GRID_SIZE }]}>
        {board.flat().map((cell) => (
          <Cell
            key={`${cell.row}-${cell.col}`}
            {...cell}
            size={cellSize}
            onPress={handleCellPress}
            onLongPress={handleCellLongPress}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginVertical: 20,
  },
  gameStatusButton: {
    backgroundColor: "#ff6b6b",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  gameStatusText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  board: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
});
