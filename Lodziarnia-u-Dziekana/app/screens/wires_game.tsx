import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  PanResponder,
  Dimensions,
  Alert,
} from "react-native";
import GlobalStyles from "@/styles/GlobalStyles";
import Svg, { Line, Circle, Image } from "react-native-svg";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get, set } from "firebase/database";

interface ConnectionPoint {
  id: string;
  color: string;
  x: number;
  y: number;
  connectedTo: string | null;
}

interface Wire {
  id: string;
  color: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  startPointId: string;
  endPointId?: string;
}

const { width, height } = Dimensions.get("window");

const COLORS: string[] = ["red", "blue", "yellow", "magenta"]; // Explicitly type

const POINT_SIZE: number = 35; // Size of the connection circles

function addPointsToUser(pointsToAdd: number, router: any) {
  const user = getAuth().currentUser;
  if (user) {
    const userRef = ref(getDatabase(), "users/" + user.uid + "/points");
    get(userRef).then((snapshot: any) => {
      const currentPoints = snapshot.val() || 0;
      set(userRef, currentPoints + pointsToAdd);
      Alert.alert("Gratulacje!", "Zdobyłeś " + pointsToAdd + " punktów!", [
        { text: "OK", onPress: () => {router.replace("/")} },
      ]);
      // router.dismissAll();
      // router.replace("/");
    });
  } else {
    return;
  }
}

export default function WiresGame() {
  const router = useRouter();
  const [wires, setWires] = useState<Wire[]>([]); // Explicitly type as Wire[]
  const [activeWire, setActiveWire] = useState<Wire | null>(null); // Explicitly type as Wire or null
  const [leftPoints, setLeftPoints] = useState<ConnectionPoint[]>([]); // Explicitly type as ConnectionPoint[]
  const [rightPoints, setRightPoints] = useState<ConnectionPoint[]>([]); // Explicitly type as ConnectionPoint[]
  const [connectedPairs, setConnectedPairs] = useState<Record<string, string>>(
    {}
  ); // {leftPointId: rightPointId}
  const [isSolved, setIsSolved] = useState<boolean>(false);

  const svgRef = useRef<Svg>(null); // Reference to the SVG component, explicitly type

  const convertToSVGCoords = (screenX: number, screenY: number) => {
    // Account for the View's centering and SVG positioning
    const puzzleAreaX = (width - width * 0.9) / 2; // Center offset
    const puzzleAreaY = height * 0.15; // Top offset (adjust based on your layout)

    return {
      x: screenX - puzzleAreaX,
      y: screenY - puzzleAreaY,
    };
  };

  const initializePoints = useCallback(() => {
    const shuffledColors = [...COLORS].sort(() => Math.random() - 0.5);
    const rightShuffledColors = [...shuffledColors].sort(
      () => Math.random() - 0.5
    );

    const svgWidth = width * 0.9;
    const svgHeight = height * 0.7;

    const topPadding = 50;
    const bottomPadding = 50;
    const usableHeight = svgHeight - topPadding - bottomPadding;

    const left: ConnectionPoint[] = shuffledColors.map((color, index) => ({
      id: `left-${index}`,
      color: color,
      x: svgWidth * 0.1,
      y: topPadding + (usableHeight / (COLORS.length - 1)) * index,
      connectedTo: null,
    }));

    const right: ConnectionPoint[] = rightShuffledColors.map(
      (color, index) => ({
        id: `right-${index}`,
        color: color,
        x: svgWidth * 0.9,
        y: topPadding + (usableHeight / (COLORS.length - 1)) * index,
        connectedTo: null,
      })
    );

    setLeftPoints(left);
    setRightPoints(right);
    setWires([]);
    setConnectedPairs({});
    setIsSolved(false);
  }, []);

  useEffect(() => {
    initializePoints();
  }, [initializePoints]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponder: (evt, gestureState) => true,

    onPanResponderGrant: (evt, gestureState) => {
      if (leftPoints.length === 0) {
        return;
      }

      const { pageX, pageY } = evt.nativeEvent;
      const svgCoords = convertToSVGCoords(pageX, pageY);

      const touchedLeftPoint = leftPoints.find((point) => {
        const distance = Math.sqrt(
          Math.pow(point.x - svgCoords.x, 2) +
            Math.pow(point.y - svgCoords.y, 2)
        );
        return distance < POINT_SIZE;
      });

      if (touchedLeftPoint && !touchedLeftPoint.connectedTo) {
        setActiveWire({
          id: `temp-${Date.now()}`,
          color: touchedLeftPoint.color,
          startX: touchedLeftPoint.x,
          startY: touchedLeftPoint.y,
          endX: svgCoords.x,
          endY: svgCoords.y,
          startPointId: touchedLeftPoint.id,
        });

        setWires((prevWires) =>
          prevWires.filter((wire) => wire.startPointId !== touchedLeftPoint.id)
        );
        setConnectedPairs((prevPairs) => {
          const newPairs = { ...prevPairs };
          for (const key in newPairs) {
            if (
              key === touchedLeftPoint.id ||
              newPairs[key] === touchedLeftPoint.id
            ) {
              delete newPairs[key];
            }
          }
          return newPairs;
        });
        setLeftPoints((prev) =>
          prev.map((p) =>
            p.id === touchedLeftPoint.id ? { ...p, connectedTo: null } : p
          )
        );
        setRightPoints((prev) =>
          prev.map((p) =>
            p.connectedTo === touchedLeftPoint.id
              ? { ...p, connectedTo: null }
              : p
          )
        );
      }
    },

    onPanResponderMove: (evt, gestureState) => {
      if (activeWire) {
        const { pageX, pageY } = evt.nativeEvent;
        const svgCoords = convertToSVGCoords(pageX, pageY);

        setActiveWire((prev) =>
          prev
            ? {
                ...prev,
                endX: svgCoords.x,
                endY: svgCoords.y,
              }
            : null
        );
      }
    },

    onPanResponderRelease: (evt, gestureState) => {
      if (activeWire) {
        const { pageX, pageY } = evt.nativeEvent;
        const svgCoords = convertToSVGCoords(pageX, pageY);

        const touchedRightPoint = rightPoints.find(
          (point) =>
            Math.abs(point.x - svgCoords.x) < POINT_SIZE &&
            Math.abs(point.y - svgCoords.y) < POINT_SIZE
        );

        if (touchedRightPoint && !touchedRightPoint.connectedTo) {
          const startPoint = leftPoints.find(
            (p) => p.id === activeWire.startPointId
          );

          if (startPoint && startPoint.color === touchedRightPoint.color) {
            const newWire: Wire = {
              id: `wire-${Date.now()}`,
              color: activeWire.color,
              startX: activeWire.startX,
              startY: activeWire.startY,
              endX: touchedRightPoint.x,
              endY: touchedRightPoint.y,
              startPointId: activeWire.startPointId,
              endPointId: touchedRightPoint.id,
            };

            setWires((prev) => [...prev, newWire]);
            setConnectedPairs((prev) => ({
              ...prev,
              [activeWire.startPointId]: touchedRightPoint.id,
            }));

            setLeftPoints((prev) =>
              prev.map((p) =>
                p.id === activeWire.startPointId
                  ? { ...p, connectedTo: touchedRightPoint.id }
                  : p
              )
            );
            setRightPoints((prev) =>
              prev.map((p) =>
                p.id === touchedRightPoint.id
                  ? { ...p, connectedTo: activeWire.startPointId }
                  : p
              )
            );
          }
        }

        setActiveWire(null);
      }
    },
  });

  useEffect(() => {
    if (
      wires.length === COLORS.length &&
      Object.keys(connectedPairs).length === COLORS.length
    ) {
      const allMatched = leftPoints.every((lp) => {
        const connectedRightPoint = rightPoints.find(
          (rp) => rp.id === lp.connectedTo
        );
        return connectedRightPoint && lp.color === connectedRightPoint.color;
      });
      setIsSolved(allMatched);
      if (allMatched) {
        addPointsToUser(5, router); // Award 5 points for solving the puzzle
      }
    } else {
      setIsSolved(false);
    }
  }, [wires, connectedPairs, leftPoints, rightPoints, router]);

  return (
    <View style={[GlobalStyles.container, { paddingTop: 100 }]}>
      <View style={styles.puzzleArea} {...panResponder.panHandlers}>
        <Svg height="100%" width="100%" ref={svgRef}>
          <Image
            x="0"
            y="0"
            width="100%"
            height="100%"
            href={require("@/assets/images/amogus/electricity_wiresBaseBack.png")}
            preserveAspectRatio="xMidYMid slice"
          />

          {leftPoints.map((point) => (
            <Circle
              key={point.id}
              cx={point.x}
              cy={point.y}
              r={POINT_SIZE / 2}
              fill={point.color}
              stroke="black"
              strokeWidth="5"
            />
          ))}

          {rightPoints.map((point) => (
            <Circle
              key={point.id}
              cx={point.x}
              cy={point.y}
              r={POINT_SIZE / 2}
              fill={point.color}
              stroke="black"
              strokeWidth="5"
            />
          ))}

          {wires.map((wire) => (
            <Line
              key={wire.id}
              x1={wire.startX}
              y1={wire.startY}
              x2={wire.endX}
              y2={wire.endY}
              stroke={wire.color}
              strokeWidth="8"
              strokeLinecap="round"
            />
          ))}

          {activeWire && (
            <Line
              x1={activeWire.startX}
              y1={activeWire.startY}
              x2={activeWire.endX}
              y2={activeWire.endY}
              stroke={activeWire.color}
              strokeWidth="8"
              strokeLinecap="round"
              // fill={activeWire.color}
              // strokeDasharray="5,5"
            />
          )}
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  puzzleArea: {
    width: width * 0.9,
    height: height * 0.7,
    backgroundColor: "#222",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#555",
    overflow: "hidden",
  },
  solvedText: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 20,
  },
});
