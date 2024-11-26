import { Point } from "../types/polygon";
// Utility function to calculate the polygon's area using the Shoelace theorem
export const calculatePolygonArea = (
  points: Point[],
  scale: number,
  dpi: number
) => {
  let area = 0;
  const n = points.length;
  for (let i = 0; i < n; i++) {
    const { x: x1, y: y1 } = points[i];
    const { x: x2, y: y2 } = points[(i + 1) % n];
    area += x1 * y2 - x2 * y1;
  }
  return Math.abs(area / 2) * (scale / dpi) * (scale / dpi);
};

// Helper function to calculate the centroid of a polygon
export const calculateCentroid = (points: Point[]) => {
  let xSum = 0,
    ySum = 0;
  points.forEach((p) => {
    xSum += p.x;
    ySum += p.y;
  });
  const xCenter = xSum / points.length;
  const yCenter = ySum / points.length;
  return { x: xCenter, y: yCenter };
};

// Helper function to calculate the distance between two points (Euclidean distance)
export const calculateDistance = (
  p1: Point,
  p2: Point,
  scale: number,
  dpi: number
) => {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy) * (scale / dpi); // Convert to feet using the scale
};

// Helper function to calculate the midpoint between two points
export const calculateMidpoint = (p1: Point, p2: Point) => {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  };
};

// Helper function to check if a click is near the first point (within a tolerance)
export const isCloseToFirstPoint = (
  firstPoint: Point,
  newPoint: Point,
  tolerance = 10
) => {
  const dx = firstPoint.x - newPoint.x;
  const dy = firstPoint.y - newPoint.y;
  return Math.sqrt(dx * dx + dy * dy) < tolerance;
};
