import React from "react";
import { Text, View } from "react-native";

export function Cell({
  row,
  col,
  isOpen = false,
  isMine = false,
  isFlagged = false,
  adjacentMines = 0,
}: {
  row: number;
  col: number;
  isOpen?: boolean;
  isMine?: boolean;
  isFlagged?: boolean;
  adjacentMines?: number;
}) {
  return (
    <View
      style={{
        width: 40,
        height: 40,
        backgroundColor: isOpen ? (isMine ? "red" : "lightgray") : "darkgray",
        borderWidth: 1,
        borderColor: "black",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {isOpen && !isMine && adjacentMines > 0 && (
        <Text style={{ color: "black", fontSize: 16 }}>{adjacentMines}</Text>
      )}
      {isFlagged && <Text style={{ color: "blue", fontSize: 16 }}>🚩</Text>}
    </View>
  );
}
