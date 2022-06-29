import {cRoute} from './Automation';


function simulate(automation, measurements, pids, routes, speed_faktor, size){
    simFlow(automation, routes, parseFloat(speed_faktor));
    // simulate
    for (let row = 0; row < automation.length; row++) {
      var innerArrayLength = automation[row].length;
      for (let col = 0; col < innerArrayLength; col++) {
          const neighbours_temp = getNeighboursTemp(row, col, automation, size);
          const neighbours_material = getNeighboursMaterial(row, col, automation, size);
          automation[row][col].simulate(neighbours_temp, neighbours_material, parseFloat(speed_faktor));
          for (let idx = 0; idx < measurements[row][col].length; idx++){
            measurements[row][col][idx].getPV();
          }
      }
    }
    for (let idx = 0; idx < pids.length; idx++)
      pids[idx].calc(parseFloat(speed_faktor));
}

function simFlow(automation, routes, speed_faktor){
  // clear flow
  for (let row = 0; row < automation.length; row++) {
    var innerArrayLength = automation[row].length;
    for (let col = 0; col < innerArrayLength; col++) {
        automation[row][col].flow_v = [0.0, 0.0];
        automation[row][col].flow_in = [0.0, 0.0, 0.0, 0.0];
    }
  }

  for (let r of routes) {
    // Check if the route is opened
    let way_open = true;
    for (let v of r.valves){
      const v_way = r.way[v];
      const valve = automation[v_way.row][v_way.col];
      if (!valve.open)
        way_open = false;
    }
    let p_pump = 0.0;
    for (let p of r.pumps){
      const p_way = r.way[p];
      const pump = automation[p_way.row][p_way.col];
      p_pump += pump.getDp(p_way.dir_in, p_way.dir_out);
    }

    // calculate route flow
    const p_start = automation[r.start.row][r.start.col].getP(speed_faktor);
    const p_end = automation[r.end.row][r.end.col].getP(speed_faktor);
    r.calcFl(p_start, p_end, p_pump, way_open);
  }

  // Calculate pump sumaarized flow
  for (let r of routes) {
    for (let p of r.pumps){
      const w = r.way[p]; // waypoint on pump
      const pump = automation[w.row][w.col];
      const flow_v = flowToVector(r.flow, w.dir_in, w.dir_out);
      pump.flow_v[0] += flow_v[0];
      pump.flow_v[1] += flow_v[1];
      pump.calcFlow();
    }
  }

  // Check if the route flow does not need to be limited by pump
  for (let r of routes) {
    for (let p of r.pumps){
      const w = r.way[p]; // waypoint on pump
      const pump = automation[w.row][w.col];
      r.flow = pump.flow > r.flow ? r.flow * Math.abs((r.flow / pump.flow)) : r.flow;
    }
  }


  for (let r of routes) {
    // sum flow for routes
    for (let w of r.way) {
        const flow_v = flowToVector(r.flow, w.dir_in, w.dir_out);
        automation[w.row][w.col].flow_v[0] += flow_v[0];
        automation[w.row][w.col].flow_v[1] += flow_v[1];
        automation[w.row][w.col].flow_in[w.dir_in] += r.flow;
        automation[w.row][w.col].flow_in[w.dir_out] -= r.flow;
    }
  }
}


function flowToVector(flow, dir_in, dir_out){
  // flow as vector down, right positive, up, left, negative
  // (vertical (up->down), horizontal (left->right))
  const flow_diag = flow/Math.sqrt(2);
  const nflow = -1.0 * flow;
  const nflow_diag = -1.0 * flow_diag;

  switch(dir_in){
    case 0: switch(dir_out){
      case 0: return [0.0, 0.0];
      case 1: return [flow_diag, flow_diag];
      case 2: return [flow, 0.0];
      case 3: return [flow_diag, nflow_diag];
      default: return [flow, 0.0];
    }
    case 1:switch(dir_out){
      case 0: return [nflow_diag, nflow_diag];
      case 1: return [0.0, 0.0];
      case 2: return [flow_diag, nflow_diag];
      case 3: return [0.0, nflow];
      default: return [0.0, nflow];
    }
    case 2:switch(dir_out){
      case 0: return [nflow, 0.0];
      case 1: return [nflow_diag, flow_diag];
      case 2: return [0.0, 0.0];
      case 3: return [nflow_diag, nflow_diag];
      default: return [nflow, 0.0];
    }
    case 3:switch(dir_out){
      case 0: return [nflow_diag, flow_diag];
      case 1: return [0.0, flow];
      case 2: return [flow_diag, flow_diag];
      case 3: return [0.0, 0.0];
      default: return [0.0, flow];
    }
    default: switch(dir_out){
      case 0: return [nflow, 0.0];
      case 1: return [0.0, flow];
      case 2: return [flow, 0.0];
      case 3: return [0.0, nflow];
      default: return [0.0, 0.0];
    }
  }
}


function findRoutes(automation, size){
  for (let row = 0; row < automation.length; row++) {
    for (let col = 0; col < automation[row].length; col++) {
      automation[row][col].connected = [false,false,false,false];
    }
  }

  const routes = [];
    for (let row = 0; row < automation.length; row++) {
      for (let col = 0; col < automation[row].length; col++) {
        findRoute(routes, automation, row,col,undefined,row,col, size);
      }
    }

  return {routes: routes, automation: automation};
}


function findRoute(routes, automation, row, col, pr_route, pr_row, pr_col, size){
  if(routes.length>100){
    return 0;
  }
  const auto_type = automation[row][col].auto_type;
  const is_source = automation[row][col].is_source;
  const dir_in = findDirection(pr_row, pr_col, row, col);

  let route = pr_route;
  if (pr_route === undefined)
      if (is_source){
        route = new cRoute(row, col);
      }
      else {
        return 0
      }
  else{
    route.length++;
    const last_point = route.way[route.way.length-1];
    last_point.dir_out = Opposite(dir_in);
    route.way.push({row: row, col: col, dir_in: dir_in, dir_out: undefined});
    // continuation

    switch(auto_type){
      case 2: // Tank, Reactor or Target
      case 6:
      case 8:
        // finished, target reached

        const start_can_be_end = automation[route.start.row][route.start.col].is_source && automation[route.start.row][route.start.col].is_target;
        let exists = start_can_be_end && (route.start.row > row || (route.start.row == row && route.start.col >= col));

        if(exists || route.way.length <= 2)
          return 0
        route.end = {row: row, col: col}
        route.way[route.way.length-1].dir_out = undefined;

        // mark connections
        for(let i=0; i<route.way.length; i++){
          const automation_object = automation[route.way[i].row][route.way[i].col];
          if(route.way[i].dir_in !== undefined){
              automation_object.connected[route.way[i].dir_in] = true;
          }
          if(route.way[i].dir_out !== undefined){
              automation_object.connected[route.way[i].dir_out] = true;
          }
        }

        routes.push(route);
        return 1;
      case 1: // VALVE
        // add valve to route
        route.valves.push(route.way.length-1);
        break;
      case 3: // PIPE
        // find smallest diameter
        route.dim = route.dim > automation[row][col].dim ? automation[row][col].dim : route.dim;
        break;
      case 4: // PUMP
        // add pump to the route
        route.pumps.push(route.way.length-1);
        break;
      case 5: // Source
        // 2 sources are not allowed in one route
        return 0;
      default: // othwerise do nothing
        ;
    }
  }
  // find next path
  const next_pathIDs = automation[row][col].nextPath(getNeighboursID(row, col, size), dir_in);
  if (next_pathIDs === 0 || route.length > 100)
    return 0;
  let np_id = 0;
  // save route data for new branches
  const route_save = new cRoute(0,0);
  if (next_pathIDs.length > 1){
    route_save.fill(route);
  }

  for (let np of next_pathIDs) {
    // test for circle road, not allowed
    let circle = false;
    for(let w of route.way){
      if (w.row === np.row && w.col === np.col){
        circle = true;
        break;
      }
    }
    if(circle){
      return 0;
    }

    if(np){
      // first next path continues the same route, other get a copy
      if(np_id === 0){
        findRoute(routes, automation, np.row, np.col, route, row, col, size);
      }
      else{
        const next_route = new cRoute(0,0);
        next_route.fill(route_save);
        findRoute(routes, automation, np.row, np.col, next_route, row, col, size);
      }
      np_id++;
    }
  }
}


function getNeighboursID(row, col, size) {
  const neighboursID = [undefined, undefined, undefined, undefined];
  neighboursID[0] = row > 0 ? {row: row-1, col: col} : undefined;
  neighboursID[1] = col < size.cols-1 ? {row: row, col: col+1} : undefined;
  neighboursID[2] = row < size.rows-1 ? {row: row+1, col: col} : undefined;
  neighboursID[3] = col > 0 ? {row: row, col: col-1} : undefined;
  return neighboursID;
}


function getNeighboursMaterial(row, col, automation, size) {
  const neighboursMat = [undefined, undefined, undefined, undefined];
  neighboursMat[0] = row > 0 ? automation[row-1][col].material : undefined;
  neighboursMat[1] = col < size.cols-1 ? automation[row][col+1].material : undefined;
  neighboursMat[2] = row < size.rows-1 ? automation[row+1][col].material : undefined;
  neighboursMat[3] = col > 0 ? automation[row][col-1].material : undefined;
  return neighboursMat;
}


function getNeighboursTemp(row, col, automation, size) {
  const neighboursTemp = [undefined, undefined, undefined, undefined];
  neighboursTemp[0] = row > 0 ? automation[row-1][col].temperature : undefined;
  neighboursTemp[1] = col < size.cols-1 ? automation[row][col+1].temperature : undefined;
  neighboursTemp[2] = row < size.rows-1 ? automation[row+1][col].temperature : undefined;
  neighboursTemp[3] = col > 0 ? automation[row][col-1].temperature : undefined;
  return neighboursTemp;
}


function Opposite(dir){
  switch(dir){
    case 0:  return 2;
    case 1:  return 3;
    case 2:  return 0;
    case 3:  return 1;
    default:  return 0;
  }
}


function findDirection(from_row, from_col, to_row, to_col){
  if (from_row < to_row)
    return 0;
  if (from_col < to_col)
    return 3;
  if (from_row > to_row)
    return 2;
  if (from_col > to_col)
    return 1;
  return undefined;
}


export {
  findRoutes, simulate}
