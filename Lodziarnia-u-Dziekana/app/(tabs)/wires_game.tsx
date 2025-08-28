import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, PanResponder, Dimensions, Text, TouchableOpacity } from 'react-native';
import Svg, { Line, Circle } from 'react-native-svg';

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

const { width, height } = Dimensions.get('window');

export default function WiresGame() {

  const [wires, setWires] = useState<Wire[]>([]); // Explicitly type as Wire[]
  const [activeWire, setActiveWire] = useState<Wire | null>(null); // Explicitly type as Wire or null
  const [leftPoints, setLeftPoints] = useState<ConnectionPoint[]>([]); // Explicitly type as ConnectionPoint[]
  const [rightPoints, setRightPoints] = useState<ConnectionPoint[]>([]); // Explicitly type as ConnectionPoint[]
  const [connectedPairs, setConnectedPairs] = useState<Record<string, string>>({}); // {leftPointId: rightPointId}
  const [isSolved, setIsSolved] = useState<boolean>(false);

  const svgRef = useRef<Svg>(null); // Reference to the SVG component, explicitly type

  // Define colors for the wires and points
  const COLORS: string[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange']; // Explicitly type

  const POINT_SIZE: number = 20; // Size of the connection circles

  useEffect(() => {
    initializePoints();
  }, []);

  const initializePoints = () => {
    const shuffledColors = [...COLORS].sort(() => Math.random() - 0.5);
    const left: ConnectionPoint[] = shuffledColors.map((color, index) => ({ // Explicitly type
      id: `left-${index}`,
      color: color,
      x: width * 0.1,
      y: (height * 0.8 / COLORS.length) * (index + 0.5),
      connectedTo: null,
    }));

    const rightShuffledColors = [...shuffledColors].sort(() => Math.random() - 0.5);
    const right: ConnectionPoint[] = rightShuffledColors.map((color, index) => ({ // Explicitly type
      id: `right-${index}`,
      color: color,
      x: width * 0.9,
      y: (height * 0.8 / COLORS.length) * (index + 0.5),
      connectedTo: null,
    }));

    setLeftPoints(left);
    setRightPoints(right);
    setWires([]);
    setConnectedPairs({});
    setIsSolved(false);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        const { pageX, pageY } = evt.nativeEvent;

        const touchedLeftPoint = leftPoints.find(point =>
          Math.abs(point.x - pageX) < POINT_SIZE && Math.abs(point.y - pageY) < POINT_SIZE
        );

        if (touchedLeftPoint && !touchedLeftPoint.connectedTo) {
          setActiveWire({
            id: `temp-${Date.now()}`,
            color: touchedLeftPoint.color,
            startX: touchedLeftPoint.x,
            startY: touchedLeftPoint.y,
            endX: pageX,
            endY: pageY,
            startPointId: touchedLeftPoint.id,
            // endPointId is optional for activeWire, so we don't include it here
          });

          setWires(prevWires => prevWires.filter(wire => wire.startPointId !== touchedLeftPoint.id));
          setConnectedPairs(prevPairs => {
            const newPairs = { ...prevPairs };
            for (const key in newPairs) {
              if (key === touchedLeftPoint.id || newPairs[key] === touchedLeftPoint.id) {
                delete newPairs[key];
              }
            }
            return newPairs;
          });
          setLeftPoints(prev => prev.map(p => p.id === touchedLeftPoint.id ? { ...p, connectedTo: null } : p));
          setRightPoints(prev => prev.map(p => p.connectedTo === touchedLeftPoint.id ? { ...p, connectedTo: null } : p));
        }
      },

      onPanResponderMove: (evt, gestureState) => {
        if (activeWire) {
          setActiveWire(prev => prev ? ({ // Add a null check for prev
            ...prev,
            endX: evt.nativeEvent.pageX,
            endY: evt.nativeEvent.pageY,
          }) : null);
        }
      },

      onPanResponderRelease: (evt, gestureState) => {
        if (activeWire) {
          const { pageX, pageY } = evt.nativeEvent;

          const touchedRightPoint = rightPoints.find(point =>
            Math.abs(point.x - pageX) < POINT_SIZE && Math.abs(point.y - pageY) < POINT_SIZE
          );

          if (touchedRightPoint && !touchedRightPoint.connectedTo) {
            const startPoint = leftPoints.find(p => p.id === activeWire.startPointId);
            if (startPoint && startPoint.color === touchedRightPoint.color) {
              const newWire: Wire = { // Explicitly type newWire
                ...activeWire,
                endX: touchedRightPoint.x,
                endY: touchedRightPoint.y,
                endPointId: touchedRightPoint.id,
              };
              setWires(prev => [...prev, newWire]);
              setConnectedPairs(prev => ({ ...prev, [startPoint.id]: touchedRightPoint.id }));

              setLeftPoints(prev => prev.map(p =>
                p.id === startPoint.id ? { ...p, connectedTo: touchedRightPoint.id } : p
              ));
              setRightPoints(prev => prev.map(p =>
                p.id === touchedRightPoint.id ? { ...p, connectedTo: startPoint.id } : p
              ));
            }
          }
          setActiveWire(null);
        }
      },
    })
  ).current;

  useEffect(() => {
    if (wires.length === COLORS.length && Object.keys(connectedPairs).length === COLORS.length) {
      const allMatched = leftPoints.every(lp => {
        const connectedRightPoint = rightPoints.find(rp => rp.id === lp.connectedTo);
        return connectedRightPoint && lp.color === connectedRightPoint.color;
      });
      setIsSolved(allMatched);
    } else {
      setIsSolved(false);
    }
  }, [wires, connectedPairs, leftPoints, rightPoints]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connect the Wires!</Text>
      <View style={styles.puzzleArea} {...panResponder.panHandlers}>
        <Svg height="100%" width="100%" ref={svgRef}>
          {leftPoints.map(point => (
            <Circle
              key={point.id}
              cx={point.x}
              cy={point.y}
              r={POINT_SIZE / 2}
              fill={point.connectedTo ? 'lightgray' : point.color}
              stroke="black"
              strokeWidth="2"
            />
          ))}

          {rightPoints.map(point => (
            <Circle
              key={point.id}
              cx={point.x}
              cy={point.y}
              r={POINT_SIZE / 2}
              fill={point.connectedTo ? 'lightgray' : point.color}
              stroke="black"
              strokeWidth="2"
            />
          ))}

          {wires.map(wire => (
            <Line
              key={wire.id}
              x1={wire.startX}
              y1={wire.startY}
              x2={wire.endX}
              y2={wire.endY}
              stroke={wire.color}
              strokeWidth="5"
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
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="5,5"
            />
          )}
        </Svg>
      </View>

      {isSolved && <Text style={styles.solvedText}>Task Complete!</Text>}
      <TouchableOpacity onPress={initializePoints} style={styles.resetButton}>
        <Text style={styles.resetButtonText}>Reset Puzzle</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  puzzleArea: {
    width: width * 0.9,
    height: height * 0.7,
    backgroundColor: '#222',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#555',
    overflow: 'hidden',
  },
  solvedText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'lightgreen',
    marginTop: 20,
  },
  resetButton: {
    marginTop: 30,
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});