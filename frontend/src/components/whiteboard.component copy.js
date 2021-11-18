import React, { Component, useEffect, useState } from 'react'
import connect from 'react-redux'

import Swatch from "../components/swatch";
import rough from "roughjs/bundled/rough.esm";
import {
  createElement,
  adjustElementCoordinates,
  cursorForPosition,
  resizedCoordinates,
  midPointBtw,
  getElementAtPosition,
} from "../components/element";

import ElementDataService from '../services/element.service'




class Whiteboard extends Component {

  constructor(props) {
    super(props)

    this.updateElement = this.updateElement.bind(this)
    this.updatePath = this.updatePath.bind(this)
    this.sentElementDataToServer = this.sentElementDataToServer.bind(this)
    this.checkPresent = this.checkPresent.bind(this)
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)


    this.setPopped = this.setPopped.bind(this)
    this.setElements = this.setElements.bind(this)
    this.setPoints = this.setPoints.bind(this)
    this.setPath = this.setPath.bind(this)
    this.setIsDrawing = this.setIsDrawing.bind(this)






    // STATE
    this.state = {
      points: [],
      path: [],
      isDrawing: false,
      elements: [],
      action: "none",
      toolType: "pencil",
      selectedElement: null,
      colorWidth: {
        hex: "#000",
        hsv: {},
        rgb: {},
      },
      width: 1,
      shapeWidth: 1,
      popped: false
    }

  }

  setPopped(value) {
    this.state.popped = value
  }

  setElements(elements) {
    this.state.elements = elements
  }

  setPoints(points) {
    this.state.points = points
  }

  setPath(path) {
    this.state.path = path
  }

  setIsDrawing(value) {
    this.state.isDrawing = value
  }

  setSelectedElement(value) {
    this.state.selectedElement = value
  }

  setAction(action) {
    this.state.action = action
  }

  setToolType(toolType) {
    this.state.toolType = toolType
  }
  
  setWidth(width) {
    this.state.width = width
  }

  setElements(elements) {
    this.state.elements = elements
  }

  setColorWidth(colorWidth) {
    this.state.colorWidth = this.colorWidth
  }

  setShapeWidth(shapeWidth) {
    this.state.shapeWidth = shapeWidth
  }



  componentDidMount() {
    const toolType = this.state.toolType
    const shapeWidth = this.state.shapeWidth
    const elements = this.state.elements
    const path = this.state.path
    const popped = this.state.popped


    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.lineJoin = "round";

    context.save();

    const drawpath = () => {
      path.forEach((stroke, index) => {
        context.beginPath();

        stroke.forEach((point, i) => {
          context.strokeStyle = point.newColour;
          context.lineWidth = point.newLinewidth;

          var midPoint = midPointBtw(point.clientX, point.clientY);

          context.quadraticCurveTo(
            point.clientX,
            point.clientY,
            midPoint.x,
            midPoint.y
          );
          context.lineTo(point.clientX, point.clientY);
          context.stroke();
        });
        context.closePath();
        context.save();
      });
    };

    if (toolType === "eraser" && popped === true) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      this.setPopped(false);
    }

    const roughCanvas = rough.canvas(canvas);

    if (path !== undefined) drawpath();

    context.lineWidth = shapeWidth;

    elements.forEach(({ roughElement }) => {
      context.globalAlpha = "1";
      //console.log(roughElement);
      context.strokeStyle = roughElement.options.stroke;
      roughCanvas.draw(roughElement);
    });

    return () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
    };
  };



  // useEffect(() => {
  //   const canvas = document.getElementById("canvas");
  //   const context = canvas.getContext("2d");
  //   context.lineCap = "round";
  //   context.lineJoin = "round";

  //   context.save();

  //   const drawpath = () => {
  //     path.forEach((stroke, index) => {
  //       context.beginPath();

  //       stroke.forEach((point, i) => {
  //         context.strokeStyle = point.newColour;
  //         context.lineWidth = point.newLinewidth;

  //         var midPoint = midPointBtw(point.clientX, point.clientY);

  //         context.quadraticCurveTo(
  //           point.clientX,
  //           point.clientY,
  //           midPoint.x,
  //           midPoint.y
  //         );
  //         context.lineTo(point.clientX, point.clientY);
  //         context.stroke();
  //       });
  //       context.closePath();
  //       context.save();
  //     });
  //   };

  //   if (toolType === "eraser" && popped === true) {
  //     context.clearRect(0, 0, canvas.width, canvas.height);
  //     setPopped(false);
  //   }

  //   const roughCanvas = rough.canvas(canvas);

  //   if (path !== undefined) drawpath();

  //   context.lineWidth = shapeWidth;

  //   elements.forEach(({ roughElement }) => {
  //     context.globalAlpha = "1";
  //     //console.log(roughElement);
  //     context.strokeStyle = roughElement.options.stroke;
  //     roughCanvas.draw(roughElement);
  //   });

  //   return () => {
  //     context.clearRect(0, 0, canvas.width, canvas.height);
  //   };
  // }, [popped, elements, path, width]);











  updateElement = (
    index,
    x1,
    y1,
    x2,
    y2,
    toolType,
    strokeWidth,
    strokeColor
  ) => {
    const updatedElement = createElement(
      index,
      x1,
      y1,
      x2,
      y2,
      toolType,
      strokeWidth,
      strokeColor
    );

    const elements = this.state.elements

    const elementsCopy = [...elements];
    elementsCopy[index] = updatedElement;
    this.setElements(elementsCopy);
  };






  updatePath = (points) => {
    const element = points;
    this.setPoints([]);
    this.setPath((prevState) => [...prevState, element]); //tuple
    this.setIsDrawing(false);
  }












  sentElementDataToServer = (elements) => {
    try {
      const res = ElementDataService.create({ elements })

      // dispatch({
      //   type: CREATE_CATEGORY,
      //   payload: res.data
      // })
      return Promise.resolve(res.data)
    }
    catch (error) {
      return Promise.reject(error)
    }
  }












  checkPresent = (clientX, clientY) => {
    const path = this.state.path
    const elements = this.state.elements

    if (path === undefined) return;
    var newPath = path;
    path.forEach((stroke, index) => {
      stroke.forEach((point, i) => {
        if (
          clientY < point.clientY + 10 &&
          clientY > point.clientY - 10 &&
          clientX < point.clientX + 10 &&
          clientX > point.clientX - 10
        ) {
          //console.log("Popped");
          newPath.splice(index, 1);
          this.setPopped(true);
          this.setPath(newPath);
          return;
        }
      });
    });
    const newElements = elements;
    newElements.forEach((ele, index) => {
      if (
        clientX >= ele.x1 &&
        clientX <= ele.x2 &&
        clientY >= ele.y1 &&
        clientY <= ele.y2
      ) {
        console.log("Popped....");
        newElements.splice(index, 1);
        this.setPopped(true);
        this.setElements(newElements);
      }
    });
  };















  handleMouseDown = (e) => {
    const toolType = this.state.toolType
    const elements = this.state.elements
    const width = this.state.width
    const colorWidth = this.state.colorWidth
    const shapeWidth = this.state.shapeWidth

    const { clientX, clientY } = e;
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");

    if (toolType === "selection") {
      const element = getElementAtPosition(clientX, clientY, elements);
      if (element) {
        const offsetX = clientX - element.x1;
        const offsetY = clientY - element.y1;
        this.setSelectedElement({ ...element, offsetX, offsetY });
        if (element.position === "inside") {
          this.setAction("moving");
        } else {
          this.setAction("resize");
        }
      }
    } else if (toolType === "eraser") {
      this.setAction("erasing");

      this.checkPresent(clientX, clientY);
    } else {
      const id = elements.length;
      if (toolType === "pencil" || toolType === "brush") {
        this.setAction("sketching");
        this.setIsDrawing(true);

        const newColour = colorWidth.hex;
        const newLinewidth = width;
        const transparency = toolType === "brush" ? "0.1" : "1.0";
        const newEle = {
          clientX,
          clientY,
          newColour,
          newLinewidth,
          transparency,
        };
        this.setPoints((state) => [...state, newEle]);

        context.strokeStyle = newColour;
        context.lineWidth = newLinewidth;
        context.lineCap = 5;
        context.moveTo(clientX, clientY);
        context.beginPath();
      } else {
        this.setAction("drawing");
        const newColour = colorWidth.hex;
        const newWidth = shapeWidth;
        const element = createElement(
          id,
          clientX,
          clientY,
          clientX,
          clientY,
          toolType,
          newWidth,
          newColour
        );

        this.setElements((prevState) => [...prevState, element]);
        this.setSelectedElement(element);
      }
    }
  };
















  handleMouseMove = (e) => {
    const toolType = this.state.toolType
    const elements = this.state.elements
    const action = this.state.action
    const isDrawing = this.state.isDrawing
    const points = this.state.points
    const colorWidth = this.state.colorWidth
    const shapeWidth = this.state.shapeWidth
    const selectedElement = this.state.selectedElement


    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    const { clientX, clientY } = e;
    if (toolType === "selection") {
      const element = getElementAtPosition(clientX, clientY, elements);
      e.target.style.cursor = element
        ? cursorForPosition(element.position)
        : "default";
    }
    if (action === "erasing") {
      this.checkPresent(clientX, clientY);
    }
    if (action === "sketching") {
      if (!isDrawing) return;
      const colour = points[points.length - 1].newColour;
      const linewidth = points[points.length - 1].newLinewidth;
      const transparency = points[points.length - 1].transparency;
      const newEle = { clientX, clientY, colour, linewidth, transparency };

      this.setPoints((state) => [...state, newEle]);
      var midPoint = midPointBtw(clientX, clientY);
      context.quadraticCurveTo(clientX, clientY, midPoint.x, midPoint.y);
      context.lineTo(clientX, clientY);
      context.stroke();
    } else if (action === "drawing") {
      const index = elements.length - 1;
      const { x1, y1 } = elements[index];
      elements[index].strokeColor = colorWidth.hex;
      elements[index].strokeWidth = shapeWidth;
      this.updateElement(
        index,
        x1,
        y1,
        clientX,
        clientY,
        toolType,
        shapeWidth,
        colorWidth.hex
      );
    } else if (action === "moving") {
      const {
        id,
        x1,
        x2,
        y1,
        y2,
        type,
        offsetX,
        offsetY,
        shapeWidth,
        strokeColor,
      } = selectedElement;
      const offsetWidth = x2 - x1;
      const offsetHeight = y2 - y1;
      const newX = clientX - offsetX;
      const newY = clientY - offsetY;
      this.updateElement(
        id,
        newX,
        newY,
        newX + offsetWidth,
        newY + offsetHeight,
        type,
        shapeWidth,
        strokeColor
      );
    } else if (action === "resize") {
      const { id, type, position, ...coordinates } = selectedElement;
      const { x1, y1, x2, y2 } = resizedCoordinates(
        clientX,
        clientY,
        position,
        coordinates
      );
      this.updateElement(id, x1, y1, x2, y2, type, shapeWidth, colorWidth.hex);
    }
  };














  handleMouseUp = () => {
    const action = this.state.action
    const selectedElement = this.state.selectedElement
    const elements = this.state.elements
    const colorWidth = this.state.colorWidth
    const points = this.state.points
    const path = this.state.path

    if (action === "resize") {
      const index = selectedElement.id;
      const { id, type, strokeWidth, strokeColor } = elements[index];
      const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index]);
      this.updateElement(id, x1, y1, x2, y2, type, strokeWidth, strokeColor);
    } else if (action === "drawing") {
      const index = selectedElement.id;
      const { id, type, strokeWidth } = elements[index];
      const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index]);
      this.updateElement(id, x1, y1, x2, y2, type, strokeWidth, colorWidth.hex);





      // sent this state to the server
      console.log('ELEMENT (SHAPES) STATE: ', elements);
      this.sentElementDataToServer(elements)



    } else if (action === "sketching") {
      const canvas = document.getElementById("canvas");
      const context = canvas.getContext("2d");
      context.closePath();

      this.updatePath(points);

      // sent this state to the server
      console.log('PATH (PENCIL/BRUSH) STATE: ', path);
      // sentPathDataToServer(elements)



    }
    this.setAction("none");
  };















  render() {

    return (
      <div>
        <Swatch
          toolType={this.state.toolType}
          setToolType={this.setToolType}
          width={this.state.width}
          setWidth={this.setWidth}
          setElements={this.setElements}
          setColorWidth={this.setColorWidth}
          setPath={this.setPath}
          colorWidth={this.state.colorWidth}
          setShapeWidth={this.setShapeWidth}
        />
        <canvas
          id="canvas"
          className="App"
          width={window.innerWidth}
          height={window.innerHeight}
          onMouseDown={this.handleMouseDown}
          onMouseMove={this.handleMouseMove}
          onMouseUp={this.handleMouseUp}
          onTouchStart={(e) => {
            var touch = e.touches[0];
            this.handleMouseDown({ clientX: touch.clientX, clientY: touch.clientY });
          }}
          onTouchMove={(e) => {
            var touch = e.touches[0];
            this.handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
          }}
          onTouchEnd={this.handleMouseUp}
        >
          Canvas
        </canvas>
      </div>
    );
  }










}

// export default connect(null)

export default Whiteboard;