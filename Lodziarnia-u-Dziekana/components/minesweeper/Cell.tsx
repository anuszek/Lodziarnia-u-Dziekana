import { Image, StyleSheet, Pressable } from "react-native";

const numberSpritePositions = {
  1: { x: -0, y: -641 },
  2: { x: -0, y: -626 },
  3: { x: -0, y: -611 },
  4: { x: -0, y: -595 },
  5: { x: -0, y: -581 },
  6: { x: -0, y: -566 },
  7: { x: -0, y: -551 },
  8: { x: -0, y: -536 },
};
const defaultSpritePosition = { x: -0, y: -0 };
const openEmptySpritePosition =  { x: -0, y: -656 };
const flagSpritePosition = { x: -128, y: -625 };
const mineSpritePosition = { x: -128, y: -657 };
const mineClickedSpritePosition = { x: -128, y: -640 };

export function Cell({
  row,
  col,
  isOpen = false,
  isMine = false,
  isFlagged = false,
  adjacentMines = 0,
  isClickedMine = false,
  size = 40,
  onPress,
  onLongPress,
}: {
  row: number;
  col: number;
  isOpen?: boolean;
  isMine?: boolean;
  isFlagged?: boolean;
  adjacentMines?: number;
  isClickedMine?: boolean;
  size?: number;
  onPress?: (row: number, col: number) => void;
  onLongPress?: (row: number, col: number) => void;
}) {
 
  const spriteScale = size / 15; // sprite size is 15px

  return (
    <Pressable
     style={[styles.cell, { width: size, height: size }]}
     onPress={() => onPress?.(row, col)}
     onLongPress={() => onLongPress?.(row, col)}
     >
      {/* Closed cell */}
      {!isOpen && !isFlagged && (
        <Image
          source={require("@/assets/images/minesweeper_sprites.png")}
          style={{
            width: 424 * spriteScale,
            height: 672 * spriteScale,
            transform: [
              { translateX: defaultSpritePosition.x * spriteScale }, // scale offset
              { translateY: defaultSpritePosition.y * spriteScale },
            ],
          }}
          resizeMode="cover"
        />
      )}

      {/* Flagged cell */}
      {!isOpen && isFlagged && (
        <Image
          source={require("@/assets/images/minesweeper_sprites.png")}
          style={{
            width: 424 * spriteScale,
            height: 672 * spriteScale,
            transform: [
              { translateX: flagSpritePosition.x * spriteScale },
              { translateY: flagSpritePosition.y * spriteScale },
            ],
          }}
          resizeMode="cover"
        />
      )}

      {/* Clicked mine */}
      {isOpen && isMine && isClickedMine && (
        <Image
          source={require("@/assets/images/minesweeper_sprites.png")}
          style={{
            width: 424 * spriteScale,
            height: 672 * spriteScale,
            transform: [
              { translateX: mineClickedSpritePosition.x * spriteScale },
              { translateY: mineClickedSpritePosition.y * spriteScale },
            ],
          }}
          resizeMode="cover"
        />
      )}

      {/* Mine */}
      {isOpen && isMine && (
        <Image
          source={require("@/assets/images/minesweeper_sprites.png")}
          style={{
            width: 424 * spriteScale,
            height: 672 * spriteScale,
            transform: [
              { translateX: mineSpritePosition.x * spriteScale },
              { translateY: mineSpritePosition.y * spriteScale },
            ],
          }}
          resizeMode="cover"
        />
      )}

      {/* Empty cell*/}
    {isOpen && !isMine && adjacentMines === 0 && (
      <Image
        source={require("@/assets/images/minesweeper_sprites.png")}
        style={{
          width: 424 * spriteScale,
          height: 672 * spriteScale,
          transform: [
            { translateX: openEmptySpritePosition.x * spriteScale },
            { translateY: openEmptySpritePosition.y * spriteScale },
          ],
        }}
        resizeMode="cover"
      />
    )}

      {/* Number */}
      {isOpen && !isMine && adjacentMines > 0 && (
        <Image
          source={require("@/assets/images/minesweeper_sprites.png")}
          style={{
            width: 424 * spriteScale,
            height: 672 * spriteScale,
            transform: [
              { translateX: numberSpritePositions[adjacentMines as keyof typeof numberSpritePositions].x * spriteScale },
              { translateY: numberSpritePositions[adjacentMines as keyof typeof numberSpritePositions].y * spriteScale },
            ],
          }}
          resizeMode="cover"
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    overflow: "hidden",
  },
});
