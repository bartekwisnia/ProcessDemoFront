import React from "react";
import Menu from "./Menu"
import Manual from "./Manual"
import Technology from "./Technology"
import Toolbox from "./Toolbox"
import ProjectTree from "./ProjectTree"
import TopBar from "./Topbar"
import Contact from "./Contact"
import PlantTable from "./PlantTable"
import { Routes, Route } from "react-router-dom";

import Cookies from 'universal-cookie';
import './App.css';

import { LoginClass, SignUpClass} from './Login';
import { cAutomation, cValve, cPipe, cTank, cPump, cMeasurement, cPID,
  cPhaseTransfer, cPhaseReaction, cRecipe, getNewAutomation} from './Automation';
import {  Pid, PidEdit, AutomationObjectEdit, Recipe, RecipeEdit, PhaseEdit} from './ReactAutomation'
import {getData, writeData, destroyData, precision} from'./Utils';
import {findRoutes, simulate } from "./Simulation";
import {About} from './Contact';

class App extends React.Component{
  constructor(props){
    super(props);
    const width = window.innerWidth;
    this.handleResize = this.handleResize.bind(this);

    this.state = {
      automation : [],
      routes : [],
      measurements : [],
      plants : [],
      pids: [],
      edit_auto: undefined,
      edit_pid: undefined,
      edit_phase : undefined,
      edit_recipe: undefined,
      plant : undefined,
      loaded : false,
      sim_view : false,
      sim_on : false,
      demo : false,
      demo_step : 0,
      demo_steptime: 0.0,
      speed_faktor : 10.0,
      login_modal : false,
      signup_modal : false,
      demo_modal : undefined,
      demo_modal_title : undefined,
      plant_delete_index : undefined,
      changes_automation: false,
      changes_plant: false,
      changes_recipe: false,
      logged_user: '',
      token: '',
      startWidth: width,
      basicSize: 120,
      simSize: 150,
      fontSize: 120,
      size: {rows: 5, cols: 5},
      save_date_time: undefined,
      display_tags: false,
      display_materials: true,
      active_phase : undefined,
      active_recipe: undefined,
      recipes: [],
    };

  }

  handleResize(){
    const {sim_view, basicSize, simSize} = this.state;
    const width = window.innerWidth;
    const basic_size = sim_view ? simSize: basicSize;
    this.setState({fontSize: basic_size*width/2160,});
  }

  updateObject(state_item, value, index1, index2, attr, update_var){
    let copy = this.state[state_item];
    let copy_el1 = index1 !== undefined ? copy[index1] : copy;
    let copy_el2 = index2 !== undefined ? copy_el1[index2] : copy_el1;
    if(attr !== undefined ){
      copy_el2[attr] = value;
    }
    else copy_el2 = value;
    this.setState({[state_item]: copy, [update_var]: true});
  }

  saveChanges(){
    const{changes_plant, changes_automation, pids, plant, token, logged_user,
      automation, measurements} = this.state;
    const today = new Date();
    const current_time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    if(logged_user && plant){
      if(changes_plant)
        writeData('plants/'+plant.id+'/', "PUT", token, plant).then((data) => this.setState({"changes_plant": false, save_date_time: current_time}));
      if(changes_automation)
        writeData('plantdata/'+plant.id+'/', "PUT", token, {automation, measurements, pids}).then((data) => this.setState({"changes_automation": false, save_date_time: current_time}));
    }
  }

  saveRecipe(recipe){
    const{token, logged_user} = this.state;
    if(logged_user){
      writeData('recipes/'+recipe.id+'/', "PUT", token, recipe).then((data) => this.setState({"changes_recipe": false}));
    }
  }

  resizePlant(rows, cols){
    const {size, automation, measurements, plant} = this.state;
    let changes_plant = false;
    let rows_used = 1;
    let cols_used = 1;
    for (let row = 0; row < automation.length; row++) {
      for (let col = 0; col < automation[row].length; col++) {
        if(automation[row][col])
          if(automation[row][col].auto_type>0){
            if (row+1 > rows_used)
              rows_used = row+1;
            if (col+1 > cols_used)
              cols_used = col+1;
        }
      }
    }
    size.rows = rows < rows_used ? rows_used : rows;
    size.cols = cols < cols_used ? cols_used : cols;
    automation.length = size.rows;
    measurements.length = size.rows;
    for (let row = 0; row < automation.length; row++){
      if(automation[row] === undefined){
        automation[row] = [];
        measurements[row] = [];
      }
      automation[row].length = size.cols;
      measurements[row].length = size.cols;
      for (let col = 0; col < automation[row].length; col++) {
        if(automation[row][col] === undefined){
          automation[row][col] = new cAutomation();
          measurements[row][col] = [];
        }
      }
    }
    if(plant !== undefined){
        plant.rows = size.rows;
        plant.columns = size.cols;
        changes_plant = true;
    }
    this.setState({size: size, automation: automation, measurements: measurements, plant: plant, edit_auto: undefined, changes_plant: changes_plant});
  }

  initUser(data, user, token, callback){
    const plants = data ? data.results : [];
    const {automation, measurements, size} = this.emptyPlant(undefined);

    this.setState({automation: automation, measurements: measurements, size: size,
      plants: plants, plant: undefined, logged_user: user, token: token,
      changes_plant: false, changes_recipe: false, loaded: true, pids: [], active_phase : undefined,
      active_recipe: undefined, recipes: [], recipe: undefined, edit_pid: undefined,
      edit_auto: undefined, edit_phase: undefined, edit_recipe: undefined
    }, callback);
  }

  emptyPlant(plant){
      const rows = plant ? plant.rows : 5;
      const cols = plant ? plant.columns : 5;
      const automation = [];
      const measurements = [];

      const size = {rows: rows, cols: cols};
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
      return({automation: automation, measurements: measurements, size: size});
    }

  newRecipe(index){
    const {logged_user, token, plants, recipes} = this.state;
    const plant = plants[index];
    if(logged_user)
      writeData('recipes/',"POST", token, {title: plant.title+"recipe", plant: plant.id, step: 0}).then(() => this.getPlantRecipes(index))
    else {
      recipes.push(new cRecipe());
      recipes[recipes.length-1].title = "demo recipe"
      this.setState({recipes: recipes});
    }
  }

  deleteRecipe(recipe_delete_index){
    const {logged_user, token, recipes} = this.state;
    if(logged_user)
      destroyData('recipes/'+recipes[recipe_delete_index].id+'/', token).then(() => this.removeRecipe(recipe_delete_index));
    else if(recipes.length > 0){
      this.removeRecipe(recipe_delete_index)
    }
  }

  removeRecipe(index){
    const {recipes} = this.state;
    let {recipe} = this.state;
    recipes.splice(index, 1);
    if (recipe === index){
      recipe = undefined;
    }
    this.setState({recipes: recipes, recipe: recipe});
  }

  getRecipeData(index){
    const{recipes, token, logged_user} = this.state;
    const id = recipes[index].id;
    if(logged_user){
      getData('recipedata/'+id, token).then(data => this.readRecipeData(data, recipes, index));
    }
    this.setState({recipe: index, edit_recipe: undefined});
  }

  readRecipeData(data, recipes, index){
    const {automation} = this.state;
    const phases_data = data;
    const phases = [];
    for (let idx = 0; idx < phases_data.length; idx++ ){
      switch(phases_data[idx].phase_num){
        case 1:
          const new_phase1 = new cPhaseTransfer(phases_data[idx])
          new_phase1.getObjects(automation);
          phases.push(new_phase1);
          break;
        case 2:
          const new_phase2 = new cPhaseReaction(phases_data[idx])
          new_phase2.getObjects(automation);
          phases.push(new_phase2);
          break;
        default:
        ;
      }
    }
    recipes[index].phases = phases;
    this.setState({recipes: recipes});
  }

  newPlant(){
    const {logged_user, token, plants} = this.state;
    if(logged_user)
      writeData('plants/',"POST", token, {title: "new"}).then(getData('plants', token).then(data => this.setState({plants: data.results})));
    else if(plants.length === 0){
      plants.push({columns: 5, rows: 5, id: 0, title: "new_plant"});
      this.setState({plants: plants});
    }
  }

  deletePlant(plant_delete_index){
    const {logged_user, token, plants} = this.state;
    if(logged_user)
      destroyData('plants/'+plants[plant_delete_index].id+'/', token).then(() => this.removePlant(plant_delete_index));
    else if(plants.length > 0){
      this.removePlant(plant_delete_index)
    }
  }

  removePlant(index){
    const {plants} = this.state;
    let {plant} = this.state;
    plants.splice(index, 1);
    if (plant === index){
      plant = undefined;
    }
    this.setState({plants: plants, plant: plant, plant_delete_index: undefined});
  }

  getPlantData(index){
    const{plants, token, logged_user} = this.state;
    const plant = plants[index];
    const id = plant.id;
    if(logged_user){
      getData('plantdata/'+id, token).then(data => this.readPlantAutomation(data, plant));
      getData('recipes?plant='+id, token).then(data => this.readPlantRecipes(data.results, index));
    }

    this.stopSimulation();
    this.setState({plant: plants[index], edit_auto: undefined, edit_pid: undefined, edit_recipe: undefined, recipe: undefined, active_phase: undefined});
  }

  restorePlantData(plant){
    const{token, logged_user} = this.state;
    const id = plant.id;
    if(logged_user){
      getData('plantdata/'+id, token).then(data => this.readPlantAutomation(data, plant));
    }
  }

  getPlantRecipes(index){
    const{plants, token, logged_user} = this.state;
    const id = plants[index].id;
    if(logged_user){
      getData('recipes?plant='+id, token).then(data => this.readPlantRecipes(data.results, index));
    }
  }

  readPlantRecipes(data, index){
    const recipes_data = data;
    const recipes = [];
    for (let idx = 0; idx < recipes_data.length; idx++ ){
      const recipe = recipes_data[idx];
      recipe['phases'] = [];
      recipes.push(new cRecipe(recipe));
    }
    this.setState({recipes: recipes});
  }

  readPlantAutomation(data, plant){
    const empty_plant = this.emptyPlant(plant);
      if(data){
        const {automation, measurements, size} = empty_plant;
        if(data.automation){
          const auto = data.automation;
          for (let row = 0; row < auto.length; row++) {
            for (let col = 0; col < auto[row].length; col++) {
              automation[row][col] = getNewAutomation(auto[row][col]);
            }
          }
        }
        if(data.measurements){
          const meas = data.measurements;
          for (let row = 0; row < meas.length; row++) {
            for (let col = 0; col < meas[row].length; col++) {
              measurements[row][col] = [];
              for (let idx = 0; idx < meas[row][col].length; idx++){
                if(meas[row][col][idx]){
                    measurements[row][col].push(new cMeasurement(meas[row][col][idx],automation[row][col]));
                }

              }
            }
          }
        }
        const pids = []
        if(data.pids){
          for (let idx = 0; idx < data.pids.length; idx++) {
            const pid = data.pids[idx];
            const pid_act = automation[pid.actuator.row][pid.actuator.col];
            const meas_table = measurements[pid.measurement.row][pid.measurement.col];
            let pid_meas = undefined;
            for (let idx2 = 0; idx2 < meas_table.length; idx2++) {
              if(meas_table[idx2].meas_type === pid.measurement.meas_type){
                pid_meas = meas_table[idx2];
                break;
              }
            }
            pid.meas = pid_meas;
            pid.act = pid_act;
            pids.push(new cPID(pid));
          }
        }

      this.setState({automation: automation, measurements: measurements, pids: pids,
        size: size, edit_auto: undefined, edit_pid: undefined, changes_automation: false});
    }
  }

  setLogin(user, token){
      if (user){
        getData('plants', token).then(data => this.initUser(data,user,token));
      }
      else{
        this.initUser(undefined, user, token);
      }
    }

  toggleSimulation(){
    const{sim_view} = this.state;
    if(sim_view)
      this.stopSimulation();
    else
      this.startSimulation();
  }

  startSimulation(){
    const{sim_on, automation, measurements, token, pids,
      active_phase, simSize, size, plant, demo_step, logged_user} = this.state;
    if(!sim_on){
      const width = window.innerWidth;
      const {routes} = findRoutes(automation, size);
      if(plant!==undefined && demo_step === 0){
        const today = new Date();
        const current_time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
        if(logged_user)
          writeData('plantdata/'+plant.id+'/', "PUT", token, {automation, measurements, pids}).then((data) => this.setState({"changes_automation": false, save_date_time: current_time}));
      }
      if(active_phase){
        active_phase.init(routes, automation);
        active_phase.start(pids, automation);
      }

      this.timerSim = setInterval(
        () => this.simulation(),
        1000
      );
      this.setState({sim_view: true, sim_on: true, routes: routes, automation: automation, fontSize: simSize*width/2160})
    }
  }

  stopSimulation(){
    const{basicSize} = this.state;
    const width = window.innerWidth;
    clearInterval(this.timerSim);
    this.setState({sim_view: false, routes: [], sim_on: false, fontSize: basicSize*width/2160})
  }

  startDemoInterval(){
    this.timerDemo = setInterval(
      () => this.demo(),
      1000
    );
  }

  startDemo(){
    const{basicSize, logged_user, token, demo, plants} = this.state;
    if(!demo){
      const width = window.innerWidth;
      clearInterval(this.timerSim);
      this.setState({sim_view: false, demo: true, demo_step: 1, routes: [], sim_on: false, fontSize: basicSize*width/2160}, () => this.initUser({results: plants}, logged_user, token, this.startDemoInterval))
    }
  }

  stopDemo(){
    return new Promise((resolve, reject) => {
      clearInterval(this.timerDemo);
      this.setState({demo: false, demo_step: 0}, resolve);
    });
  }

  demo(){
    const{demo, plants, automation, measurements, recipes,
      routes, pids, active_phase, sim_view} = this.state;
    let{demo_step, demo_steptime} = this.state;
    const modal_time = 2.0;
    let demo_modal = undefined;
    demo_steptime += 1.0;
    if(!demo || demo_step === 0){
      return;
    }
    switch(demo_step){
      // 1 - init
      case 1: // modal create new project
        if(demo_steptime >= modal_time)
          this.setState({demo_step: demo_step+1, demo_steptime: 0.0, demo_modal: undefined});
        else
          this.setState({demo_steptime: demo_steptime, demo_modal_title: "Create new project", demo_modal: "Create new project by clicking + button in the project tree view"});
        break;
      // 2 - pause
      // 3 - highlight add project button
      case 4: // add new project
        plants.push({columns: 4, rows: 2, id: 0, title: "demo_plant"});
        const empty_plant = this.emptyPlant(plants[plants.length-1]);
        this.setState({demo_step: demo_step+1, plants: plants,
          automation: empty_plant.automation,
          measurements: empty_plant.measurements, size: empty_plant.size});
        break;
      case 5: // modal select new project
        if(demo_steptime >= modal_time)
          this.setState({demo_step: demo_step+1, demo_steptime: 0.0, demo_modal: undefined});
        else
          this.setState({demo_steptime: demo_steptime, demo_modal_title: "Select new project", demo_modal: "Select created project by clicking its name in the project tree view"});
        break;
      // 6 - pause
      // 7 - highlight new Project
      case 8: // select new project
        this.setState({demo_step: demo_step+1, plant: plants[plants.length-1]});
        //this.setState({demo_step: 70, plant: plants[plants.length-1]});
        break;
      // 9 - highlight demo project name
      case 10: // modal desing your plant by dragging objects from the toolbox
        if(demo_steptime >= modal_time)
          this.setState({demo_step: demo_step+1, demo_steptime: 0.0, demo_modal: undefined});
        else
          this.setState({demo_steptime: demo_steptime, demo_modal_title: "Design your plant", demo_modal: "Design your plant by dragging objects from the toolbox and dropping them on the plant matrix"});
        break;
      // 11 - pause
      // 12 - highlight tanks and show tanks to 15
      // 13 - highlight tank
      case 14: // highlight empty space 0,0 and add tank to automation
        automation[0][0] = new cTank()
        this.setState({demo_step: demo_step+1, automation: automation});
        break;
      // 15 - tank added
      // 16 - highlight new tank
      // 17 - highlight pipes and show pipes to 20
      // 18 - highlight pipe
      case 19: // highlight space 1,0 and add pipe to automation
        automation[1][0] = new cPipe({connections: [1,1,0,0]});
        this.setState({demo_step: demo_step+1, automation: automation});
        break;
      // 20 - pipe added
      // 21 - highlight new pipe
      case 22: // add pump, valve, pipe and second tank to automation
        automation[0][3] = new cTank();
        automation[1][1] = new cPump({connections: [0,1,0,1], end: 1});
        automation[1][2] = new cValve({connections: [0,1,0,1]});
        automation[1][3] = new cPipe({connections: [1,0,0,1]});
        this.setState({demo_step: demo_step+1, automation: automation});
        break;
      // 23 - Pause
      case 24: // modal edit your objects settings
        if(demo_steptime >= modal_time)
          this.setState({demo_step: demo_step+1, demo_steptime: 0.0, demo_modal: undefined});
        else
          this.setState({demo_steptime: demo_steptime, demo_modal_title: "Edit objects", demo_modal: "Edit your objects settings like name, size, volume etc."});
        break;

      // 25 - pause
      case 26: // highlight tank 0,0 and open tank edit window
        this.setState({demo_step: demo_step+1, edit_auto: {row: 0, col: 0}});
        break;
      //  27 - show tank edit 0,0 - to 29
      case 28: // highlight tank name in tank editor and change tank name to 29
        automation[0][0].name = "T01";
        automation[0][0].fill = 100.0;
        automation[1][0].name = "FIC01";
        automation[1][1].name = "P01";
        automation[1][2].name = "V01";
        automation[0][3].name = "T02";
        this.setState({demo_step: demo_step+1, automation: automation});
        break;
      // 29 - new name is displayed
      case 30: // modal add measurements
        if(demo_steptime >= modal_time)
          this.setState({demo_step: demo_step+1, demo_steptime: 0.0, demo_modal: undefined, edit_auto: undefined});
        else
          this.setState({demo_steptime: demo_steptime, demo_modal_title: "Add measurements", demo_modal: "Add measurements by dragging them from toolbox on the objects in your plant"});
        break;
        // 31 pause
        // 32 - highlight measurements and show measurements to 35
        // 33 - highlight flow measurement
      case 34: // highlight 1,0 and add flow measurement
        measurements[1][0].push(new cMeasurement({meas_type: 1}, automation[1][0]));
        this.setState({demo_step: demo_step+1, measurements: measurements});
        break;
      // 35 - measurement added
      // 36 - highlight new measurement
      case 37: // add other measurements
        measurements[0][0].push(new cMeasurement({meas_type: 3}, automation[0][0]));
        measurements[0][0].push(new cMeasurement({meas_type: 4}, automation[0][0]));
        measurements[0][3].push(new cMeasurement({meas_type: 3}, automation[0][0]));
        measurements[0][3].push(new cMeasurement({meas_type: 4}, automation[0][0]));
        measurements[1][1].push(new cMeasurement({meas_type: 4}, automation[0][0]));
        this.setState({demo_step: demo_step+1, measurements: measurements});
        break;
      case 38: // modal add measurements
        if(demo_steptime >= modal_time)
          this.setState({demo_step: demo_step+1, demo_steptime: 0.0, demo_modal: undefined});
        else
          this.setState({demo_steptime: demo_steptime, demo_modal_title: "Add PID Controllers", demo_modal: "Add PID controllers by clicking + button right from the plant matrix"});
        break;
      // 39 - pause
      // 40 - highlight add PID controller
      case 41: // add other measurements
        pids.push(new cPID());
        this.setState({demo_step: demo_step+1, pids: pids});
        break;
      // 42 - highlint new pid and open it
      case 42:
        this.setState({demo_step: demo_step+1, edit_pid: {idx: 0}});
        break;
      // 43 - show PID in pid editor to 45
      case 44: // modal drag measurement and actuator from plant to pid
        if(demo_steptime >= modal_time)
          this.setState({demo_step: demo_step+1, demo_steptime: 0.0, demo_modal: undefined});
        else
          this.setState({demo_steptime: demo_steptime, demo_modal_title: "Config PID", demo_modal: "Drag measurement and actuator (pump) from plant to pid"});
        break;
      // 45 - Pause
      // 46 - highlight flow measurement to 48
      // 47 - highlight empty space for measurement in Pid to 48
      case 48: // add measurement to pid
        pids[0].meas = measurements[1][0][0];
        this.setState({demo_step: demo_step+1, pids: pids});
        break;
      case 49: // add  pump to pid
        pids[0].act = automation[1][1];
        this.setState({demo_step: demo_step+1, pids: pids});
        break;
      // 50 - display pid edit for a second
      case 51:
        this.setState({demo_step: demo_step+1, edit_pid: undefined});
        break;
      case 52: // start phase (function) manually
        if(demo_steptime >= modal_time)
          this.setState({demo_step: demo_step+1, demo_steptime: 0.0, demo_modal: undefined});
        else
          this.setState({demo_steptime: demo_steptime, demo_modal_title: "Start phase manually", demo_modal: "Select phase type and click on the plus button on the top bar "});
        break;
      // 53 - pause
      case 54: // Highlight add phase button and select phase field and add new phase
        const phase = new cPhaseTransfer();
        this.setState({demo_step: demo_step+1, active_phase: phase, edit_phase: phase});
        break;
      // 55 - pause
      // 56 - highlight phase source, target, and parameters
      case 57: // set phase parameters
        active_phase.parameters.source = {row: 0, col: 0};
        active_phase.source_obj = automation[0][0];
        active_phase.parameters.target = {row:0, col: 3};
        active_phase.target_obj = automation[0][3];
        active_phase.parameters.goal_type =  1; // 1 - volume
        active_phase.parameters.goal_param = 3.0; // volume
        active_phase.parameters.flow_control = 1; // 1 - flow Controllers
        active_phase.parameters.flow_control_param = 5.0; //flow

        this.setState({demo_step: demo_step+1, active_phase: active_phase});
        break;

      case 58: // hide phase editor
        this.setState({demo_step: demo_step+1, edit_phase: undefined});
        break;
      case 59: // start simulation
        if(demo_steptime >= modal_time)
          this.setState({demo_step: demo_step+1, demo_steptime: 0.0, demo_modal: undefined});
        else
          this.setState({demo_steptime: demo_steptime, demo_modal_title: "Start simulation", demo_modal: "start simulation"});
        break;
     // 60 - pause
       case 61: // start simulation highlight button
         this.startSimulation();
         if(sim_view){
           this.setState({demo_step: demo_step+1});
         }
         break;
    // 62 - pause
      case 63: // modal - start phase
        if(demo_steptime >= modal_time)
          this.setState({demo_step: demo_step+1, demo_steptime: 0.0, demo_modal: undefined});
        else
          this.setState({demo_steptime: demo_steptime, demo_modal_title: "Start prepared phase", demo_modal: "start prepared phase by clicking play button"});
        break;
    // 64 - pause
      case 65: // highlight play button and start phase
        active_phase.start(routes, pids, automation);
        if(active_phase.state === 1){
          this.setState({demo_step: demo_step+1, speed_faktor : 100.0});
        }

        break;
      case 66: // wait till phase ends
        if(active_phase.state === 0){
          this.setState({demo_step: demo_step+1});
        }
        break;
      case 67: // modal - start editor
        if(demo_steptime >= modal_time)
          this.setState({demo_step: demo_step+1, demo_steptime: 0.0, demo_modal: undefined});
        else
          this.setState({demo_steptime: demo_steptime, demo_modal_title: "Open editor again", demo_modal: "open editor again"});
        break;
      // 68 - Pause
      case 69: // Highlight Editor button and stop simulation
        this.stopSimulation();
        if(!sim_view){
          this.setState({demo_step: demo_step+1});
        }
        break;
      case 70: // modal create new recipe
        if(demo_steptime >= modal_time)
          this.setState({demo_step: demo_step+1, demo_steptime: 0.0, demo_modal: undefined});
        else
          this.setState({demo_steptime: demo_steptime, demo_modal_title: "Create new recipe", demo_modal: "Create new recipe for a plant by clicking + button in the project tree view"});
        break;
      // 71 - pause
      // 72 - highlight add recipe button
      case 73: // add new recipe
        recipes.push(new cRecipe());
        recipes[recipes.length-1].title = "demo recipe"
        this.setState({demo_step: demo_step+1, recipes: recipes});
        break;
      case 74: // modal select new recipe
        if(demo_steptime >= modal_time)
          this.setState({demo_step: demo_step+1, demo_steptime: 0.0, demo_modal: undefined});
        else
          this.setState({demo_steptime: demo_steptime, demo_modal_title: "Select new recipe", demo_modal: "Select created recipe by clicking its name in the project tree view"});
        break;
      // 75 - pause
      // 76 - highlight new Recipe
      case 77: // select new recipe
        this.setState({demo_step: demo_step+1, recipe: recipes.length-1, edit_recipe: recipes[recipes.length-1]});
        break;
      case 78: // add phases to recipe
        if(demo_steptime >= modal_time)
          this.setState({demo_step: demo_step+1, demo_steptime: 0.0, demo_modal: undefined});
        else
          this.setState({demo_steptime: demo_steptime, demo_modal_title: "Add phase", demo_modal: "Add and configure phases to your recipe"});
        break;
      // 79 - pause
      // 80 - highlight plus button on recipe_editor
      case 81: // add phases to recipe
        const phase1 = new cPhaseTransfer();
        phase1.parameters.source = {row: 0, col: 0};
        phase1.source_obj = automation[0][0];
        phase1.parameters.target = {row:0, col: 3};
        phase1.target_obj = automation[0][3];
        phase1.parameters.goal_type =  1; // 1 - volume
        phase1.parameters.goal_param = 3.0; // volume
        phase1.parameters.flow_control = 1; // 1 - flow Controllers
        phase1.parameters.flow_control_param = 5.0; //flow

        const phase2 = new cPhaseTransfer();
        phase2.parameters.source = {row: 0, col: 0};
        phase2.source_obj = automation[0][0];
        phase2.parameters.target = {row:0, col: 3};
        phase2.target_obj = automation[0][3];
        phase2.parameters.goal_type =  2; // 2 - level source
        phase2.parameters.goal_param = 0.0; // level source
        phase2.parameters.flow_control = 0; // 0 fixed
        phase2.parameters.flow_control_param = 100.0; //pump speed

        recipes[recipes.length-1].phases = [phase1, phase2];
        this.setState({demo_step: demo_step+1, recipes: recipes});
        break;
      // 82 - show new phases
      case 83: // start simulation
        if(demo_steptime >= modal_time)
          this.setState({demo_step: demo_step+1, demo_steptime: 0.0, demo_modal: undefined});
        else
          this.setState({demo_steptime: demo_steptime, demo_modal_title: "Start simulation", demo_modal: "start simulation"});
        break;
     // 84 - pause
       case 85: // start simulation
         this.startSimulation();
         if(sim_view){
           this.setState({demo_step: demo_step+1});
         }
         break;
    // 86 - pause
      case 87: // modal - start recipe
        if(demo_steptime >= modal_time)
          this.setState({demo_step: demo_step+1, demo_steptime: 0.0, demo_modal: undefined});
        else
          this.setState({demo_steptime: demo_steptime, demo_modal_title: "Start prepared recipe", demo_modal: "start prepared recipe by clicking play button"});
        break;
    // 88 - pause
      case 89: // highlight play button and start recipe
        recipes[recipes.length-1].start();
        if(recipes[recipes.length-1].state === 1){
          this.setState({demo_step: demo_step+1, speed_faktor : 100.0});
        }

        break;
      case 90: // wait till recipe ends
        if(recipes[recipes.length-1].state === 0){
          this.setState({demo_step: demo_step+1});
        }
        break;
      case 91: // modal - start editor
        if(demo_steptime >= modal_time)
          this.setState({demo_step: demo_step+1, demo_steptime: 0.0, demo_modal: undefined});
        else
          this.setState({demo_steptime: demo_steptime, demo_modal_title: "Try it yourself!", demo_modal: "try it yourself now"});
        break;
      // 91 - Pause
      case 92: // Highlight Editor button and stop simulation
        this.stopSimulation();
        if(!sim_view){
          this.setState({demo_step: demo_step+1});
        }
        break;
      // 93 Pause
      case 94:
        clearInterval(this.timerDemo);
        this.setState({demo_step: 0, demo: false})
        break;
      default:
        this.setState({demo_step: demo_step+1, demo_modal: demo_modal, plants: plants});
    }
  }

  simulation() {
    const {automation, measurements, recipes, recipe, routes, pids, sim_on,
      speed_faktor, size} = this.state;
    let {active_phase} = this.state;
    if (sim_on){
        simulate(automation, measurements, pids, routes, speed_faktor, size);
        const sel_recipe = recipe !== undefined ? recipes[recipe] : undefined;
        const active_recipe = sel_recipe ? (sel_recipe.state !== 0 ? sel_recipe : undefined) : undefined;
        let phase_change_en = true;
        if(active_phase){
          phase_change_en = active_phase.state === 0;
        }
        if(active_recipe && routes){
          const temp_return = active_recipe.control(parseFloat(speed_faktor), routes, pids, automation);
          if(phase_change_en){
            active_phase = temp_return;
          }
        }
        if(active_phase){
          active_phase.control(speed_faktor);
        }
        this.setState({automation: automation, measurements: measurements, recipes: recipes, active_phase: active_phase, pids: pids, changes_automation: true});
    }
  }

  onDeleteAutomation(row, col){
    const {automation, measurements} = this.state;
    let {edit_auto} = this.state;
    automation[row][col] = new cAutomation();
    measurements[row][col] = [];
    if(edit_auto)
      edit_auto = edit_auto.row === row && edit_auto.col && col ? undefined : edit_auto;
    this.setState({automation: automation, measurements: measurements, changes_automation: true, edit_auto: edit_auto});
  }

  onDeletePID(idx){
    const {pids} = this.state;
    let {edit_pid} = this.state;
    pids.splice(idx, 1);
    if(edit_pid){
      edit_pid = edit_pid.idx === idx ? undefined : edit_pid;
    }
    this.setState({pids: pids, changes_automation: true, edit_pid: edit_pid});
  }

  onDeleteMeasurement(row, col, index){
    const {measurements} = this.state;
    measurements[row][col].splice(index,1);
    this.setState({measurements: measurements, changes_automation: true});
  }

  allowDrop(ev){
    ev.preventDefault();
  }

  dropOnPid(ev, idx){
    ev.preventDefault();

    const {pids, measurements, automation} = this.state;
    const dragged_object = JSON.parse(ev.dataTransfer.getData("text"));
    if (dragged_object.from !== 0){
       if(dragged_object.type === 10){
        pids[idx].meas = measurements[dragged_object.from.row][dragged_object.from.col][dragged_object.from.index];
        pids[idx].meas['row'] = dragged_object.from.row;
        pids[idx].meas['col'] = dragged_object.from.col;
        pids[idx].update();
      }
      else if(dragged_object.type === 4){
       pids[idx].act = automation[dragged_object.from.row][dragged_object.from.col];
       pids[idx].act['row'] = dragged_object.from.row;
       pids[idx].act['col'] = dragged_object.from.col;
       pids[idx].update();
     }
    }

    this.setState({pids: pids, changes_automation: true})
  }

  drop(ev, row, col){
    ev.preventDefault();
    const {automation, measurements} = this.state;
    const dragged_object = JSON.parse(ev.dataTransfer.getData("text"));
    if (dragged_object.from !== 0){
      if(dragged_object.type === 10){
        measurements[row][col].push(measurements[dragged_object.from.row][dragged_object.from.col][dragged_object.from.index]);
        measurements[dragged_object.from.row][dragged_object.from.col].splice(dragged_object.from.index, 1);
        ;
      }
      else{
        const copy = automation[dragged_object.from.row][dragged_object.from.col];
        const copy_m = measurements[dragged_object.from.row][dragged_object.from.col];
        automation[dragged_object.from.row][dragged_object.from.col] = automation[row][col];
        measurements[dragged_object.from.row][dragged_object.from.col] = measurements[row][col];
        automation[row][col] = copy;
        measurements[row][col] = copy_m;
      }
    }
    else{
      if(dragged_object.auto_type === 10){
          measurements[row][col].push(new cMeasurement(dragged_object, automation[row][col]));
      }
      else {
          automation[row][col] = getNewAutomation(dragged_object);
      }

    }
    this.setState({automation: automation, measurements: measurements, changes_automation: true})
  }

  drag(ev, auto_type, row, col, index){
    if(ev.dataTransfer.getData("text")){
      return 0;
    }
    const para ={type: auto_type, from: {row: row, col: col, index: index}};
    try {
      ev.dataTransfer.setData("text", JSON.stringify(para));
    } catch (error) {
      const dataList = ev.dataTransfer.items;
      dataList.add(JSON.stringify(para), "text");

    }
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
    window.removeEventListener('resize', this.handleResize);
  }

  componentDidMount() {
    const cookies = new Cookies();
    const logged_user = cookies.get('username')==="undefined" ? undefined : cookies.get('username');
    const token = cookies.get('token')==="undefined" ? undefined : cookies.get('token');
    window.addEventListener('resize', this.handleResize);
    this.setLogin(logged_user, token);
  }

  render() {
    const {sim_view, demo, demo_step, logged_user, loaded} = this.state;
    if (!loaded)
      return
        <div className={"modal is-active"}>
          <div className="modal-background"></div>
            LOADING
        </div>

    return (
  <>
    <div>
      <Menu sim={sim_view} demo={demo} demo_step={demo_step}
      onClickSim = {() => this.stopDemo().then(() => this.startSimulation())}
      onClickEdit ={() => this.stopDemo().then(() => this.stopSimulation())}
      onClickDemo ={() => this.startDemo()}
      onClickLogin={() => this.setState({login_modal: true})}
      onClickSignUp={() => this.setState({signup_modal: true})}
      setLogin={(user, token) => this.setLogin(user, token)} logged_user={logged_user}/>
      {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
      <Routes>
        <Route path="/about" element={
        <>
          <About/></>}
        />
        <Route path="/technology"element={
        <>
          <Technology/></>}
        />
        <Route path="/contact" element={
        <Contact/>}
        />
        <Route path="/manual" element={
        <Manual />}
        />
        <Route path="/" element={
          <Simulator {...this.state}
          setState={(args, callback) => this.setState(args, callback)}
          drag={(ev, auto_type, row, col, index) => this.drag(ev, auto_type, row, col, index)}
          drop={(ev, row, col) => this.drop(ev, row, col)}
          allowDrop={(ev) => this.allowDrop(ev)}
          dropOnPid={(ev, idx) => this.dropOnPid(ev, idx)}
          resizePlant={(rows, cols) => this.resizePlant(rows, cols)}
          saveChanges={() => this.saveChanges()}
          updateObject={(state_item, value, index1, index2, attr, update_var) => this.updateObject(state_item, value, index1, index2, attr, update_var)}
          restorePlantData={(index) => this.restorePlantData(index)}
          readPlantAutomation={(data, index) => this.readPlantAutomation(data, index)}
          onDeleteAutomation={(row,col) => this.onDeleteAutomation(row,col)}
          onDeleteMeasurement ={(row,col,index) => this.onDeleteMeasurement(row,col,index)}
          getPlantData={(index) => this.getPlantData(index)}
          getPlantRecipes={(index) => this.getPlantRecipes(index)}
          newPlant={() => this.newPlant()}
          deletePlant={(index) => this.deletePlant(index)}
          saveRecipe={(edit_recipe) => this.saveRecipe(edit_recipe)}
          getRecipeData={(index) => this.getRecipeData(index)}
          deleteRecipe={(index) => this.deleteRecipe(index)}
          newRecipe={(index) => this.newRecipe(index)}
          onDeletePID ={(idx) => this.onDeletePID(idx)}
          setLogin={(user, token) => this.setLogin(user, token)}
        />
      }/>
      </Routes>
    </div>
</>
    );
  }
}


function Simulator(props){
  const {automation, plants, pids, plant, recipe, routes,
    sim_on, demo_step, demo_modal, speed_faktor, active_phase, changes_automation, changes_plant,
    changes_recipe, save_date_time, display_tags,
    sim_view, token, edit_auto, edit_pid, edit_phase, edit_recipe,
    size, plant_delete_index, display_materials} = props;
  const edit_auto_obj = edit_auto ? automation[edit_auto.row][edit_auto.col] : undefined;
  return(
  <>
  <div className="columns" style={{borderTop: "2px solid grey"}}>
    {!sim_view ?
    <div className="column is-2 has-background-white-bis" style={{border: "1px solid grey"}}>
      <Toolbox demo_step={demo_step}/>
    </div> : ""}

    <div className={sim_view ? "column is-10 has-background-white-bis" : "column is-8 has-background-white-bis"}>
      <TopBar sim_view={sim_view} plant={plant} plants={plants} size={size} demo_step={demo_step}
      sim_on={sim_on} speed_faktor={speed_faktor}
      active_phase={active_phase} routes={routes} pids={pids}
      automation={automation} changes_automation={changes_automation}
      changes_plant={changes_plant} save_date_time={save_date_time}
      display_tags={display_tags} display_materials={display_materials} token={token}
      updatePlants={() => props.setState({plants: plants, changes_plant: true})}
      resizePlant={props.resizePlant}
      setPhase={(active, edit) => props.setState({edit_phase: edit, active_phase: active})}
      setSim={(on, view) => props.setState({sim_on: on, sim_view: view})}
      setSpeed={(speed) => props.setState({speed_faktor: parseFloat(speed)})}
      saveChanges={props.saveChanges}
      restorePlantData={() => props.restorePlantData(plant)}
      readPlantAutomation={data => props.readPlantAutomation(data, plant)}
      toggleDisplayTags={()=>props.setState({display_tags: !display_tags})}
      toggleDisplayMaterials={()=>props.setState({display_materials: !display_materials})}
      />

        <div className="columns has-background-white" style={{borderTop: "1px solid grey"}}>
          <div className={sim_view ? "column is-8 is-offset-1" : "column is-8"}>
            <PlantTable {...props}/>
          </div>

          <div className={sim_view ? "column is-3" : "column is-4"}>
            {recipe !== undefined ?
                <div className="box has-background-white-bis">
                <Recipe recipe={props.recipes[recipe]} sim = {sim_view}
                onEdit={() => props.setState({edit_recipe: props.recipes[recipe]})}
                onExit={() => props.setState({recipe: undefined, edit_recipe: undefined})}/></div> : <></>}

            {edit_phase ?
                <PhaseEdit phase={edit_phase} automation={automation} demo_step={demo_step}
                onClose = {() => props.setState({edit_phase: undefined})}
                update={() => props.setState({edit_phase: edit_phase})} /> : <></>}

            {edit_recipe !== undefined ?
                <RecipeEdit recipe={edit_recipe} demo_step={demo_step}
                sim = {sim_view} changes_recipe={changes_recipe}
                onClose = {() => props.setState({edit_recipe: undefined})}
                automation = {automation}
                update={() => props.setState({edit_recipe: edit_recipe, changes_recipe: true})}
                onSave={() => props.saveRecipe(edit_recipe)}/>
                : <></>}

            {edit_auto ?
                <AutomationObjectEdit edit_auto_obj = {edit_auto_obj} sim = {sim_view} demo_step = {demo_step}
                updateObject = {(state_item, value, attr) => props.updateObject(state_item, value, edit_auto.row, edit_auto.col, attr, "changes_automation")}
                updateAutomation={() => {props.setState({automation: automation, changes_automation: true})}}
                update={() => {props.setState({automation: automation, changes_automation: true})}}
                onClose = {() => props.setState({edit_auto: undefined})}
                onSave={() => props.setState({edit_auto: undefined}, () => props.saveChanges())}
                onDelete ={() => props.onDeleteAutomation(edit_auto.row, edit_auto.col)}/>
                : ""}

            {edit_pid ?
                <PidEdit pid = {pids[edit_pid.idx]} sim = {sim_view} demo_step={demo_step}
                key = {edit_pid.idx}
                updatePids={() => {props.setState({pids: pids, changes_automation: true})}}
                onClose = {() => props.setState({edit_pid: undefined})}
                onSave={() => props.setState({edit_pid: undefined}, () => props.saveChanges())}
                onDragOver={props.allowDrop}
                onDrop={(ev) => {props.dropOnPid(ev, edit_pid.idx)}}
                onDelete ={() => props.onDeletePID(edit_pid.idx)}/>
                : ""}

                <div className="box has-background-white-bis">
                  <div className="field is-grouped is-grouped-multiline">
                    <div className="control" style={{marginBottom: 0, padding: "0.25rem"}}>
                      <div className="tags has-addons">
                        <span className="tag icon-controller"></span>
                        <span className="tag is-light">PID Controllers: </span>
                      </div>
                    </div>
                    {pids.map((el, idx) => (<Pid key={idx} pid={el} demo_step={demo_step}
                      onDragOver={props.allowDrop}
                      onDrop={(ev) => {props.dropOnPid(ev, idx)}}
                      updatePids={() => props.setState({pids: pids})}
                      onClick={() => props.setState({edit_pid: {idx: idx}})}
                      onDelete ={() => props.onDeletePID(idx)}
                      />))}
                    <div className={demo_step === 40 ? "control has-background-warning" : "control"} style={{marginBottom: 0, padding: "0.25rem"}}>
                      <div className="tags has-addons">
                        <a onClick={() =>{props.pids.push(new cPID()); props.setState({pids: pids});}}>
                          <span className={demo_step === 40 ? "tag is-warning icon-plus"  : "tag is-light icon-plus" }></span>
                        </a>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </div>
      {sim_view ?
      <div className="columns has-background-white">
        <div className= "column is-2 is-offset-1">
          <h1 className="is-size-5 has-text-weight-bold">Routes</h1>
          <table className="table">
            <thead>
              <tr>
                <th>id</th><th>start</th><th>end</th><th>dim</th><th>flow</th>
              </tr>
            </thead>
            <tbody>
            {routes.map((c, id) => (
                <tr key={id}>
                  <td key = "id" >{id}</td>
                  <td key = "start" >{c.start.row+":"+c.start.col}</td>
                  <td key = "end" >{c.end.row+":"+c.end.col}</td>
                  <td key = "dim" >{c.dim}</td>
                  <td key = "flow" >{c.flow.toFixed(precision(c.flow, 2))}</td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div> : <></>}
    </div>

    <div className="column is-2 has-background-white-bis" style={{border: "1px solid grey"}}>
      <ProjectTree plants={props.plants} plant={plant} demo_step={demo_step}
      recipes={props.recipes} recipe={recipe}
      getPlantData={(index) => props.getPlantData(index)}
      getPlantRecipes={(index) => props.getPlantRecipes(index)}
      token={token}
      updatePlants={(plants) => props.setState({plants: plants})}
      deletePlant={index => props.setState({plant_delete_index: index})}
      getRecipeData={(index) => props.getRecipeData(index)}
      deleteRecipe={index => props.deleteRecipe(index)}
      updateRecipes={(recipes) => props.setState({recipes: recipes})}
      newPlant={props.newPlant}
      newRecipe={props.newRecipe}
      />
    </div>
  </div>

  <div className={props.login_modal ? "modal is-active" : "modal"}>
    <div className="modal-background"></div>
      <LoginClass setLogin={(user, token) => props.setLogin(user, token)} onClickClose={() => props.setState({login_modal: false})}/>
  </div>

  <div className={props.signup_modal ? "modal is-active" : "modal"}>
    <div className="modal-background"></div>
      <SignUpClass setLogin={(user, token) => props.setLogin(user, token)} onClickClose={() => props.setState({signup_modal: false})}/>
  </div>

  {props.plant_delete_index !== undefined ?
    <div className="modal is-active">
      <div className="modal-background">
      </div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{"Do you want to delete plant: "+props.plants[plant_delete_index].title+" ?"}</p>
          <button className="delete" aria-label="close" onClick={() => props.setState({plant_delete_index: undefined})}></button>
        </header>
        <section className="modal-card-body">
          <div className="buttons is-centered">
            <button className="button is-block is-danger" onClick={() => props.deletePlant(plant_delete_index)}>DELETE</button>
            <button className="button is-block is-success" onClick={() => props.setState({plant_delete_index: undefined})}>CANCEL</button>
          </div>
        </section>
        <footer className="modal-card-foot">
        </footer>
      </div>
    </div> : <></>}

  {demo_modal ?
    <div className="modal is-active">
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{props.demo_modal_title}</p>
        </header>
        <section className="modal-card-body">
          <div className="buttons is-centered">
            <p>{demo_modal}</p>
          </div>
        </section>
        <footer className="modal-card-foot">
        </footer>
      </div>
    </div>
    :
    <></>}
</>
);
}


export default App;
