import React from "react";

import {  PhaseSelect, PhaseDisplay} from './ReactAutomation'
import {getData} from'./Utils';
import {FieldWithBar} from'./Elements';
import {cPhaseTransfer} from './Automation';

function TopBar(props){
  const {sim_view, plant, plants, size, sim_on, demo_step, speed_faktor, active_phase,
    routes, pids, automation, changes_automation, changes_plant, token,
    save_date_time, display_tags, display_materials} = props;
  return(
    <div className="level">
      <div className="level-left">
      {sim_view ?
        <div className="level-item">
          <div className="field is-grouped is-grouped-multiline">
            <p className="subtitle is-5">
              <strong> {plant!=undefined ? " " + plant.title+" simulation" : " Demo plant simulation"}</strong>
            </p>
          </div>
        </div> : <></>}
        {!sim_view ?
          <>
          {plant!==undefined ?
          <div className="level-item">
            <div className="field is-grouped is-grouped-multiline">
              <div className={demo_step === 9 ? "control has-background-warning" : "control"}>
                <input className="input" type="input" value={plant.title}
                    onChange={(e) => {
                                        plant.title = e.target.value;
                                        props.updatePlants();
                                      }}
                />
              </div>
            </div>
          </div> : <></>}

          <div className="level-item">
            <div className="field is-grouped is-grouped-multiline">
              <div className="control">
                <div className="buttons are-small">
                  <button className="button icon-minus" onClick={()=>props.resizePlant(size.rows-1, size.cols)}></button>
                  <button className="button is-static">{"rows " + size.rows}</button>
                  <button className="button icon-plus" onClick={()=>props.resizePlant(size.rows+1, size.cols)}></button>
                  <button className="button icon-minus" onClick={()=>props.resizePlant(size.rows, size.cols-1)}></button>
                  <button className="button is-static">{"cols " + size.cols}</button>
                  <button className="button icon-plus" onClick={()=>props.resizePlant(size.rows, size.cols+1)}></button>
                </div>
              </div>
            </div>
          </div>
          </>
          :
          <>
            <div className="level-item">
              <div className="field is-grouped is-grouped-multiline">
                <div className="control">
                  <div className="buttons are-small">
                    <button className={"button icon-play3" + (sim_on ? " is-primary" : "")} onClick={()=>props.setSim(true, sim_view)}></button>
                    <button className={"button icon-pause2" + (!sim_on ? " is-primary" : "")} onClick={()=>props.setSim(false, sim_view)}></button>
                    <button className={"button icon-stop2"} onClick={()=>props.setSim(false,  false)}></button>
                  </div>
                </div>
              </div>
            </div>
            <div className="level-item">
              <div className="field is-grouped is-grouped-multiline">
                <div className="control">
                   <FieldWithBar value={speed_faktor}  unit="x" label="speed" hide_input={true}
                            min="0.1" max="100" step="0.1"
                            updateObject={(value) => props.setSpeed(value)}/>
                </div>
              </div>
            </div>
          </>
        }
      </div>
      <div className="level-right">
      <div className="level-item">

      {active_phase ?
        <PhaseDisplay phase={active_phase} sim={sim_view} demo_step={demo_step}
          is_active={true} routes={routes} pids={pids} automation={automation}
          onEdit={()=>props.setPhase(active_phase, active_phase)}
          onAbort={() => props.setPhase(undefined, undefined)}/>
        :
        <PhaseSelect demo_step={demo_step}
          addPhase={(new_phase) => props.setPhase(new_phase, new_phase)}/>
      }
      </div>

          <div className="level-item">
            <div className="field is-grouped is-grouped-multiline">
              <div className="control">
                {changes_automation || changes_plant ?
                <div className="buttons level-item are-small">
                  <button className="button" onClick={props.saveChanges}>{sim_view ? "SAVE_STATE" : "SAVE"}</button>
                    <button className="button" onClick={props.restorePlantData}>
                {sim_view ? ((save_date_time) ? "RESTORE STATE FROM " + save_date_time : "RESTART") : "DISCARD"}
              </button>
            </div>
                        :
                        <div className="level-item">
                          <p>synchronized</p>
                        </div>}
            </div>
            </div>
          </div>
        <div className="level-item">
        <div className="field is-grouped is-grouped-multiline">
          <div className="control">
          <div className="buttons are-small">
            <button className={"button icon-price-tags" + (display_tags ? " is-primary" : "")} onClick={props.toggleDisplayTags}></button>
            <button className={"button icon-chemistry" + (display_materials ? " is-primary" : "")} onClick={props.toggleDisplayMaterials}></button>
          </div>
          </div>
          </div>
        </div>
      </div>
  </div>
  );
}


function TopBarEditManual(props){
  return(
  <div className="section p-3 has-background-white-bis">
    <div className="level">
      <div className="level-left">
          <div className="level-item">
            <div className="field is-grouped is-grouped-multiline">
              <div className="control">
                <input className="input" type="input" value="Plant name"/>
              </div>
            </div>
          </div>
          <div className="level-item">
            <div className="field is-grouped is-grouped-multiline">
              <div className="control">
                <div className="buttons are-small">
                  <button className="button icon-minus"></button>
                  <button className="button is-static">{"rows " + 5}</button>
                  <button className="button icon-plus"></button>
                  <button className="button icon-minus"></button>
                  <button className="button is-static">{"cols " + 5}</button>
                  <button className="button icon-plus"></button>
                </div>
              </div>
            </div>
          </div>
      </div>
      <div className="level-right">
        <div className="level-item">
          <PhaseSelect />
        </div>
        <div className="level-item">
          <div className="field is-grouped is-grouped-multiline">
            <div className="control">
              <div className="buttons level-item are-small">
                <button className="button">SAVE</button>
                <button className="button">DISCARD</button>
              </div>
            </div>
          </div>
        </div>
        <div className="level-item">
          <div className="field is-grouped is-grouped-multiline">
            <div className="control">
              <div className="buttons are-small">
                <button className={"button icon-price-tags"}></button>
                <button className={"button icon-chemistry"}></button>
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
</div>
  );
}


function TopBarSimManual(props){
  return(
  <div className="section p-3 has-background-white-bis">
    <div className="level">
      <div className="level-left">
        <div className="level-item">
          <div className="field is-grouped is-grouped-multiline">
            <p className="subtitle is-5">
              <strong>{" Plant sim"}</strong>
            </p>
          </div>
        </div>
        <div className="level-item">
          <div className="field is-grouped is-grouped-multiline">
            <div className="control">
              <div className="buttons are-small">
                <button className={"button icon-play3 is-primary"}></button>
                <button className={"button icon-pause2"}></button>
                <button className={"button icon-stop2"}></button>
              </div>
            </div>
          </div>
        </div>
        <div className="level-item">
          <div className="field is-grouped is-grouped-multiline">
            <div className="control">
               <FieldWithBar value={10.0}  unit="x" label="speed" hide_input={true}
                        min="0.1" max="100" step="0.1"/>
            </div>
          </div>
        </div>

      </div>
      <div className="level-right">
        <div className="level-item">
          <PhaseDisplay phase={new cPhaseTransfer()} sim={1} demo_step={0}
            is_active={true} routes={[]} pids={[]} automation={[]}/>
        </div>
        <div className="level-item">
          <div className="field is-grouped is-grouped-multiline">
            <div className="control">
              <div className="buttons level-item are-small">
                <button className="button" >{"SAVE_STATE"}</button>
                <button className="button">{"RESTART"}</button>
              </div>
            </div>
          </div>
        </div>
        <div className="level-item">
          <div className="field is-grouped is-grouped-multiline">
            <div className="control">
              <div className="buttons are-small">
                <button className={"button icon-price-tags is-primary"}></button>
                <button className={"button icon-chemistry"}></button>
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
</div>
  );
}


export default TopBar;
export {
  TopBarEditManual, TopBarSimManual,
}
