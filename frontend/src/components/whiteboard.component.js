import React, { Component } from 'react'
import connect from 'react-redux'




class Whiteboard extends Component {
  constructor(props) {
    super(props)



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










  

}

// export default connect(null)