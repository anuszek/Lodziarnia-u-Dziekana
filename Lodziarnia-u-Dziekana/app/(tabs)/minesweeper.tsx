import { Cell } from "@/components/minesweeper/Cell";
import { Text, View, StyleSheet } from "react-native";

export default function MinesweeperScreen() {
  return (
    <View>
      <Text style={{ fontSize: 24, textAlign: "center", marginVertical: 20 }}>
        Minesweeper
      </Text>
      <View style={styles.board}>
        {Array.from({ length: 10 }, (_, row) =>
          Array.from({ length: 10 }, (_, col) => (
            <Cell key={`${row}-${col}`} {...createCell(row, col)} />
          ))
        )}
      </View>
    </View>
  );
}

function createCell(row: number, col: number) {
  return {
    row,
    col,
    isOpen: false,
    isMine: false,
    isFlagged: false,
    adjacentMines: 0,
  };
}

const styles = StyleSheet.create({
  board: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
  },
});