# Polygon Drawing Tool

A simple polygon drawing tool built with React and TypeScript. This application allows users to draw polygons on a canvas, calculate their area, display dimensions, and save/load sketches.

## Features

- Draw polygons by clicking on the canvas.
- Calculate and display the area of the polygon.
- Show dimensions along each side of the polygon.
- Input a scale factor to adjust displayed dimensions.
- Save the current sketch to local storage.
- Load a previously saved sketch.
- Clear the canvas or delete the last point added.
- Download their drawn polygons in two different formats: JSON and image

## Technologies Used

- React
- TypeScript
- HTML5 Canvas
- CSS (Flexbox for layout)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/polygon-drawer.git
   cd polygon-drawer
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000` to view the application.

## Usage

1. Click on the canvas to add points and create a polygon.
2. The area of the polygon will be displayed below the canvas.
3. Enter a scale factor in the input field to adjust the displayed dimensions.
4. Use the buttons to:
   - **Save Sketch**: Save the current polygon to local storage.
   - **Load Sketch**: Load a previously saved polygon from local storage.
   - **Clear Canvas**: Remove all points and reset the canvas.
   - **Delete Last Point**: Remove the last point added to the polygon.
   - **Download as JSON**: Download the polygon.
5. Double-click on a point to drag it.

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by various drawing applications and tutorials on React and TypeScript.