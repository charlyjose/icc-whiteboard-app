// import React, { useEffect, useState } from "react";
import Swatch from "../whiteboard/swatch";
import rough from "roughjs/bundled/rough.esm";

import {
  createElement,
  adjustElementCoordinates,
  cursorForPosition,
  resizedCoordinates,
  midPointBtw,
  getElementAtPosition,
} from "../whiteboard/element";

import ShapeDrawDataService from "../../services/element.service"







import React, { Component, useEffect, useState } from "react";
import AuthService from "../../services/auth.service";



// import React, { Component } from "react";

import UserService from "../../services/user.service";

export default class WhiteBoardComp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      currentUser: AuthService.getCurrentUser(),


      // whiteboard states
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

  componentDidMount() {
    UserService.getUserBoard().then(
      response => {
        this.setState({
          content: response.data
        })
      },
      error => {
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        })
      }
    )
  }



  checkPresent = (clientX, clientY) => {
    if (this.state.path === undefined) return
    var newPath = this.state.path
    this.state.path.forEach((stroke, index) => {
      stroke.forEach((point, i) => {
        if (
          clientY < point.clientY + 10 &&
          clientY > point.clientY - 10 &&
          clientX < point.clientX + 10 &&
          clientX > point.clientX - 10
        ) {
          //console.log("Popped");
          newPath.splice(index, 1)

          // setPopped(true)
          this.setState({
            popped: true
          })

          // setPath(newPath)
          this.setState({
            path: newPath
          })

          return
        }
      })
    })

    const newElements = this.state.elements
    newElements.forEach((ele, index) => {
      if (
        clientX >= ele.x1 &&
        clientX <= ele.x2 &&
        clientY >= ele.y1 &&
        clientY <= ele.y2
      ) {
        console.log("Popped....")
        newElements.splice(index, 1)

        // setPopped(true)
        this.setState({
          popped: true
        })

        // setElements(newElements)
        this.setState({
          elements: newElements
        })

      }
    })
  }

  handleMouseDown = (e) => {
    const { clientX, clientY } = e;
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");

    if (this.state.toolType === "selection") {
      const element = getElementAtPosition(clientX, clientY, this.state.elements);
      if (element) {
        const offsetX = clientX - element.x1;
        const offsetY = clientY - element.y1;


        // setSelectedElement({ ...this.state.element, offsetX, offsetY });
        this.setState({
          selectedElement: { ...this.state.element, offsetX, offsetY }
        })


        if (element.position === "inside") {

          // setAction("moving");
          this.setState({
            action: "moving"
          })

        } else {

          // setAction("resize");
          this.setState({
            action: "resize"
          })

        }
      }
    } else if (this.state.toolType === "eraser") {

      // setAction("erasing");
      this.setState({
        action: "erasing"
      })

      this.checkPresent(clientX, clientY);



    } else {
      const id = this.state.elements.length;
      if (this.state.toolType === "pencil" || this.state.toolType === "brush") {

        // setAction("sketching")
        this.setState({
          action: "sketching"
        })

        // setIsDrawing(true)
        this.setState({
          isDrawing: true
        })

        const newColour = this.state.colorWidth.hex
        const newLinewidth = this.state.width
        const transparency = this.state.toolType === "brush" ? "0.1" : "1.0"
        const newEle = {
          clientX,
          clientY,
          newColour,
          newLinewidth,
          transparency,
        };

        ///////////////////////////////////////////
        // setPoints((state) => [...state, newEle])
        this.setState({
          points: [...this.state.points, newEle]
        })
        ///////////////////////////////////////////

        context.strokeStyle = newColour;
        context.lineWidth = newLinewidth;
        context.lineCap = 5;
        context.moveTo(clientX, clientY);
        context.beginPath();
      } else {

        // setAction("drawing")
        this.setState({
          action: "drawing"
        })

        const newColour = this.state.colorWidth.hex;
        const newWidth = this.state.shapeWidth;
        const element = createElement(
          id,
          clientX,
          clientY,
          clientX,
          clientY,
          this.state.toolType,
          newWidth,
          newColour
        )


        // setElements((prevState) => [...prevState, element])
        this.setState({
          elements: [...this.state.elements, element]
        })


        // setSelectedElement(element)
        this.setState({
          selectedElement: element
        })

      }
    }
  }






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
    const elementsCopy = [...this.state.elements];
    elementsCopy[index] = updatedElement;

    // setElements(elementsCopy)
    this.setState({
      elements: elementsCopy
    })

  };




  handleMouseMove = (e) => {

    const elements = this.state.elements
    const toolType = this.state.toolType
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




      // setPoints((state) => [...state, newEle])
      this.setState({
        points: [...this.state.points, newEle]
      })



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
  }








  render() {
    return (

      
        this.state.currentUser ? (

          <div className="container">

            <Swatch
              toolType={this.state.toolType}
              setToolType={this.state.setToolType}
              width={this.state.width}
              setWidth={this.state.setWidth}
              setElements={this.state.setElements}
              setColorWidth={this.state.setColorWidth}
              setPath={this.state.setPath}
              colorWidth={this.state.colorWidth}
              setShapeWidth={this.state.setShapeWidth}
              
              setState = {this.setState}
              boardState = {this.state}

            />
            <canvas
              id="canvas"
              className="App"
              width={window.innerWidth}
              height={window.innerHeight}
              onMouseDown={this.handleMouseDown}
              // onMouseMove={handleMouseMove}
              // onMouseUp={handleMouseUp}
              onTouchStart={(e) => {
                var touch = e.touches[0];
                this.handleMouseDown({ clientX: touch.clientX, clientY: touch.clientY });
              }}
              onTouchMove={(e) => {
                var touch = e.touches[0];
                this.handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
              }}
            // onTouchEnd={handleMouseUp}
            >
              Canvas
            </canvas>
          </div>
        ) : (
          <div className="container">
          <header className="jumbotron">
            <h3>{this.state.content}</h3>
            {console.log(this.state.content)}
            {console.log(this.state.currentUser)}
          </header>
          </div>
        )
    )
  }
}









































function Whiteboard() {
  const [points, setPoints] = useState([]);
  const [path, setPath] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [elements, setElements] = useState([]);
  const [action, setAction] = useState("none");
  const [toolType, setToolType] = useState("pencil");
  const [selectedElement, setSelectedElement] = useState(null);
  const [colorWidth, setColorWidth] = useState({
    hex: "#000",
    hsv: {},
    rgb: {},
  });
  const [width, setWidth] = useState(1);
  const [shapeWidth, setShapeWidth] = useState(1);
  const [popped, setPopped] = useState(false);



  // DRAWING state
  // console.log('ELEMENT STATE: ', elements);
  // console.log('ELEMENT STATE: ', elements[0]);


  // console.log('ACTION STATE: ', action);

  // // SKETCHING state
  // console.log('PATH STATE: ', path);




  useEffect(() => {
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
      setPopped(false);
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
  }, [popped, elements, path, width]);

  const updateElement = (
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
    const elementsCopy = [...elements];
    elementsCopy[index] = updatedElement;
    setElements(elementsCopy);
  };


  const updatePath = (points) => {
    const element = points;
    setPoints([]);
    setPath((prevState) => [...prevState, element]); //tuple
    setIsDrawing(false);
  }



  const sentElementDataToServer = (elements) => {
    try {
      const res = ShapeDrawDataService.create({ elements })
      return Promise.resolve(res.data)
    }
    catch (error) {
      return Promise.reject(error)
    }
  }





  const checkPresent = (clientX, clientY) => {
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
          setPopped(true);
          setPath(newPath);
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
        setPopped(true);
        setElements(newElements);
      }
    });
  };

  const handleMouseDown = (e) => {
    const { clientX, clientY } = e;
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");

    if (toolType === "selection") {
      const element = getElementAtPosition(clientX, clientY, elements);
      if (element) {
        const offsetX = clientX - element.x1;
        const offsetY = clientY - element.y1;
        setSelectedElement({ ...element, offsetX, offsetY });
        if (element.position === "inside") {
          setAction("moving");
        } else {
          setAction("resize");
        }
      }
    } else if (toolType === "eraser") {
      setAction("erasing");

      checkPresent(clientX, clientY);
    } else {
      const id = elements.length;
      if (toolType === "pencil" || toolType === "brush") {
        setAction("sketching");
        setIsDrawing(true);

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
        setPoints((state) => [...state, newEle]);

        context.strokeStyle = newColour;
        context.lineWidth = newLinewidth;
        context.lineCap = 5;
        context.moveTo(clientX, clientY);
        context.beginPath();
      } else {
        setAction("drawing");
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

        setElements((prevState) => [...prevState, element]);
        setSelectedElement(element);
      }
    }
  };

  const handleMouseMove = (e) => {
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
      checkPresent(clientX, clientY);
    }
    if (action === "sketching") {
      if (!isDrawing) return;
      const colour = points[points.length - 1].newColour;
      const linewidth = points[points.length - 1].newLinewidth;
      const transparency = points[points.length - 1].transparency;
      const newEle = { clientX, clientY, colour, linewidth, transparency };

      setPoints((state) => [...state, newEle]);
      var midPoint = midPointBtw(clientX, clientY);
      context.quadraticCurveTo(clientX, clientY, midPoint.x, midPoint.y);
      context.lineTo(clientX, clientY);
      context.stroke();
    } else if (action === "drawing") {
      const index = elements.length - 1;
      const { x1, y1 } = elements[index];
      elements[index].strokeColor = colorWidth.hex;
      elements[index].strokeWidth = shapeWidth;
      updateElement(
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
      updateElement(
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
      updateElement(id, x1, y1, x2, y2, type, shapeWidth, colorWidth.hex);
    }
  }




  const handleMouseUp = () => {
    if (action === "resize") {
      const index = selectedElement.id;
      const { id, type, strokeWidth, strokeColor } = elements[index];
      const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index]);
      updateElement(id, x1, y1, x2, y2, type, strokeWidth, strokeColor);
    } else if (action === "drawing") {
      const index = selectedElement.id;
      const { id, type, strokeWidth } = elements[index];
      const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index]);
      updateElement(id, x1, y1, x2, y2, type, strokeWidth, colorWidth.hex);





      // sent this state to the server
      console.log('ELEMENT (SHAPES) STATE: ', elements);
      sentElementDataToServer(elements[elements.length - 1])



    } else if (action === "sketching") {
      const canvas = document.getElementById("canvas");
      const context = canvas.getContext("2d");
      context.closePath();
      // const element = points;
      // setPoints([]);
      // setPath((prevState) => [...prevState, element]); //tuple
      // setIsDrawing(false);

      updatePath(points);

      // sent this state to the server
      console.log('PATH (PENCIL/BRUSH) STATE: ', path);
      // sentPathDataToServer(elements)



    }
    setAction("none");
  };

  return (
    <div>
      <Swatch
        toolType={toolType}
        setToolType={setToolType}
        width={width}
        setWidth={setWidth}
        setElements={setElements}
        setColorWidth={setColorWidth}
        setPath={setPath}
        colorWidth={colorWidth}
        setShapeWidth={setShapeWidth}
      />
      <canvas
        id="canvas"
        className="App"
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={(e) => {
          var touch = e.touches[0];
          handleMouseDown({ clientX: touch.clientX, clientY: touch.clientY });
        }}
        onTouchMove={(e) => {
          var touch = e.touches[0];
          handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
        }}
        onTouchEnd={handleMouseUp}
      >
        Canvas
      </canvas>
    </div>
  );
}

// export default Whiteboard;

