import { Image, StyleSheet, Text, View } from "react-native";

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
    <View style={styles.cell}>
      {!isOpen && !isFlagged && (
        <Image
          source={require("@/assets/images/minesweeper_sprites.png")}
          style={{
            width: 760 * (40 / 15), // scale sheet up so 15px = 40px
            height: 705 * (40 / 15),
            transform: [
              { translateX: -14.5 * (40 / 15) }, // scale offset
              { translateY: -194.3 * (40 / 15) },
            ],
          }}
          resizeMode="cover"
        />
      )}
      {isOpen && !isMine && adjacentMines > 0 && (
        <Text style={{ color: "black", fontSize: 16 }}>{adjacentMines}</Text>
      )}
      {/* {isFlagged && } */}
    </View>
  );
}

const styles = StyleSheet.create({
  cell: {
    width: 40, // display size
    height: 40,
    overflow: "hidden",
  },
});
