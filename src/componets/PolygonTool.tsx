import React, { useRef, useState } from 'react';
import { Stage, Layer, Line, Circle, Text } from 'react-konva';
import { calculatePolygonArea, isCloseToFirstPoint, calculateMidpoint, calculateDistance, calculateCentroid } from '../utils/helper';
import { Point, Polygon } from "../types/polygon";

const buttonStyle = {
    marginBottom: '10px',
    padding: '10px 15px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007BFF',
    color: 'white',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    margin: '10px'
};


function PolygonDrawingTool() {
    const [polygons, setPolygons] = useState<Polygon[]>([]);
    const [currentPolygon, setCurrentPolygon] = useState<Point[]>([]);
    const [scale, setScale] = useState(1); // Default scale (1 inch = 1 feet)
    const [dpi, setDpi] = useState(10); // Default DPI

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Handle stage click to add points to the current polygon
    const handleStageClick = (e: any) => {

        const stage = e.target.getStage();
        const { x, y } = stage.getPointerPosition() || { x: 0, y: 0 };

        if (currentPolygon.length === 0) {
            setCurrentPolygon([{ x, y }]);
        } else {
            if (isCloseToFirstPoint(currentPolygon[0], { x, y })) {
                const newPolygon: Polygon = {
                    points: currentPolygon,
                    isCompleted: true,
                };
                setPolygons((prevPolygons) => [...prevPolygons, newPolygon]);
                setCurrentPolygon([]);
            } else {
                setCurrentPolygon((prevPolygon) => [...prevPolygon, { x, y }]);
            }
        }
    };

    // Handle drag of individual points (vertices) of polygons
    const handleDragMove = (polygonIndex: number, pointIndex: number) => (e: any) => {
        const newPolygons = polygons.map((polygon, pIndex) => {
            if (polygonIndex === pIndex) {
                const newPoints = polygon.points.map((point, i) =>
                    i === pointIndex
                        ? { x: e.target.x(), y: e.target.y() }
                        : point
                );
                return {
                    ...polygon,
                    points: newPoints,
                };
            }
            return polygon;
        });
        setPolygons(newPolygons);
    };

    // Convert points array to Line component compatible format
    const convertPointsToLine = (points: Point[]) => points.flatMap((p) => [p.x, p.y]);

    function saveDrawing(): void {
        const json = JSON.stringify({ polygons, scale, dpi });
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
      
        const now = new Date();
        const formattedDate = now.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        const formattedTime = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // Format as HH-MM-SS
        const filename = `drawing_${formattedDate}_${formattedTime}.json`; 

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === 'application/json') {
            const reader = new FileReader();
            reader.onload = (e) => {
                const fileContents = e.target?.result as string;
                try {
                    const parsed = JSON.parse(fileContents);
                    setPolygons(parsed.polygons);
                    setScale(parsed.scale);
                    setDpi(parsed.dpi);
                    console.log('Parsed JSON:', parsed);
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }
            };
            reader.readAsText(file);
        } else {
            console.error('Please upload a valid JSON file.');
        }
    };

    function importDrawing(): void {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    const clearCanvas = () => {
        setPolygons([]);
        setCurrentPolygon([]);
    };

    const deleteLastPoint = () => {
        setCurrentPolygon((prevPolygon) => {
            if (prevPolygon.length > 0) {
                return prevPolygon.slice(0, -1);
            }
            return prevPolygon;
        });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                <Stage
                    width={window.innerWidth * 0.9}
                    height={window.innerHeight * 0.7}
                    onClick={handleStageClick}
                >
                    <Layer>
                        {polygons.map((polygon, polygonIndex) => (
                            <React.Fragment key={polygonIndex}>
                                <Line
                                    points={convertPointsToLine(polygon.points)}
                                    fill="lightblue"
                                    stroke="blue"
                                    strokeWidth={2}
                                    closed
                                />
                                {/* Render draggable handles (circles) for each point of the polygon */}
                                {polygon.points.map((point, pointIndex) => (
                                    <Circle
                                        key={pointIndex}
                                        x={point.x}
                                        y={point.y}
                                        radius={5}
                                        fill="#007BFF"
                                        draggable
                                        onDragMove={handleDragMove(polygonIndex, pointIndex)}
                                    />
                                ))}
                                {/* Display the area at the center of the polygon */}
                                <Text
                                    x={calculateCentroid(polygon.points).x}
                                    y={calculateCentroid(polygon.points).y}
                                    text={`Area: ${calculatePolygonArea(polygon.points, scale, dpi).toFixed(2)} sq ft`}
                                    fontSize={14}
                                    fill="red"
                                />
                                {/* Render lengths for each side */}
                                {polygon.points.map((point, index) => {
                                    const nextPoint = polygon.points[(index + 1) % polygon.points.length];
                                    const distance = calculateDistance(point, nextPoint, scale, dpi);
                                    const midpoint = calculateMidpoint(point, nextPoint);

                                    return (
                                        <Text
                                            key={`length-${index}`}
                                            x={midpoint.x}
                                            y={midpoint.y}
                                            text={`${distance.toFixed(2)} ft`}
                                            fontSize={14}
                                            fill="black"
                                        />
                                    );
                                })}
                            </React.Fragment>
                        ))}

                        {/* Render the current polygon being drawn */}
                        {currentPolygon.length > 1 && (
                            <Line
                                points={convertPointsToLine(currentPolygon)}
                                fill="transparent"
                                stroke="black"
                                strokeWidth={2}
                                closed={false}
                            />
                        )}

                        {/* Render draggable handles (circles) for current polygon */}
                        {currentPolygon.map((point, index) => (
                            <Circle
                                key={index}
                                x={point.x}
                                y={point.y}
                                radius={5}
                                fill="red"
                                draggable={false}
                            />
                        ))}
                    </Layer>
                </Stage>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'center', marginTop: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '10px' }}>
                        <label style={{ marginRight: '10px' }}>
                            <b>{`Scale:`}</b>
                            <input
                                type="number"
                                value={scale}
                                onChange={(e) => setScale(Number(e.target.value))}
                                style={{ width: '80px', marginLeft: '5px' }}
                            />
                            <b>{` (1 inch = ${scale} feet)`}</b>
                        </label>
                        <label>
                            <b>DPI (Dots per Inch):</b>
                            <input
                                type="number"
                                value={dpi}
                                onChange={(e) => setDpi(Number(e.target.value))}
                                style={{ width: '60px', marginLeft: '5px' }}
                            />
                        </label>
                    </div>
                </div>
                <button className='border p-2 m-2' style={buttonStyle} onClick={saveDrawing}>
                    Save Drawing
                </button>

                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
                <button className='border p-2 m-2' style={buttonStyle} onClick={importDrawing}>
                    Import Drawing
                </button>


                <button className='border p-2 m-2' style={buttonStyle} onClick={clearCanvas}>
                    Clear Canvas
                </button>


                <button className='border p-2 m-2' style={buttonStyle} onClick={deleteLastPoint}>
                    Delete Last Point
                </button>


            </div>
        </div>
    );
};

export default PolygonDrawingTool;