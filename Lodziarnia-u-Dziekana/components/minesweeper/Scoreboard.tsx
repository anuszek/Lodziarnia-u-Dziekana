import { View, StyleSheet, Image, Pressable } from "react-native";

const digitSpritePositions = {
  0: { x: -128, y: -253 },
  1: { x: -128, y: -230},
  2: { x: -128, y: -207 },
  3: { x: -128, y: -184 },
  4: { x: -128, y: -161 },
  5: { x: -128, y: -138 },
  6: { x: -128, y: -115 },
  7: { x: -128, y: -92 },
  8: { x: -128, y: -69 },
  9: { x: -128, y: -46 },
  empty: { x: -128, y: -23 },
  "-": { x: -128, y: -0 },
};

const faceSpritePositions = {
  smile: { x: -232, y: -96 },
  pressed: { x: -232, y: -72 },
  dead: { x: -232, y: -48 },
  cool: { x: -232, y: -24 },
  smile_pressed: { x: -232, y: -0 },
};

type GameState = "playing" | "pressed" | "gameOver" | "gameWon";

interface ScoreboardProps {
  minesLeft: number;
  elapsedTime: number;
  gameState: GameState;
  onFacePress: () => void;
  size?: number;
}

export function Scoreboard({
  minesLeft,
  elapsedTime,
  gameState,
  onFacePress,
  size = 40,
}: ScoreboardProps) {

  const digitScale = size / 13; // Numbers are 13px wide
  const digitHeight = (size / 13) * 23; // Numbers are 23px tall
  const faceScale = size / 24; // Faces are 24x24px
  const faceSize = size * 1.5; // Keep face size same as input size

  const formatNumber = (num: number): string => {
    return num.toString().padStart(3, "0").slice(-3);
  };

  const renderDigit = (digit: string, index: number) => {
    const position =
      digitSpritePositions[digit as keyof typeof digitSpritePositions];
    if (!position) return null;

    return (
      <View key={index} style={[styles.digitContainer, { width: size, height: digitHeight}]}>
        <Image
          source={require("@/assets/images/minesweeper_sprites.png")}
          style={{
            width: 424 * digitScale,
            height: 672 * digitScale,
            position: 'absolute',
            left: position.x * digitScale,
            top: position.y * digitScale,
            backgroundColor: 'cyan',
          }}
          resizeMode="stretch"
        />
      </View>
    );
  };

  const renderFace = () => {
    let faceType: keyof typeof faceSpritePositions = "smile";

    switch (gameState) {
      case "pressed":
        faceType = "pressed";
        break;
      case "gameOver":
        faceType = "dead";
        break;
      case "gameWon":
        faceType = "cool";
        break;
      default:
        faceType = "smile";
    }

    const position = faceSpritePositions[faceType];
    const adjustedFaceScale = faceSize / 24;

    return (
      <Pressable onPress={onFacePress}>
        <View style={[styles.faceContainer, { width: faceSize, height: faceSize }]}>
          <Image
            source={require("@/assets/images/minesweeper_sprites.png")}
            style={{
              width: 424 * adjustedFaceScale,
              height: 672 * adjustedFaceScale,
              position: 'absolute',
              left: position.x * adjustedFaceScale,
              top: position.y * adjustedFaceScale,
            }}
            resizeMode="cover"
          />
        </View>
      </Pressable>
    );
  };

  const minesDisplay = formatNumber(Math.max(0, minesLeft));
  const timeDisplay = formatNumber(Math.min(999, elapsedTime));

  return (
    <View style={styles.scoreboard}>
      {/* Mine Counter */}
      <View style={styles.counterContainer}>
        <View style={styles.digitDisplay}>
          {minesDisplay
            .split("")
            .map((digit, index) => renderDigit(digit, index))}
        </View>
      </View>

      {/* Face Button */}
      <View style={styles.centerContainer}>{renderFace()}</View>

      {/* Timer */}
      <View style={styles.counterContainer}>
        <View style={styles.digitDisplay}>
          {timeDisplay
            .split("")
            .map((digit, index) => renderDigit(digit, index + 3))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scoreboard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#c0c0c0',
    borderWidth: 2,
    borderTopColor: '#ffffff',
    borderLeftColor: '#ffffff',
    borderBottomColor: '#808080',
    borderRightColor: '#808080',
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
    minWidth: 300,
  },
  counterContainer: {
    flex: 1,
    alignItems: 'center',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  digitDisplay: {
    flexDirection: 'row',
    backgroundColor: '#000000',
    borderWidth: 1,
    borderTopColor: '#808080',
    borderLeftColor: '#808080',
    borderBottomColor: '#ffffff',
    borderRightColor: '#ffffff',
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  digitContainer: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceContainer: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#c0c0c0',
  },
});
