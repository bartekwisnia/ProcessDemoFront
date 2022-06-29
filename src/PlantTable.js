import React from "react";
import {AutomationObject} from './ReactAutomation'
import {cAutomation, cValve, cPipe, cTank, cPump} from './Automation';

function PlantTable(props){
  const {automation, measurements, edit_auto, display_tags, sim_view, display_materials, demo_step} = props;

return(
  <table className ={sim_view ? "" : "table"}>
    <tbody>
    {automation.map((r_el, row) => (
        <tr key={row}>
        {r_el.map((c_el, col) => {
          let td_class = "";
          if(demo_step >= 14 && demo_step <= 16 && row === 0 && col === 0)
            td_class = "container has-background-warning";
          else if(demo_step >= 19 && demo_step <= 21 && row === 1 && col === 0)
            td_class = "container has-background-warning";
          else if(demo_step >= 26 && demo_step <= 26 && row === 0 && col === 0)
            td_class = "container has-background-warning";
          else if(demo_step >= 34 && demo_step <= 36 && row === 1 && col === 0)
            td_class = "container has-background-warning";
          else
            td_class = edit_auto ? (edit_auto.row===row && edit_auto.col === col ? "container has-background-light" : "") : "";
          return(
          <td className={td_class} key = {col}
            onDrop={(ev) => props.drop(ev, row, col)}
            onDragOver={props.allowDrop} draggable={!sim_view}
            onDragStart={(ev) => props.drag(ev, c_el.auto_type, row, col)}>
            <AutomationObject row={row} col={col} object_data={c_el} fontSize={props.fontSize}
              sim = {sim_view} measurements ={measurements[row][col]} demo_step={demo_step}
              display_tags ={display_tags}
              display_materials={display_materials}
              onDragMeas = {(ev, index) => props.drag(ev, 10, row, col, index)}
              onDeleteAutomation ={() => props.onDeleteAutomation(row,col)}
              onDeleteMeasurement ={(index)=>props.onDeleteMeasurement(row,col,index)}
              onClick={() => props.setState({edit_auto: {row: row, col: col}})}
             />
          </td>);
        }
      )}
        </tr>
    ))}
    </tbody>
  </table>
  );
}

function PlantTableManual(props){
  const rows = 2;
  const cols = 4;
  const automation = [];
  const measurements = [];

  for (let row = 0; row < rows; row++) {
    const new_row = [];
    const new_row_m = [];
    for (let col = 0; col < cols; col++) {
      new_row.push(new cAutomation())
      new_row_m.push([]);
    }
    automation.push(new_row);
    measurements.push(new_row_m);
  }
  automation[0][0] = new cTank()
  automation[1][0] = new cPipe({connections: [1,1,0,0]});
  automation[0][3] = new cTank();
  automation[1][1] = new cPump({connections: [0,1,0,1], end: 1});
  automation[1][2] = new cValve({connections: [0,1,0,1]});
  automation[1][3] = new cPipe({connections: [1,0,0,1]});

  return(<>
    <table className ={"table"}>
      <tbody>
      {automation.map((r_el, row) => (
          <tr key={row}>
          {r_el.map((c_el, col) => (<td key = {col}>
            <AutomationObject row={row} col={col} object_data={c_el} fontSize={120}
              sim = {true} measurements ={measurements[row][col]} demo_step={0}
              display_tags ={true}
              display_materials={true}
             />
                      </td>
)
        )}
          </tr>
      ))}
      </tbody>
    </table>
    </>);
}


export default PlantTable;

export {
  PlantTableManual
}
