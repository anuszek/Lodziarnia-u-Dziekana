import { Cell } from "@/components/minesweeper/Cell";
import React from "react";
import { Text, View } from "react-native";

export default function MinesweeperScreen() {
  return (
    <View>
      <Text style={{ fontSize: 24, textAlign: "center", marginVertical: 20 }}>
        Minesweeper
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", width: 300 }}>
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
