# Polygon Drawing Tool

## Overview

The Simple Polygon Drawing Tool is a React application that allows users to draw polygons on a canvas, calculate their areas, and save or import drawings in JSON format. It utilizes the `react-konva` library for rendering graphics and provides an intuitive interface for managing polygon shapes.

## Technologies Used

- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: A superset of JavaScript that adds static types, enhancing code quality and maintainability.
- **react-konva**: A React wrapper for the Konva library, which is used for drawing 2D graphics on the web.
- **HTML5 Canvas**: A powerful feature of HTML5 used for rendering graphics and animations.
- **CSS**: For styling the application and ensuring a responsive design.


## Features

- Draw polygons by clicking on the canvas.
- Drag vertices to adjust polygon shapes.
- Calculate and display the area of each polygon.
- Save drawings as JSON files.
- Import existing drawings from JSON files.
- Clear the canvas and delete the last point added.

## Installation

To get started with the Polygon Drawing Tool, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/hushanidini/sketching-tool.git
   ```

2. Navigate to the project directory:

   ```bash
   cd sketching-tool
   ```

3. Install the required dependencies:

   ```bash
   npm install
   ```

## Usage

1. Start the development server:

   ```bash
   npm start
   ```

2. Open your browser and navigate to `http://localhost:3000` to view the application.

3. Use the following controls:
   - Click on the canvas to add points and create polygons.
   - Drag the blue circles (vertices) to adjust the shape of the polygons.
   - The area of each polygon will be displayed at its centroid.
   - Use the "Save Drawing" button to save your current polygons as a JSON file.
   - Use the "Import Drawing" button to upload a previously saved JSON file.
   - Adjust the scale and DPI settings as needed.
   - Clear the canvas or delete the last point added using the respective buttons.

## File Structure
