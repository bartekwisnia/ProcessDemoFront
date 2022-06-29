import React from "react";
import {ToolboxManual} from "./Toolbox"
import {TopBarEditManual, TopBarSimManual} from "./Topbar"
import {PlantTableManual} from "./PlantTable"
import {RecipeManual, PhaseTransferManual} from "./ReactAutomation"

function Technology(props){
return(
<>
<section>
  <div className="level">
    <div className="level-item box">
      <div>
        <h1 className="subtitle is-5">{"Here are some basic informations about the simulator"}</h1>
        <h3 className="subtitle is-7">{"Manual is still being prepared, in the future clicking on element will give you detailed information about its function"}</h3>
      </div>
    </div>
  </div>
</section>
<section>
  <div className="columns">
  <div className="column is-12">

  <div className="tile is-ancestor">

    <div className="tile is-parent">
      <article className="tile is-child notification is-primary">
        <div className="content">
          <p className="title">Toolbox</p>
          <p className="subtitle">In editor mode select here an automation object and drag it into the plant area </p>
          <ToolboxManual />
          <div className="content">
          </div>
        </div>
      </article>
    </div>

    <div className="tile is-vertical is-8">
      <div className="tile is-parent">
        <article className="tile is-child notification is-white-bis">
          <p className="title">Top bar</p>
          <p className="subtitle">In editor mode you can change here your plant
          name and size as well as save and restore changes.
           In simulation mode you start, stop simulation and change its speed
           here as well as start single phase (function)</p>
          <div className="content has-background-white-bis">
            <TopBarEditManual />
          </div>
          <div className="content has-background-white-bis">
            <TopBarSimManual />
          </div>
        </article>
      </div>
      <div className="tile">
        <div className="tile is-parent">
          <article className="tile is-child notification is-info">
            <p className="title">Main project area</p>
            <p className="subtitle">Here is your plant displayed with all the
            objects and measurements. It is structured as an array so each element has its own coordinates
            </p>
            <div className="content has-background-white-bis">
              <PlantTableManual />
            </div>
          </article>
        </div>
        <div className="tile is-parent is-vertical">
          <article className="tile is-child notification is-info">
            <p className="title">Phase</p>
            <p className="subtitle">Phase is one single automatic function of the plant. There are 2 predefined functions:</p>
            <ul className="menu-list">
              <li><span className="has-text-weight-bold">Transfer:</span> to pump material from source to target</li>
              <li><span className="has-text-weight-bold">Reacting phase:</span> to process material inside of reactor</li>
            </ul>
            <p className="subtitle"></p>
            <div className="content has-background-white-bis">
              <PhaseTransferManual />
            </div>
          </article>
          <article className="tile is-child notification is-info">
            <p className="title">Recipe</p>
            <p className="subtitle">Recipe is a sequence of phases
            (automatic functions) to be performed on your plant</p>
            <div className="content has-background-white-bis">
              <RecipeManual />
            </div>
          </article>
          <article className="tile is-child notification is-info">
            <p className="title">Object editor</p>
            <p className="subtitle">In this area detailed information about the
            selected object will be displayed. From this point you can change
            all of the objects parameters as well as control it if it is an
            actor like valve or a pump</p>
          </article>
          <article className="tile is-child notification is-info">
            <p className="title">PID Controllers</p>
            <p className="subtitle">PID Controller is an element that calculates
            and output for an actor like a pump speed based on a setpoint
            (for example set flow or temperature or pressure) and current value
            of the controlled measurement</p>
          </article>
        </div>
      </div>
      <div className="tile is-parent">
        <article className="tile is-child notification">
          <p className="title">Statistics</p>
          <p className="subtitle">Here all routes found in the project and in the future other statistic/current informations will be displayed</p>
          <div className="content">
          </div>
        </article>
      </div>
    </div>

    <div className="tile is-parent">
      <article className="tile is-child notification is-primary">
        <div className="content">
          <p className="title">Project tree</p>
          <p className="subtitle">In editor mode select here an automation object and drag it into the plant area </p>
          <div className="content">
          </div>
        </div>
      </article>
    </div>

  </div>
  </div>
  </div>

</section>
</>
);
}

export default Technology;
