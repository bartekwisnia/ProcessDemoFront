import React from 'react';
import {FieldWithBar, SmallField} from'./Elements';
import {precision} from'./Utils';
import {cValve, cPipe, cTank, cPump, cRecipe, cMeasurement, cPID,
  cPhaseTransfer, cPhaseReaction, cSource, cTarget, cReactor} from './Automation';



function AutomationObject(props) {
  const {object_data} = props;
  switch (object_data.auto_type) {
    case 1:
      return (<Valve {...props}/>);
    case 2:
      return(<Tank {...props}/>);
    case 3:
      return(<Pipe {...props}/>);
    case 4:
      return (<Pump {...props}/>);
    case 5:
      return (<Source {...props}/>);
    case 6:
      return (<Target {...props}/>);
    case 8:
      return (<Reactor {...props}/>);
    default:
      return(<Empty {...props}/>);
  }
}


function AutomationObjectEdit(props) {
  const {edit_auto_obj} = props;
  switch (edit_auto_obj.auto_type) {
    case 1:
      return (<ValveEdit {...props}/>);
    case 2:
      return(<TankEdit {...props}/>);
    case 3:
      return(<PipeEdit {...props}/>);
    case 4:
      return (<PumpEdit {...props}/>);
    case 5:
      return (<SourceEdit {...props}/>);
    case 6:
      return (<TargetEdit {...props}/>);
    case 8:
      return (<ReactorEdit {...props}/>);
    default:
      return("");
  }
}


function cssRGB(arr_rgb){
  return "rgb("+arr_rgb[0]+","+arr_rgb[1]+","+arr_rgb[2]+")"
}


function MaterialOnObject(props){
return(
<div style={{position: "absolute", bottom: "0%", left: "0%", display: 'block'}}>
  <span className="tag" style={{backgroundColor : cssRGB(props.material)}}></span>
</div>
);
}


function Valve(props) {
  const {connections} = props.object_data;
  let icon_string = "";
  for(let i = 0; i<4; i++)
    icon_string += connections[i] ? i : "";
  return (
  <span className={"icon-valve"+icon_string} onClick={props.onClick} style={{fontSize: props.fontSize, position: "relative", color: props.object_data.open ? "green" : "black"}}>
    {!props.sim ? <button className="delete is-small" onClick={props.onDeleteAutomation}></button> : ""}
    {props.display_tags ? <AutoTag name={props.object_data.name}/> : ''}
    <MeasurementsOnObject {...props}/>
    {props.display_materials ? <MaterialOnObject material={props.object_data.material} /> : <></>}
  </span>
  );
}



function Tank(props) {
  return (
    <span className={"icon-tank"} onClick={props.onClick} style={{fontSize: props.fontSize, position: "relative"}}>
      <progress className="progress is-primary" value={props.object_data.fill} style={{position: "absolute", bottom: "0%", left: "0%", marginBottom: 0}} max="100">{props.object_data.fill}%</progress>
      {props.display_tags ? <AutoTag name={props.object_data.name}/> : ''}
      {!props.sim ? <button className="delete is-small" onClick={props.onDeleteAutomation}></button> : ""}
      <MeasurementsOnObject {...props}/>
      {props.display_materials ? <MaterialOnObject material={props.object_data.material} /> : <></>}
    </span>
  );
}


function Reactor(props) {
  return (
    <span className={"icon-barrel-chemical"} onClick={props.onClick} style={{fontSize: props.fontSize, position: "relative", color: props.object_data.mixing_on ? "green" : "black"}}>
      <progress className="progress is-primary" value={props.object_data.fill} style={{position: "absolute", bottom: "0%", left: "0%", marginBottom: 0}} max="100">{props.object_data.fill}%</progress>
      {props.display_tags ? <AutoTag name={props.object_data.name}/> : ''}
      {!props.sim ? <button className="delete is-small" onClick={props.onDeleteAutomation}></button> : ""}
      <MeasurementsOnObject {...props}/>
      {props.display_materials ? <MaterialOnObject material={props.object_data.material} /> : <></>}
    </span>
  );
}


function Source(props) {
  return (
    <span className={"icon-plumbering-water-supply"} onClick={props.onClick} style={{fontSize: props.fontSize, position: "relative"}}>
      {props.display_tags ? <AutoTag name={props.object_data.name}/> : ''}
      {!props.sim ? <button className="delete is-small" onClick={props.onDeleteAutomation}></button> : ""}
      <MeasurementsOnObject {...props}/>
      {props.display_materials ? <MaterialOnObject material={props.object_data.material} /> : <></>}
    </span>
  );
}


function Target(props) {
  return (
    <span className={"icon-filter"} onClick={props.onClick} style={{fontSize: props.fontSize, position: "relative"}}>
      {props.display_tags ? <AutoTag name={props.object_data.name}/> : ''}
      {!props.sim ? <button className="delete is-small" onClick={props.onDeleteAutomation}></button> : ""}
      <MeasurementsOnObject {...props}/>
      {props.display_materials ? <MaterialOnObject material={props.object_data.material} /> : <></>}
    </span>
  );
}


function Pipe(props) {
  const {object_data} = props;
  const {connections} = object_data;
  let pipe_string = "";
  for(let i = 0; i<4; i++)
    pipe_string += connections[i] ? i : "";

  return (
  <span className={"icon-pipe"+pipe_string} onClick={props.onClick} style={{fontSize: props.fontSize, position: "relative"}}>
    {!props.sim ? <button className="delete is-small" onClick={props.onDeleteAutomation}></button> : ""}
    {props.display_tags ? <AutoTag name={props.object_data.name}/> : ''}
    <MeasurementsOnObject {...props}/>
    {props.display_materials ? <MaterialOnObject material={props.object_data.material} /> : <></>}
  </span>
  );
}


function Pump(props) {
  const {object_data} = props;
  const {connections, end} = object_data;
  let icon_string = "";
  const display_reverse = object_data.on && object_data.reverse
  if(display_reverse){
    icon_string += end;
  }
  for(let i = 0; i<4; i++)
    icon_string += connections[i] && i !== end ? i : "";
  if(!display_reverse){
    icon_string += end;
  }

  return (
  <span className={"icon-pump"+icon_string} onClick={props.onClick} style={{fontSize: props.fontSize, position: "relative", color: object_data.on ? "green" : "black"}}>
    {!props.sim ? <button className="delete is-small" onClick={props.onDeleteAutomation}></button> : ""}
    {props.display_tags ? <AutoTag name={props.object_data.name}/> : ''}
    <MeasurementsOnObject {...props}/>
    {props.display_materials ? <MaterialOnObject material={props.object_data.material} /> : <></>}
  </span>
  );
}


function Pid(props){
  const {pid, demo_step} = props;
  const pv = isNaN(parseFloat(pid.pv)) ? 0.0 : parseFloat(pid.pv);
  const sp = isNaN(parseFloat(pid.sp)) ? 0.0 : parseFloat(pid.sp);
  const mv = isNaN(parseFloat(pid.mv)) ? 0.0 : parseFloat(pid.mv);
  const style = pid.meas ? {backgroundColor : pid.meas.background_color, color: pid.meas.text_color} : {};
    return(
          <a>
            <div className={demo_step === 42 ? "control has-background-warning" : "control"}  style={{marginBottom: 0, padding: "0.25rem"}} onDragOver={props.onDragOver} onDrop={props.onDrop}>
              <div className="tags has-addons">
                  <span className={pid.on ? "tag is-success" : "tag is-light"} onClick={props.onClick}>{pid.meas ? (pid.meas.name !== "" ? pid.meas.name : (pid.meas.automation ? pid.meas.automation.name : ''))  : 'X'}->{pid.act ? pid.act.name : 'X'}</span>
                  <span className={demo_step === 42 ? "tag is-warning" : "tag is-primary"} style={style} onClick={props.onClick}>{pv.toFixed(precision(pv, 3))} / {sp.toFixed(precision(sp, 3))} {pid.unit}</span>
                  <span className={demo_step === 42 ? "tag is-warning" : "tag is-primary"}  onClick={props.onClick}>{mv.toFixed(precision(mv, 3))}%</span>
                {!props.sim ? <span className="tag is-delete is-small" onClick={props.onDelete}></span> : ""}
              </div>
            </div>
          </a>
  );
}

function Measurement(props){
const {object_data, measurement_data, demo_step} = props;
let meas_val = 0.0;
  switch(measurement_data.meas_type) {
    case 1: // flow
      meas_val = object_data.flow;
      break;
    case 2: // pressure
      meas_val = object_data.pressure;
      break;
    case 3: // temperature
      meas_val = object_data.temperature;
      break;
    case 4:
      meas_val = object_data.auto_type === 4 ? object_data.speed_out : object_data.fill;
      break;
    case 5:
      meas_val = object_data.fill_m3;
      break;
    default:
      meas_val = 0.0;
}

  meas_val = parseFloat(meas_val);
  if(isNaN(meas_val)){
    return(<></>)
  }
  meas_val = meas_val.toFixed(precision(meas_val, 3))
  const demo = measurement_data.meas_type === 1 && (demo_step === 36 || (demo_step >= 46 && demo_step <= 48));
  const colors = demo ? {} : {backgroundColor : measurement_data.background_color, color: measurement_data.text_color}

  return(
    <div className="tags has-addons" style={{marginBottom: 0}} draggable={!props.sim} onDragStart={props.onDragStart}>
    {!props.sim ? <span className="tag is-delete is-small" onClick={props.onDelete}></span> : ""}
      <span className={demo ? "tag is-warning" : "tag"} style={{colors}}>{meas_val}</span>
      <span className={demo ? "tag is-warning" : "tag"} style={colors}>{measurement_data.unit}
      </span>
    </div>
);
}


function MeasurementsOnObject(props){
  const {measurements, demo_step} = props;
  const meas_disp = measurements ?   measurements.map((m, id) => (
    <Measurement key={id} demo_step={demo_step} object_data = {props.object_data} measurement_data = {m} index={id} sim={props.sim} onDelete={() => props.onDeleteMeasurement(id)} onDragStart={(ev) => props.onDragMeas(ev, id)}/>
    ))  : "";
  return(
    <div style={{position: "absolute", top: (props.display_tags ? "25%" : "5%"), left: "10%", display: 'block', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif"}}>
    {meas_disp}
    </div>
  );
}



function ValveTool(props) {
  const {connections}  = props;
  let icon_string = "";
  for(let i = 0; i<4; i++)
    icon_string += connections[i] ? i : "";
  return (
    <span className={"tag icon-valve"+icon_string+" is-white"} style={{fontSize: 40}} draggable="true" onDragStart={(ev) => props.onDrag(ev, new cValve({connections: connections}))} onClick={props.onClick}></span>
  );
}


function TankTool(props) {
  return (
    <span className={props.demo_step >= 13 && props.demo_step <= 15 ? "tag icon-tank is-warning" : "tag icon-tank is-white"} style={{fontSize: 40}} draggable="true" onDragStart={(ev) => props.onDrag(ev, new cTank())}></span>
  );
}


function ReactorTool(props) {
  return (
    <span className={"tag icon-barrel-chemical is-white"} style={{fontSize: 40}} draggable="true" onDragStart={(ev) => props.onDrag(ev, new cReactor())}></span>
  );
}

function SourceTool(props) {
  return (
    <span className={"tag icon-plumbering-water-supply is-white"} style={{fontSize: 40}} draggable="true" onDragStart={(ev) => props.onDrag(ev, new cSource())}></span>
  );
}


function TargetTool(props) {
  return (
    <span className={"tag icon-filter is-white"} style={{fontSize: 40}} draggable="true" onDragStart={(ev) => props.onDrag(ev, new cTarget())}></span>
  );
}


function MeasurementTool(props){
const {meas_type} = props;
const new_object_data = new cMeasurement({meas_type: meas_type});
  return(
    <span className={props.demo_step >= 32 && props.demo_step <= 34 ? "tag icon-meter is-warning" : "tag icon-meter is-white"}
    draggable="true"
          onDragStart={(ev) => props.onDrag(ev, new_object_data)}
          style={{fontSize: 40, position: "relative"}}>
      <div style={{position: "absolute", top: "5%", left: "10%", display: 'block'}}>
        <div className="tags has-addons" style={{marginBottom: 0}}>
          <span className="tag" style={{backgroundColor : new_object_data.background_color, color: new_object_data.text_color}}>{9.99}</span>
          <span className="tag" style={{backgroundColor : new_object_data.background_color, color: new_object_data.text_color}}>{new_object_data.unit}</span>
        </div>
      </div>
    </span>
);
}


function PipeTool(props) {
  const {connections} = props;
  let pipe_string = "";
  for(let i = 0; i<4; i++)
    pipe_string += connections[i] ? i : "";
  return (
    <span className={props.demo_step >= 18 && props.demo_step <= 20 ? "tag icon-pipe"+pipe_string+" is-warning" : "tag icon-pipe"+pipe_string+" is-white"}
    style={{fontSize: 40}} draggable="true" onDragStart={(ev) => props.onDrag(ev, new cPipe({connections: connections}))} onClick={props.onClick}></span>
  );
}


function PumpTool(props) {
  const {connections, end} = props;
  let icon_string = "";
  for(let i = 0; i<4; i++)
    icon_string += connections[i] && i !== end ? i : "";
  icon_string += end;
  return (
    <span className={"tag icon-pump"+icon_string+" is-white"} style={{fontSize: 40}} draggable="true" onDragStart={(ev) => props.onDrag(ev, new cPump({connections: connections, end: end}))} onClick={props.onClick}></span>
  );
}


function AutoTag(props){
  return(
    props.name ?
    <div style={{position: "absolute", top: "5%", left: "10%", display: 'block', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif"}}>
      <div className="tags has-addons" style={{marginBottom: 0}}>
        <span className="tag is-primary" >{props.name}</span>
      </div>
    </div> : ''
  );
}


function Empty(props) {
  const {sim} = props;
  return (
  <div className={sim ? "" : "box"}>
    <span className={"icon-pipe02"} style={{fontSize: 150*0.7, position: "relative", color: "white"}}>
    </span>
  </div>
  );
}


function ValveEdit(props) {
  return(
    <div className="card">
      <header className="card-header">
        <p className="card-header-title">
          <input className="input" type="input" value={props.edit_auto_obj.name}
              onChange={(e) => props.updateObject('automation', e.target.value, 'name')}/>

        </p>
        <button className="delete is-small" style={{align: "right"}} onClick={props.onClose}></button>
      </header>
      <div className="card-content">
          <div className="buttons are-medium">
            <button className={props.edit_auto_obj.open ? "button is-success" : "button is-light"} onClick={() => props.updateObject('automation',true, 'open')}>Open</button>
            <button className={!props.edit_auto_obj.open ? "button is-success" : "button is-white"} onClick={() => props.updateObject('automation',false, 'open')}>Close</button>
          </div>
          {!props.sim ? <div className="box">
            <label class="label">Type</label>
            <ValveTool connections={[1,0,1,0]} onClick={() => props.updateObject('automation',[1,0,1,0], 'connections')}/>
            <ValveTool connections={[0,1,0,1]} onClick={() => props.updateObject('automation',[0,1,0,1], 'connections')}/>
          </div>:""}
          </div>
            <footer className="card-footer">
            {!props.sim ? <a className="card-footer-item" onClick={props.onSave}>Save</a> : ''}
            {!props.sim ? <a className="card-footer-item" onClick={props.onDelete}>Delete</a> : ''}
            <a className="card-footer-item" onClick={props.onClose}>Close Window</a>
      </footer>
    </div>
  );
}


function TankEdit(props) {
  return(
    <div className="card">
      <header className="card-header">
        <p className={props.demo_step >= 28 && props.demo_step <= 29 ? "card-header-title has-background-warning" : "card-header-title"}>
          <input className="input" type="input" value={props.edit_auto_obj.name}
              onChange={(e) => props.updateObject('automation', e.target.value, 'name')}/>
        </p>
        <button className="delete is-small" style={{align: "right"}} onClick={props.onClose}></button>
      </header>
      <div className="card-content">
        <FieldWithBar value={props.edit_auto_obj.fill}  unit="%" label="fill [%]"
        min="0" max="100" step="5"
        updateObject={(value) => {props.updateObject('automation', value, 'fill')}}/>

        <FieldWithBar value={props.edit_auto_obj.volume}  unit="m³" label="volume max [m³]"
        min="0" max="100" step="1"
        updateObject={(value) => {props.updateObject('automation', value, 'volume')}}/>

        <FieldWithBar value={props.edit_auto_obj.height}  unit="m" label="height [m]"
        min="0" max="20" step="0.5"
        updateObject={(value) => {props.updateObject('automation', value, 'height')}}/>

        <FieldWithBar value={props.edit_auto_obj.temperature}  unit="°C" label="temp. [°C]"
        min="0" max="150" step="1"
        updateObject={(value) => {props.updateObject('automation', value, 'temperature')}}/>

  {props.edit_auto_obj.material.map((mat, mat_idx) => (
    <FieldWithBar key={"material"+mat_idx} value={mat}  unit="" label={"material "+(parseInt(mat_idx)+1)}
    min="0" max="255" step="1"
    updateObject={(value) => {props.edit_auto_obj.material[mat_idx]=value; props.update()}}/>))
}

      </div>
      <footer className="card-footer">
      {!props.sim ? <a className="card-footer-item" onClick={props.onSave}>Save</a> : ''}
      {!props.sim ? <a className="card-footer-item" onClick={props.onDelete}>Delete</a> : ''}
        <a className="card-footer-item" onClick={props.onClose}>Close</a>
      </footer>
    </div>
  );
}


function ReactorEdit(props) {
  return(
    <div className="card">
      <header className="card-header">
        <p className="card-header-title">
          <input className="input" type="input" value={props.edit_auto_obj.name}
              onChange={(e) => props.updateObject('automation', e.target.value, 'name')}/>
        </p>
        <button className="delete is-small" style={{align: "right"}} onClick={props.onClose}></button>
      </header>
      <div className="card-content">
        <FieldWithBar value={props.edit_auto_obj.fill}  unit="%" label="fill [%]"
        min="0" max="100" step="5"
        updateObject={(value) => {props.updateObject('automation', value, 'fill')}}/>

        <FieldWithBar value={props.edit_auto_obj.volume}  unit="m³" label="volume max [m³]"
        min="0" max="100" step="1"
        updateObject={(value) => {props.updateObject('automation', value, 'volume')}}/>

        <FieldWithBar value={props.edit_auto_obj.height}  unit="m" label="height [m]"
        min="0" max="20" step="0.5"
        updateObject={(value) => {props.updateObject('automation', value, 'height')}}/>
        </div>
              <div className="card-content">
        <div className="buttons are-medium">
          <button className={props.edit_auto_obj.temperature_control ? "button is-success" : "button is-light"} onClick={() => props.updateObject('automation',true, 'temperature_control')}>Temp. ctrl on</button>
          <button className={!props.edit_auto_obj.temperature_control  ? "button is-success" : "button is-white"} onClick={() => props.updateObject('automation',false, 'temperature_control')}>Temp. ctrl off</button>
        </div>

        <FieldWithBar value={props.edit_auto_obj.temperature}  unit="°C" label="temp. [°C]"
        min="0" max="150" step="1"
        updateObject={(value) => {props.updateObject('automation', value, 'temperature')}}/>

        <FieldWithBar value={props.edit_auto_obj.set_temperature}  unit="°C" label="set temp. [°C]"
        min="0" max="150" step="1"
        updateObject={(value) => {props.updateObject('automation', value, 'set_temperature')}}/>
        </div>
              <div className="card-content">
        <div className="buttons are-medium">
          <button className={props.edit_auto_obj.pressure_control ? "button is-success" : "button is-light"} onClick={() => props.updateObject('automation',true, 'pressure_control')}>Press. ctrl on</button>
          <button className={!props.edit_auto_obj.pressure_control  ? "button is-success" : "button is-white"} onClick={() => props.updateObject('automation',false, 'pressure_control')}>Press ctrl off</button>
        </div>

        <FieldWithBar value={props.edit_auto_obj.pressure}  unit="bar" label="press. [bar]"
        min="0.1" max="10" step="0.1"
        updateObject={(value) => {props.updateObject('automation', value, 'pressure')}}/>

        <FieldWithBar value={props.edit_auto_obj.set_pressure}  unit="bar" label="set press. [bar]"
        min="0.1" max="10" step="0.1"
        updateObject={(value) => {props.updateObject('automation', value, 'set_pressure')}}/>

        <div className="buttons are-medium">
          <button className={props.edit_auto_obj.mixing_on ? "button is-success" : "button is-light"} onClick={() => props.updateObject('automation',true, 'mixing_on')}>Mixer on</button>
          <button className={!props.edit_auto_obj.mixing_on  ? "button is-success" : "button is-white"} onClick={() => props.updateObject('automation',false, 'mixing_on')}>Mixer off</button>
        </div>


  {props.edit_auto_obj.material.map((mat, mat_idx) => (
    <FieldWithBar key={"material"+mat_idx} value={mat}  unit="" label={"material "+(parseInt(mat_idx)+1)}
    min="0" max="255" step="1"
    updateObject={(value) => {props.edit_auto_obj.material[mat_idx]=value; props.update()}}/>))
}

      </div>
      <footer className="card-footer">
      {!props.sim ? <a className="card-footer-item" onClick={props.onSave}>Save</a> : ''}
      {!props.sim ? <a className="card-footer-item" onClick={props.onDelete}>Delete</a> : ''}
        <a className="card-footer-item" onClick={props.onClose}>Close</a>
      </footer>
    </div>
  );
}


function SourceEdit(props) {
  return(
    <div className="card">
      <header className="card-header">
        <p className="card-header-title">
          <input className="input" type="input" value={props.edit_auto_obj.name}
              onChange={(e) => props.updateObject('automation', e.target.value, 'name')}/>
        </p>
        <button className="delete is-small" style={{align: "right"}} onClick={props.onClose}></button>
      </header>
      <div className="card-content">
        <FieldWithBar value={props.edit_auto_obj.pressure}  unit="bar" label="pressure [bar]"
        min="0" max="10" step="0.1"
        updateObject={(value) => {props.updateObject('automation', value, 'pressure')}}/>
        {props.edit_auto_obj.material.map((mat, mat_idx) => (
          <FieldWithBar value={mat}  unit="" label={"material "+(parseInt(mat_idx)+1)}
          min="0" max="255" step="1"
          updateObject={(value) => {props.edit_auto_obj.material[mat_idx]=value; props.update()}}/>))
      }
      </div>
      <footer className="card-footer">
      {!props.sim ? <a className="card-footer-item" onClick={props.onSave}>Save</a> : ''}
      {!props.sim ? <a className="card-footer-item" onClick={props.onDelete}>Delete</a> : ''}
        <a className="card-footer-item" onClick={props.onClose}>Close</a>
      </footer>
    </div>
  );
}


function TargetEdit(props) {
  return(
    <div className="card">
      <header className="card-header">
        <p className="card-header-title">
          <input className="input" type="input" value={props.edit_auto_obj.name}
              onChange={(e) => props.updateObject('automation', e.target.value, 'name')}/>
        </p>
        <button className="delete is-small" style={{align: "right"}} onClick={props.onClose}></button>
      </header>
      <footer className="card-footer">
      {!props.sim ? <a className="card-footer-item" onClick={props.onSave}>Save</a> : ''}
      {!props.sim ? <a className="card-footer-item" onClick={props.onDelete}>Delete</a> : ''}
        <a className="card-footer-item" onClick={props.onClose}>Close</a>
      </footer>
    </div>
  );
}


function PipeEdit(props) {
  return(
    <div className="card">
      <header className="card-header">
        <p className="card-header-title">
          <input className="input" type="input" value={props.edit_auto_obj.name}
              onChange={(e) => props.updateObject('automation', e.target.value, 'name')}/>

        </p>
        <button className="delete is-small" style={{align: "right"}} onClick={props.onClose}></button>
      </header>
      <div className="card-content">
        <div className="level">
          <div className="level-left" >
            <p className="control level-item has-icons-right">
              <input className="input" style={{width: 70}} type="input" value={props.edit_auto_obj.dim}
                onChange={(e) => props.updateObject('automation', e.target.value, 'dim')}/>
              <span class="icon is-small is-right">mm</span>
            </p>
            <p className="label level-item">diameter</p>
          </div>
        </div>
          {!props.sim ? <div className="box">
            <label class="label">Type</label>
              <PipeTool connections={[1,0,1,0]} onClick={() => {props.edit_auto_obj.connections=[1,0,1,0]; props.updateAutomation()}}/>
              <PipeTool connections={[0,1,0,1]} onClick={() => {props.edit_auto_obj.connections=[0,1,0,1]; props.updateAutomation()}}/>
              <PipeTool connections={[1,1,0,0]} onClick={() => {props.edit_auto_obj.connections=[1,1,0,0]; props.updateAutomation()}}/>
              <PipeTool connections={[0,1,1,0]} onClick={() => {props.edit_auto_obj.connections=[0,1,1,0]; props.updateAutomation()}}/>
              <PipeTool connections={[0,0,1,1]} onClick={() => {props.edit_auto_obj.connections=[0,0,1,1]; props.updateAutomation()}}/>
              <PipeTool connections={[1,0,0,1]} onClick={() => {props.edit_auto_obj.connections=[1,0,0,1]; props.updateAutomation()}}/>
              <PipeTool connections={[1,1,1,0]} onClick={() => {props.edit_auto_obj.connections=[1,1,1,0]; props.updateAutomation()}}/>
              <PipeTool connections={[0,1,1,1]} onClick={() => {props.edit_auto_obj.connections=[0,1,1,1]; props.updateAutomation()}}/>
              <PipeTool connections={[1,0,1,1]} onClick={() => {props.edit_auto_obj.connections=[1,0,1,1]; props.updateAutomation()}}/>
              <PipeTool connections={[1,1,0,1]} onClick={() => {props.edit_auto_obj.connections=[1,1,0,1]; props.updateAutomation()}}/>
              <PipeTool connections={[1,1,1,1]} onClick={() => {props.edit_auto_obj.connections=[1,1,1,1]; props.updateAutomation()}}/>
          </div> : ""}
          </div>
            <footer className="card-footer">
            {!props.sim ? <a className="card-footer-item" onClick={props.onSave}>Save</a> : ''}
            {!props.sim ? <a className="card-footer-item" onClick={props.onDelete}>Delete</a> : ''}
            <a className="card-footer-item" onClick={props.onClose}>Close Window</a>
      </footer>
    </div>
  );
}


function PumpEdit(props) {
  return(
    <div className="card">
      <header className="card-header">
        <p className="card-header-title">
          <input className="input" type="input" value={props.edit_auto_obj.name}
              onChange={(e) => props.updateObject('automation', e.target.value, 'name')}/>

        </p>
        <button className="delete is-small" style={{align: "right"}} onClick={props.onClose}></button>
      </header>
      <div className="card-content">
          <div className="buttons are-medium">
            <button className={props.edit_auto_obj.on ? "button is-success" : "button is-light"} onClick={() => props.updateObject('automation',true, 'on')}>Start</button>
            <button className={!props.edit_auto_obj.on ? "button is-success" : "button is-white"} onClick={() => props.updateObject('automation',false, 'on')}>Stop</button>
            <button className={props.edit_auto_obj.reverse ? "button is-warning" : "button is-white"} onClick={() => props.updateObject('automation',!props.edit_auto_obj.reverse, 'reverse')}>Reverse</button>
          </div>
          <FieldWithBar value={props.edit_auto_obj.setpoint}  unit="%" label="speed [%]"
          min="0" max="100" step="5"
          updateObject={(value) => {props.updateObject('automation', value, 'setpoint')}}/>
          {!props.sim ? <div className="box">
            <label class="label">Type</label>
              <PumpTool connections={[1,0,1,0]} end={2} onClick={() => {props.edit_auto_obj.connections=[1,0,1,0]; props.edit_auto_obj.end=2; props.updateAutomation()}}/>
              <PumpTool connections={[1,0,1,0]} end={0} onClick={() => {props.edit_auto_obj.connections=[1,0,1,0]; props.edit_auto_obj.end=0; props.updateAutomation()}}/>
              <PumpTool connections={[0,1,0,1]} end={1} onClick={() => {props.edit_auto_obj.connections=[0,1,0,1]; props.edit_auto_obj.end=1; props.updateAutomation()}}/>
              <PumpTool connections={[0,1,0,1]} end={3} onClick={() => {props.edit_auto_obj.connections=[0,1,0,1]; props.edit_auto_obj.end=3; props.updateAutomation()}}/>
          </div> : ""}
          </div>
            <footer className="card-footer">
            {!props.sim ? <a className="card-footer-item" onClick={props.onSave}>Save</a> : ''}
            {!props.sim ? <a className="card-footer-item" onClick={props.onDelete}>Delete</a> : ''}
            <a className="card-footer-item" onClick={props.onClose}>Close Window</a>
      </footer>
    </div>
  );
}


class PidEdit extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      pid: new cPID(),
    }
  }

  update(pid){
    // Here check all te values before passing back to the parent
    const pid_up = this.props.pid;
    pid_up.name = pid.name;
    pid_up.on = pid.on;
    pid_up.sp = pid.sp ? (isNaN(pid.sp) ? 0.0 : pid.sp) : pid_up.sp;
    pid_up.mv = pid.mv ? (isNaN(pid.mv) ? 0.0 : pid.mv) : pid_up.mv;
    pid_up.p_faktor = pid.p_faktor ? (isNaN(pid.p_faktor) ? 0.0 : pid.p_faktor) : pid_up.p_faktor;
    pid_up.i_faktor = pid.i_faktor ? (isNaN(pid.i_faktor) ? 0.0 : pid.i_faktor) : pid_up.i_faktor;
    pid_up.d_faktor = pid.d_faktor ? (isNaN(pid.d_faktor) ? 0.0 : pid.d_faktor) : pid_up.d_faktor;
    this.setState({pid: pid});
    this.props.updatePids();
  }

  componentDidUpdate(prevProps) {
    const {pid} = this.state;
    if(this.props.pid.mv !== pid.mv && pid.on){
      pid.mv = this.props.pid.mv;
      this.setState({pid: pid});
    }

  }

  componentDidMount() {
    this.setState({pid: {...this.props.pid}});
  }

  render(){
    const{pid} = this.state;
    pid.meas = this.props.pid.meas;
    pid.act = this.props.pid.act;
    const{demo_step} = this.props;
    if(!pid){
      return "load";
    }
    return(
      <div className="card" onDragOver={this.props.onDragOver} onDrop={this.props.onDrop}>
        <header className="card-header">
          <p className="card-header-title">
            <input className="input" type="input" value={pid.name}
                onChange={(e) => {pid.name=e.target.value; this.update(pid)}}/>
          </p>
          <button className="delete is-small" style={{align: "right"}} onClick={this.props.onClose}></button>
        </header>
        <div className="card-content">
            <div className="buttons are-medium">
              <button className={pid.on ? "button is-success" : "button is-light"} onClick={() => {pid.on=true; this.update(pid)}}>On</button>
              <button className={!pid.on ? "button is-success" : "button is-light"} onClick={() => {pid.on=false; this.update(pid)}}>Off</button>
            </div>

            <SmallField value={pid.pv}  unit={pid.unit} label="process value" readonly={true}/>

            <FieldWithBar value={pid.sp}  unit={pid.unit} label="setpoint"
            min="0" max="100" step="1"
            updateObject={(value) => {pid.sp=value; this.update(pid)}}/>


            {pid.on ? <SmallField value={pid.mv}  unit={"%"} label="control value" readonly={true}/> :
              <FieldWithBar value={pid.mv}  unit={"%"} label="control value"
              min="0" max="100" step="1"
              updateObject={(value) => {pid.mv=value; this.update(pid)}}/>
            }

            <FieldWithBar value={pid.p_faktor}  unit={""} label="P"
            min="0.01" max="100" step="0.01"
            updateObject={(value) => {pid.p_faktor=value; this.update(pid)}}/>
            <FieldWithBar value={pid.i_faktor}  unit={""} label="I"
            min="0.01" max="100" step="0.01"
            updateObject={(value) => {pid.i_faktor=value; this.update(pid)}}/>
            <FieldWithBar value={pid.d_faktor}  unit={""} label="D"
            min="0.01" max="100" step="0.01"
            updateObject={(value) => {pid.d_faktor=value; this.update(pid)}}/>

            <div className="buttons are-medium">
              <button className={pid.meas ? "button is-success" : ( demo_step === 47 ? "button is-warning" : "button is-white is-static") }>{pid.meas ? (pid.meas.name !== "" ? pid.meas.name : (pid.meas.automation ? pid.meas.automation.name : ''))  : 'drop measurement here'}</button>
              <button className={pid.act ? "button is-success" : "button is-white is-static" }>{pid.act ? pid.act.name : 'drop actuator (pump) here'}</button>
            </div>
      </div>
      <footer className="card-footer">
        {!this.props.sim ? <a className="card-footer-item" onClick={this.props.onSave}>Save</a> : ''}
        {!this.props.sim ? <a className="card-footer-item" onClick={this.props.onDelete}>Delete</a> : ''}
      <a className="card-footer-item" onClick={this.props.onClose}>Close Window</a>
      </footer>
    </div>
    );
  }
}


function PhaseTransferDetails(props){
  if(!props.phase){
    return(<p>No phase selected</p>);
  }
  const {source_obj, target_obj} = props.phase;
  return(

        <div className="control mb-0 p-1">
          <div className="tags has-addons are-small">
            <span className={"tag"+ (props.phase.state === 1 ? " is-success" : "")}>
              {source_obj ? source_obj.name : ""}
            </span>
            <span className={"tag"+(props.phase.state === 1 ? " is-success" : "")}>
              {target_obj ? target_obj.name : ""}
            </span>
            <span className={"tag"+(props.phase.state === 1 ? " is-success" : "")}>
              {props.phase.parameters.goal_param.toFixed(1) + " m³"}
            </span>
          </div>
        </div>

  );
}


function PhaseReactionDetails(props){
  if(!props.phase){
    return(<p>No phase selected</p>);
  }
  const {reactor_obj} = props.phase;
  return(

        <div className="control mb-0 p-1">
          <div className="tags has-addons are-small">
            <span className={"tag"+ (props.phase.state === 1 ? " is-success" : "")}>
              {reactor_obj ? reactor_obj.name : ""}
            </span>
            <span className={"tag"+(props.phase.state === 1 ? " is-success" : "")}>
              {props.phase.parameters.time.toFixed(1) + " s"}
            </span>
          </div>
        </div>

  );
}


function PhaseTransfer(props){
  if(!props.phase){
    return(<p>No phase selected</p>);
  }
  const {source_obj, target_obj} = props.phase;
  let progress = 0.0;
  switch(props.phase.parameters.goal_type){
    case 1:
      progress = props.phase.volume/1000.0;
    break;
    case 2:
      progress = props.phase.source_obj.fill_m3;
    break;
    case 3:
      progress = props.phase.target_obj.fill_m3;
    break;
  }
  return(

      <div className="field is-grouped is-grouped-multiline">
        <div className="control">
          <a onClick={props.onEdit}>
            <div className="tags has-addons are-medium">
              <span className={(props.phase.state === 1 ? "tag is-success" : "tag is-white")}>
                {source_obj ? source_obj.name : "no source"}
              </span>
              <span className={(props.phase.state === 1 ? "tag is-success" : "tag is-white")}>
                {target_obj ? target_obj.name : "no target"}
              </span>
              <span className={(props.phase.state === 1 ? "tag is-success" : "tag is-white")}>
                {progress.toFixed(4)+" m³ / "+props.phase.parameters.goal_param.toFixed(4)+" m³"}
              </span>
            </div>
          </a>
        </div>

        <div className="control">
          <div className="tags has-addons are-medium">
            <div className="buttons are-small">
              {props.is_active && props.sim ? <>
                <button className={"button icon-play3" + (props.demo_step === 65 ? " is-warning" : props.phase.state === 1 ? " is-primary" : "")} onClick={()=>props.phase.start(props.routes, props.pids, props.automation)}></button>
                <button className={"button icon-pause2" + (props.phase.state === 10 ? " is-primary" : "")} onClick={()=>props.phase.pause()}></button>
                <button className={"button icon-stop2" + (props.phase.state === 0 ? " is-primary" : "")} onClick={()=>props.phase.stop()}></button>
                </>
               : <></>}
              {props.phase.state === 0  ? <button className="button is-danger" onClick={props.onAbort}>X</button> : <></>}
            </div>
          </div>
        </div>

      </div>

  );
}


function PhaseTransferManual(props){

  const phase = new cPhaseTransfer();
  phase.parameters.source = {row: 0, col: 0};
  phase.source_obj = new cTank();
  phase.source_obj.name = "T01";
  phase.parameters.target = {row:0, col: 3};
  phase.target_obj = new cTank();
  phase.target_obj.name = "T02";
  phase.parameters.goal_type =  1; // 1 - volume
  phase.parameters.goal_param = 3.0; // volume
  phase.parameters.flow_control = 1; // 1 - flow Controllers
  phase.parameters.flow_control_param = 5.0; //flow
  phase.state = 1;
  const progress = 1.2;
  return(
      <div className="field is-grouped is-grouped-multiline">
        <div className="control">
          <a>
            <div className="tags has-addons are-medium">
              <span className={(phase.state === 1 ? "tag is-success" : "tag is-white")}>
                {phase.source_obj.name}
              </span>
              <span className={(phase.state === 1 ? "tag is-success" : "tag is-white")}>
                {phase.target_obj.name}
              </span>
              <span className={(phase.state === 1 ? "tag is-success" : "tag is-white")}>
                {progress.toFixed(1)+" m³ / "+phase.parameters.goal_param.toFixed(1)+" m³"}
              </span>
            </div>
          </a>
        </div>

        <div className="control">
          <div className="tags has-addons are-medium">
            <div className="buttons are-small">
                <button className={"button icon-play3" + (phase.state === 1 ? " is-primary" : "")}></button>
                <button className={"button icon-pause2" + (phase.state === 10 ? " is-primary" : "")}></button>
                <button className={"button icon-stop2" + (phase.state === 0 ? " is-primary" : "")}></button>
                <button className="button is-danger">X</button>
            </div>
          </div>
        </div>
      </div>

  );
}



function PhaseReaction(props){
  if(!props.phase){
    return(<p>No phase selected</p>);
  }
  const {reactor_obj} = props.phase;

  return(

      <div className="field is-grouped is-grouped-multiline">
        <div className="control">
          <a onClick={props.onEdit}>
            <div className="tags has-addons are-medium">
              <span className={(props.phase.state === 1 ? "tag is-success" : "tag is-white")}>
                {reactor_obj ? reactor_obj.name : "no reactor"}
              </span>
              <span className={(props.phase.state === 1 ? "tag is-success" : "tag is-white")}>
                {props.phase.time.toFixed(1)+" s / "+props.phase.parameters.time.toFixed(1)+" s"}
              </span>
            </div>
          </a>
        </div>

        <div className="control">
          <div className="tags has-addons are-medium">
            <div className="buttons are-small">
              {props.is_active && props.sim ? <>
                <button className={"button icon-play3" + (props.phase.state === 1 ? " is-primary" : "")} onClick={()=>props.phase.start(props.routes, props.pids, props.automation)}></button>
                <button className={"button icon-pause2" + (props.phase.state === 10 ? " is-primary" : "")} onClick={()=>props.phase.pause()}></button>
                <button className={"button icon-stop2" + (props.phase.state === 0 ? " is-primary" : "")} onClick={()=>props.phase.stop()}></button>
                </>
               : <></>}
              {props.phase.state === 0  ? <button className="button is-danger" onClick={props.onAbort}>X</button> : <></>}
            </div>
          </div>
        </div>

      </div>

  );
}


function PhaseDisplay(props){
  const {phase_num} = props.phase;
  switch(phase_num){
    case 1:
      return(<PhaseTransfer {...props}/>);
    case 2:
      return(<PhaseReaction {...props}/>);
    default:
      return(<></>);
  }
}


function PhaseEdit(props){
  const {phase_num} = props.phase;
  switch(phase_num){
    case 1:
      return(<PhaseTransferEdit {...props}/>);
    case 2:
      return(<PhaseReactionEdit {...props}/>);
    default:
      return(<></>);
  }
}



class PhaseSelect extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      phase_num: 1,
      edit: false,
      loaded: false,
    }
  }

  changePhase(phase_num){
    switch(phase_num){
      case 1:
        if(this.props.phase){
          this.props.phase = new cPhaseTransfer();
          this.props.update();
        }
        break;
      case 2:
        if(this.props.phase){
          this.props.phase = new cPhaseReaction();
          this.props.update();
        }
        break;
      default:
        if(this.props.phase){
          this.props.phase = new cPhaseTransfer();
          this.props.update();
        }
      }
      this.setState({phase_num: phase_num});
  }

  addPhase(){
    const {phase_num} = this.state;
    switch(phase_num){
      case 1:
        const new_phase1 = new cPhaseTransfer();
        this.props.addPhase(new_phase1);
      break;
      case 2:
        const new_phase2 = new cPhaseReaction();
        this.props.addPhase(new_phase2);
      break;
      default:
        const new_phase_def = new cPhaseTransfer();
        this.props.addPhase(new_phase_def);
    }
  }

  details(){
    const {phase_num} = this.props.phase ? this.props.phase : this.state;
    switch(phase_num){
      case 1:
        return(<PhaseTransferDetails phase={this.props.phase}/>);
      case 2:
        return(<PhaseReactionDetails phase={this.props.phase}/>);
      default:
        return(<></>);
    }
  }

  edit(){
    const {phase_num} = this.props.phase ? this.props.phase : this.state;
    switch(phase_num){
      case 1:
        return(  <PhaseTransferEdit in_select={true} phase={this.props.phase} automation={this.props.automation}
          update={this.props.update} onClose={() => this.setState({edit: false})}/>);
      case 2:
        return(  <PhaseReactionEdit in_select={true} phase={this.props.phase} automation={this.props.automation}
          update={this.props.update} onClose={() => this.setState({edit: false})}/>);
      default:
        return(<></>);
    }
  }

  componentDidMount(){
    if(this.props.phase){
      this.setState({phase_num: this.props.phase.phase_num, loaded: true});
    }
    else {
      this.setState({loaded: true});
    }
  }

  render(){
    const {loaded} = this.state;
    const {demo_step, recipe_editor} = this.props;
    if(!loaded){
      return(<></>);
    }
    return(
        <>
          <div className="field is-grouped is-grouped-multiline">
                <div className="control">
                  <div className="select is-primary is-small">
                  { this.props.phase ?
                    <select value={this.props.phase.phase_num} readOnly>
                      <option key={1} value={1}>Transfer</option>
                      <option key={2} value={2}>Reaction</option>
                    </select>
                    :
                    <select value={this.state.phase_num} onChange={(e) => {this.setState({phase_num: parseInt(e.target.value)})}}>
                      <option key={1} value={1}>Transfer</option>
                      <option key={2} value={2}>Reaction</option>
                    </select>
                  }
                  </div>
                </div>
              {this.props.phase ? <div className="control">
              {this.details()}
              </div> : <></>}

              {!this.props.phase ?
                <>
                <div className="control">
                  <button className={((demo_step === 54 && !recipe_editor)
                    || (demo_step === 80 && recipe_editor))
                    ? "button is-warning icon-plus is-small"
                    : "button is-light icon-plus is-small"}
                    onClick={() => this.addPhase()}></button>
                </div>
                </>
: <></>}
              {this.props.phase ?
                <div className="control">
                  <button className="button icon-pencil" onClick={() => this.setState({edit: !this.state.edit})}></button>
                  <button className="button is-danger" onClick={this.props.onDelete}>X</button>
              </div> : <></>}
          </div>
          {this.props.phase && this.state.edit ?
            this.edit() : <></>}
            </>
    );
  }
}


function checkFloat(input, def){
  const temp_float = parseFloat(input);
  return isNaN(temp_float) ? def : temp_float;
}


class PhaseTransferEdit extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      phase: new cPhaseTransfer(),
      phase_old : undefined,
      sources: [],
      targets: [],
    }
  }

  update(phase){
    // Here check all te values before passing back to the parent
    const phase_up = this.props.phase;
    let {phase_old} = this.state;
    phase.parameters.goal_type = parseInt(phase.parameters.goal_type);
    phase.parameters.flow_control = parseInt(phase.parameters.flow_control);

    if(phase_up){
      phase_up.source_obj = phase.source_obj;
      phase_up.parameters.source = phase.parameters.source;
      phase_up.target_obj = phase.target_obj;
      phase_up.parameters.target = phase.parameters.target;
      phase_up.parameters.goal_type = phase.parameters.goal_type;
      phase_up.parameters.goal_param = checkFloat(phase.parameters.goal_param, phase_up.parameters.goal_param);
      phase_up.parameters.flow_control = phase.parameters.flow_control;

      phase_up.parameters.flow_control_param = checkFloat(phase.parameters.flow_control_param, phase_up.parameters.flow_control_param);


    }
    const old_source_obj = phase_old ? phase_old.source_obj : undefined;

    if(phase.source_obj !== old_source_obj){
      const {targets} = this.findSourcesTargets(this.props.phase, this.props.automation);
      phase_old = {source_obj: phase.source_obj, target_obj: phase.target_obj, parameters:{...phase.parameters}}
      if(phase.source_obj === phase.target_obj){
        phase.target_obj = undefined;
        phase_up.target_obj = undefined;
      }
      this.setState({phase: phase, phase_old: phase_old, targets: targets});
    }
    else{
      this.setState({phase: phase});
    }

    this.props.update();
  }

  findSourcesTargets(phase, automation){
    const source_obj = phase ? phase.source_obj : undefined;
    const sources = [];
    const targets = [];
    for (let row = 0; row < automation.length; row++){
      for (let col = 0; col < automation[row].length; col++){
        if(automation[row][col].name && automation[row][col].name !== ""){
          if(automation[row][col].is_source){
            sources.push({source: automation[row][col], row: row, col: col});
            }
          if(automation[row][col].is_target && automation[row][col] !== source_obj){
            targets.push({target: automation[row][col], row: row, col: col});
            }
          }
        }
      }
    sources.push({source: undefined, row: undefined, col: undefined});
    targets.push({target: undefined, row: undefined, col: undefined});
    return ({sources: sources, targets: targets});
  }

  componentDidUpdate(prevProps) {
    if (prevProps.automation !== this.props.automation) {
      const {sources, targets} = this.findSourcesTargets(this.props.phase, this.props.automation);
      this.setState({sources: sources, targets: targets});
    }

    if (prevProps.demo_step !== this.props.demo_step && this.props.demo_step === 58){
      const {phase} = this.state;
      phase.parameters = {...this.props.phase.parameters};
      phase.source_obj = this.props.phase.source_obj;
      phase.target_obj = this.props.phase.target_obj;
      this.setState({phase: phase});
    }
  }

  componentDidMount() {
    const {sources, targets} = this.findSourcesTargets(this.props.phase, this.props.automation);
    if(this.props.phase)
      this.setState(
        {phase: {source_obj: this.props.phase.source_obj, target_obj: this.props.phase.target_obj, parameters:{...this.props.phase.parameters}}, sources: sources, targets: targets});
  }

  render(){
    const{phase, sources, targets} = this.state;
    const{demo_step} = this.props;
    let source_idx = sources.length-1;
    let target_idx = targets.length-1;
    for(let i=0; i<sources.length-1; i++){
      if(sources[i].source === phase.source_obj){
        source_idx = i;
        break;
      }
    }
    for(let i=0; i<targets.length-1; i++){
      if(targets[i].target === phase.target_obj){
        target_idx = i;
        break;
      }
    }

    return(
<div className={!this.props.in_select ? "box" : ""}>
  <div className="card" onDragOver={this.props.onDragOver} onDrop={this.props.onDrop}>
    <header className="card-header">
      <p className="card-header-title">
        Phase Transfer
      </p>
      <button className="delete is-small" style={{align: "right"}} onClick={this.props.onClose}></button>
    </header>
    <div className="card-content">
      <div className="field is-horizontal">

        <div className="field-label is-normal">
          <label className="label">S->T</label>
        </div>
        <div className="field-body">
          <div className="field">
            <div className="control">
              <div className={demo_step === 56 ? "select is-warning" : "select is-primary"}>
                <select value={source_idx} onChange={(e) => {phase.source_obj = sources[e.target.value].source;
                  phase.parameters.source = {row: sources[e.target.value].row, col: sources[e.target.value].col};
                  this.update(phase)}}>>
                  {sources.map((el, idx) => (<option key={idx} value={idx}>{el.source ? el.source.name : "Select source"}</option>))}
                </select>
              </div>
            </div >
          </div>
          <div className="field">
            <div className="control is-expanded">
              <div className="select is-primary">
                <select value={target_idx} onChange={(e) => {phase.target_obj = targets[e.target.value].target;
                  phase.parameters.target = {row: targets[e.target.value].row, col: targets[e.target.value].col};
                  this.update(phase)}}>
                  {targets.map((el, idx) => (<option key={idx} value={idx}>{el.target ? el.target.name : "Select target"}</option>))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="field is-horizontal">
        <div className="field-label is-normal">
          <label className="label">Goal:</label>
        </div>
        <div className="field-body">
          <div className="field">
            <div className="control">
              <div className="select is-primary">
                <select value={phase.parameters.goal_type} onChange={(e) => {phase.parameters.goal_type= e.target.value; this.update(phase)}}>
                  <option key="0" value={0}>Continuous</option>
                  <option key="1" value={1}>Volume Counter</option>
                  <option key="2" value={2}>Volume in source</option>
                  <option key="3" value={3}>Volume in target</option>
                </select>
              </div>
            </div >
          </div>
          <div className="field">
            <p className="control is-expanded has-icons-right">
              <input className="input" type="input" placeholder="Volume" value={phase.parameters.goal_param} onChange={(e) => {phase.parameters.goal_param = e.target.value; this.update(phase)}}/>
              <span className="icon is-small is-right">m³</span>
            </p>
          </div>
        </div>
      </div>
      <div className="field is-horizontal">
        <div className="field-label is-normal">
          <label className="label">Flow:</label>
        </div>
        <div className="field-body">
          <div className="field">
            <div className="control">
              <div className="select is-primary">
                <select value={phase.parameters.flow_control} onChange={(e) => {phase.parameters.flow_control = e.target.value; this.update(phase)}}>
                  <option key="0" value={0}>Fixed speed</option>
                  <option key="1" value={1}>Flow control</option>
                </select>
              </div>
            </div>
          </div>
          <div className="field">
            <p className="control is-expanded has-icons-right">
              <input className="input" type="input" placeholder="Speed/Flow" value={phase.parameters.flow_control_param} onChange={(e) => {phase.parameters.flow_control_param = e.target.value; this.update(phase)}}/>
              <span className="icon is-small is-right">{phase.parameters.flow_control === 1 ? "m³/h" : "%"}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
</div>
</div>
      )
  }
}


class PhaseReactionEdit extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      phase: new cPhaseReaction(),
      reactors: [],
    }
  }

  update(phase){
    // Here check all te values before passing back to the parent
    const phase_up = this.props.phase;

    phase.parameters.goal_type = parseInt(phase.parameters.goal_type);
    phase.parameters.flow_control = parseInt(phase.parameters.flow_control);

    if(phase_up){
      phase_up.reactor_obj = phase.reactor_obj;
      phase_up.parameters.reactor = phase.parameters.reactor;
      phase_up.parameters.time = checkFloat(phase.parameters.time, phase_up.parameters.time);
      phase_up.parameters.temperature_control = phase.parameters.temperature_control;
      phase_up.parameters.set_temperature = checkFloat(phase.parameters.set_temperature, phase_up.parameters.set_temperature);
      phase_up.parameters.pressure_control = phase.parameters.pressure_control;
      phase_up.parameters.set_pressure = checkFloat(phase.parameters.set_pressure, phase_up.parameters.set_pressure);
      phase_up.parameters.mixing_on = phase.parameters.mixing_on;
    }
    this.setState({phase: phase});
    this.props.update();
  }

  findReactors(phase, automation){
    const reactors = [];

    for (let row = 0; row < automation.length; row++){
      for (let col = 0; col < automation[row].length; col++){
        if(automation[row][col].name && automation[row][col].name !== ""){
          if(automation[row][col].is_reactor){
            reactors.push({reactor: automation[row][col], row: row, col: col});
            }
          }
        }
      }
    reactors.push({reactor: undefined, row: undefined, col: undefined});
    return ({reactors: reactors});
  }

  componentDidUpdate(prevProps) {
    if (prevProps.automation !== this.props.automation) {
      const {reactors} = this.findReactors(this.props.phase, this.props.automation);
      this.setState({reactors: reactors});
    }
  }

  componentDidMount() {
    const {reactors} = this.findReactors(this.props.phase, this.props.automation);
    if(this.props.phase)
      this.setState(
        {phase: {reactor_obj: this.props.phase.reactor_obj, parameters:{...this.props.phase.parameters}}, reactors: reactors});
  }

  render(){
    const{phase, reactors} = this.state;
    let reactor_idx = reactors.length-1;
    for(let i=0; i<reactors.length-1; i++){
      if(reactors[i].reactor === phase.reactor_obj){
        reactor_idx = i;
        break;
      }
    }
    return(
<div className={!this.props.in_select ? "box" : ""}>
  <div className="card" onDragOver={this.props.onDragOver} onDrop={this.props.onDrop}>
    <header className="card-header">
      <p className="card-header-title">
        Phase Reaction
      </p>
      <button className="delete is-small" style={{align: "right"}} onClick={this.props.onClose}></button>
    </header>
    <div className="card-content">
      <div className="field is-horizontal">
        <div className="field-body">

          <div className="field">
            <div className="control">
              <div className="select is-primary">
                <select value={reactor_idx} onChange={(e) => {phase.reactor_obj = reactors[e.target.value].reactor;
                  phase.parameters.reactor = {row: reactors[e.target.value].row, col: reactors[e.target.value].col};
                  this.update(phase)}}>
                  {reactors.map((el, idx) => (<option key={idx} value={idx}>{el.reactor ? el.reactor.name : "Select reactor"}</option>))}
                </select>
              </div>
            </div >
          </div>
          <div className="field">
            <p className="control is-expanded has-icons-right">
              <input className="input" type="input" placeholder="Set time" value={phase.parameters.time} onChange={(e) => {phase.parameters.time = e.target.value; this.update(phase)}}/>
              <span className="icon is-small is-right">s</span>
            </p>
          </div>
        </div>
      </div>

      <div className="field is-horizontal">
        <div className="field-label is-normal">
          <label className="label">Temperature:</label>
        </div>
        <div className="field-body">
          <div className="field">
            <div className="control">
              <div className="select is-primary">
                <select value={phase.parameters.temperature_control} onChange={(e) => {phase.parameters.temperature_control = e.target.value; this.update(phase)}}>
                  <option key="0" value={false}>Off</option>
                  <option key="1" value={true}>On</option>
                </select>
              </div>
            </div>
          </div>
          <div className="field">
            <p className="control is-expanded has-icons-right">
              <input className="input" type="input" placeholder="set temperature" value={phase.parameters.set_temperature} onChange={(e) => {phase.parameters.set_temperature = e.target.value; this.update(phase)}}/>
              <span className="icon is-small is-right">°C</span>
            </p>
          </div>
        </div>
      </div>

      <div className="field is-horizontal">
        <div className="field-label is-normal">
          <label className="label">Pressure:</label>
        </div>
        <div className="field-body">
          <div className="field">
            <div className="control">
              <div className="select is-primary">
                <select value={phase.parameters.pressure_control} onChange={(e) => {phase.parameters.pressure_control = e.target.value; this.update(phase)}}>
                  <option key="0" value={false}>Off</option>
                  <option key="1" value={true}>On</option>
                </select>
              </div>
            </div>
          </div>
          <div className="field">
            <p className="control is-expanded has-icons-right">
              <input className="input" type="input" placeholder="set pressure" value={phase.parameters.set_pressure} onChange={(e) => {phase.parameters.set_pressure = e.target.value; this.update(phase)}}/>
              <span className="icon is-small is-right">bar</span>
            </p>
          </div>
        </div>
      </div>

      <div className="field is-horizontal">
        <div className="field-body">
          <div className="buttons are-medium">
            <button className={phase.parameters.mixing_on ? "button is-success" : "button is-light"} onClick={() => {phase.parameters.mixing_on = true; this.update(phase)}}>Mixer on</button>
            <button className={!phase.parameters.mixing_on  ? "button is-success" : "button is-white"} onClick={() => {phase.parameters.mixing_on = false; this.update(phase)}}>Mixer off</button>
          </div>
        </div>
      </div>

    </div>
</div>
</div>
      )
  }
}


function RecipeEdit(props){
  if(!props.recipe){
    return(<p>No recipe selected</p>);
  }
  const {recipe, demo_step} = props;
  return(

    <div className="card has-background-white-bis" style={{marginBottom: "1.5rem"}}>
      <header className="card-header">
        <p className="card-header-title">
          <input className="input" type="input" value={recipe.title}
              onChange={(e) => {recipe.title=e.target.value; props.update(recipe)}}/>
        </p>
        <button className="delete is-small" style={{align: "right"}} onClick={props.onClose}></button>
      </header>
      <div className="card-content">
          {recipe.phases.map((phase, index) => (
            <PhaseSelect key={index} phase={phase} recipe_editor={1} automation={props.automation} update={props.update} onDelete={() =>{recipe.phases.splice(index, 1); props.update(recipe)}}/>
          ))}
          <PhaseSelect phase={undefined} demo_step={demo_step} recipe_editor={1} addPhase={(new_phase) => {recipe.phases.push(new_phase); props.update(recipe)}}/>
      </div>
      <footer className="card-footer">
        <a className={props.changes_recipe ? "card-footer-item has-background-warning" : "card-footer-item"} onClick={props.onSave}>Save</a>
        <a className="card-footer-item"></a>
        <a className="card-footer-item"></a>
      </footer>
    </div>
  );
}


function Recipe(props){
  if(!props.recipe){
    return(<p>No recipe selected</p>);
  }
  const {recipe, demo_step} = props;
  return(

      <div className="field is-grouped is-grouped-multiline">
        <div className="control">
          <a onClick={props.onEdit}><div className="tags has-addons are-medium">
            <span className={recipe.state === 1 ? "tag is-success" : "tag is-white"}>
              {recipe.title}
            </span>
            <span className={recipe.state === 1 ? "tag is-success" : "tag is-white"}>
              {(recipe.state === 1 ? recipe.step+1 : 0) + "/"+recipe.phases.length}
            </span>
          </div></a>
        </div>

        <div className="control">
          <div className="tags has-addons are-medium">
            <div className="buttons are-small">
              {props.sim ? <>
                <button className={"button icon-play3" + (demo_step===89 ? " is-warning" : recipe.state === 1 ? " is-primary" : "")} onClick={()=>recipe.start()}></button>
                <button className={"button icon-pause2" + (recipe.state === 10 ? " is-primary" : "")} onClick={()=>recipe.pause()}></button>
                <button className={"button icon-stop2" + (recipe.state === 0 ? " is-primary" : "")} onClick={()=>recipe.stop()}></button>
                </>
               : <></>}
              <button className="button icon-pencil" onClick={props.onEdit}></button>
              <button className="button icon-exit" onClick={props.onExit}></button>
            </div>
          </div>
        </div>

      </div>
  );
}


function RecipeManual(props){
  const recipe = new cRecipe();
  recipe.title ="Recipename";
  return(

      <div className="field is-grouped is-grouped-multiline">
        <div className="control">
          <a onClick={props.onEdit}><div className="tags has-addons are-medium">
            <span className={recipe.state === 1 ? "tag is-success" : "tag is-white"}>
              {recipe.title}
            </span>
            <span className={recipe.state === 1 ? "tag is-success" : "tag is-white"}>
              {(recipe.state === 1 ? recipe.step+1 : 0) + "/"+recipe.phases.length}
            </span>
          </div></a>
        </div>

        <div className="control">
          <div className="tags has-addons are-medium">
            <div className="buttons are-small">
              <button className={"button icon-play3" + (recipe.state === 1 ? " is-primary" : "")}></button>
              <button className={"button icon-pause2" + (recipe.state === 10 ? " is-primary" : "")}></button>
              <button className={"button icon-stop2" + (recipe.state === 0 ? " is-primary" : "")}></button>
              <button className="button icon-pencil"></button>
              <button className="button icon-exit"></button>
            </div>
          </div>
        </div>

      </div>
  );
}

export {
  Valve, Tank, Pipe, Pump, Source, Target, ValveEdit, TankEdit, PipeEdit,
  PumpEdit, ValveTool, TankTool, PipeTool, PumpTool, SourceTool, TargetTool,
  MeasurementTool, Empty,
  AutomationObject, AutomationObjectEdit, Pid, PidEdit, PhaseTransfer,
  PhaseTransferEdit, PhaseSelect, Recipe, RecipeEdit, ReactorTool, PhaseDisplay,
  PhaseEdit, RecipeManual, PhaseTransferManual
}
