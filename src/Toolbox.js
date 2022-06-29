import React from "react";

import {  ValveTool, TankTool, PipeTool, SourceTool, TargetTool,
  PumpTool, MeasurementTool, ReactorTool} from './ReactAutomation'

class Toolbox extends React.Component {

  constructor(props) {
    super(props);
    this.state = {pipes: false, valves: false, pumps: false, tanks: false, measurements: false};
  }
  // ParentClass function

  drag = (ev, para) => {
    try {
      para.from = 0;
      ev.dataTransfer.setData("text", JSON.stringify(para));
    } catch (error) {
      const dataList = ev.dataTransfer.items;
      dataList.add(JSON.stringify(para), "text");

    }
  }

  render() {
    const{pipes, valves, pumps, tanks, measurements} = this.state;
    const{demo_step} = this.props;
    return (
        <aside className="menu" style={{paddingLeft: 16}}>
          <p className="menu-label">
            Toolbox
          </p>
          <ul className="menu-list">
            <li>
              <a className={demo_step === 17 ? "has-background-warning" : ""}
               onClick={() => this.setState({pipes: !pipes})}>Pipes</a>
                {pipes || (demo_step >= 17 && demo_step <= 20) ?
                <ul>
                  <li className="tags are-small">
                    <PipeTool connections={[1,0,1,0]} onDrag={this.drag}/>
                    <PipeTool connections={[0,1,0,1]} onDrag={this.drag}/>
                  </li>
                  <li className="tags are-small">
                    <PipeTool demo_step = {demo_step} connections={[1,1,0,0]} onDrag={this.drag}/>
                    <PipeTool connections={[0,1,1,0]} onDrag={this.drag}/>
                  </li>
                  <li className="tags are-small">
                    <PipeTool connections={[0,0,1,1]} onDrag={this.drag}/>
                    <PipeTool connections={[1,0,0,1]} onDrag={this.drag}/>
                  </li>
                  <li className="tags are-small">
                    <PipeTool connections={[1,1,1,0]} onDrag={this.drag}/>
                    <PipeTool connections={[0,1,1,1]} onDrag={this.drag}/>
                  </li>
                  <li className="tags are-small">
                    <PipeTool connections={[1,0,1,1]} onDrag={this.drag}/>
                    <PipeTool connections={[1,1,0,1]} onDrag={this.drag}/>
                  </li>
                  <li className="tags are-small">
                    <PipeTool connections={[1,1,1,1]} onDrag={this.drag}/>
                  </li>
                </ul> : ""}
            </li>
          <li>
            <a className={valves ? "" : ""} onClick={() => this.setState({valves: !valves})}>Valves</a>
              {valves ?
              <ul>
                <li className="tags are-small">
                      <ValveTool connections={[1,0,1,0]} onDrag={this.drag}/>
                      <ValveTool connections={[0,1,0,1]} onDrag={this.drag}/>
                </li>
              </ul> : ""}
          </li>
          <li>
            <a className={pumps ? "" : ""} onClick={() => this.setState({pumps: !pumps})}>Pumps</a>
              {pumps ?
              <ul>
                <li className="tags are-small">
                      <PumpTool connections={[1,0,1,0]} end={2} onDrag={this.drag}/>
                      <PumpTool connections={[1,0,1,0]} end={0} onDrag={this.drag}/>
                </li>
                <li className="tags are-small">
                      <PumpTool connections={[0,1,0,1]} end={1} onDrag={this.drag}/>
                      <PumpTool connections={[0,1,0,1]} end={3} onDrag={this.drag}/>
                </li>
              </ul> : ""}
          </li>
          <li>
            <a className={demo_step === 12 ? "has-background-warning" : ""}
            onClick={() => this.setState({tanks: !tanks})}>Tank/Reactor/Source/Sink</a>
              {tanks || (demo_step >= 12 && demo_step <=15) ?
              <ul>
                <li className="tags are-small">
                  <TankTool demo_step = {demo_step} onDrag={this.drag}/>
                  <ReactorTool onDrag={this.drag}/>
                </li>
                <li className="tags are-small">
                  <SourceTool onDrag={this.drag}/>
                  <TargetTool onDrag={this.drag}/>
                </li>
              </ul> : ""}
          </li>
          <li>
            <a className={demo_step === 32 ? "has-background-warning" : ""} onClick={() => this.setState({measurements: !measurements})}>Measurements</a>
              {measurements || (demo_step >= 32 && demo_step <=35)  ?
              <ul>
                <li className="tags are-small">
                  <MeasurementTool demo_step = {demo_step} meas_type={1} onDrag={this.drag}/>
                  <MeasurementTool meas_type={2} onDrag={this.drag} />
                </li>
                <li className="tags are-small">
                  <MeasurementTool meas_type={3} onDrag={this.drag} />
                  <MeasurementTool meas_type={4} onDrag={this.drag}/>
                </li>
                <li className="tags are-small">
                  <MeasurementTool meas_type={5} onDrag={this.drag} />
                </li>
              </ul> : ""}
          </li>
      </ul>

      </aside>);
  }
}


function ToolboxManual(props){

    return (
          <>
              <p>Pipes</p>
                <ul>
                  <li className="tags are-small">
                    <PipeTool connections={[1,0,1,0]}/>
                    <PipeTool connections={[0,1,0,1]}/>
                  </li>
                </ul>
            <p>Valves</p>
              <ul>
                <li className="tags are-small">
                      <ValveTool connections={[1,0,1,0]}/>
                      <ValveTool connections={[0,1,0,1]}/>
                </li>
              </ul>
            <p>Pumps</p>
              <ul>
                <li className="tags are-small">
                      <PumpTool connections={[1,0,1,0]} end={2}/>
                      <PumpTool connections={[1,0,1,0]} end={0}/>
                </li>
              </ul>

            <p>Tank/Reactor/Source/Sink</p>
              <ul>
                <li className="tags are-small">
                      <TankTool/>
                      <ReactorTool/>
                </li>
                <li className="tags are-small">
                  <SourceTool/>
                  <TargetTool/>
                </li>
              </ul>

            <p>Measurements</p>
              <ul>
                <li className="tags are-small">
                  <MeasurementTool meas_type={1}/>
                  <MeasurementTool meas_type={2} />
                </li>
                <li className="tags are-small">
                  <MeasurementTool meas_type={3} />
                  <MeasurementTool meas_type={4}/>
                </li>
                <li className="tags are-small">
                  <MeasurementTool meas_type={5} />
                </li>
              </ul>
      </>
);
}

export default Toolbox;
export {
  ToolboxManual
}
