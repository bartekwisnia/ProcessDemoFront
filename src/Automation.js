function Inertia(dT, faktorT, u, y_prev){
  const faktorU = parseFloat(dT)/(parseFloat(dT)+parseFloat(faktorT));
  const faktorY = faktorT/(dT+faktorT);
  return faktorU*u+faktorY*y_prev;
}


class cAutomation {
  constructor(data={id: 0, name: "", material: [0,0,0]}) {
    this.id = data.id ? data.id : 0;
    this.name = data.name ? data.name : "";
    this.auto_type = 0; // 0 - empty, 1 - Valve, 2 - Tank, 3 - Pipe, 4 - Pump, 5 - Source, 6 -Target, 7 - Heat exchanger, 8 - Reactor
    this.pressure = 0.0;
    this.flow_v = [0.0,0.0];
    this.flow_in = [0.0,0.0,0.0,0.0];
    this.flow = 0.0;
    this.flow_dir = 0;
    this.temperature = data.temperature ? data.temperature : 20.0;
    this.fill = data.fill ? data.fill : 0.0;
    this.fill_m3 = data.fill_m3 ? data.fill_m3 : 0.0;
    this.connections = data.connections ? data.connection : [0,0,0,0];
    this.connected = data.connected ? data.connected : [0,0,0,0];
    this.setpoint = 0.0;
    this.is_source = false;
    this.is_target = false;
    this.material = data.material ? (Array.isArray(data.material) ? data.material : [0,0,0]) : [0,0,0];
  }

  get p_out() {
    return 0.0;
  }

  isSourceTarget(){
    return this.auto_type === 2;
  }

  calcFlow(){
    this.flow = Math.sqrt(Math.pow(this.flow_v[0],2) + Math.pow(this.flow_v[1],2));
  }

  calcMaterial(neighbours_material, dT){
    let material_flow_count = 0.0;
    let material_flow_sum = [0,0,0];

    for(let i=0; i<=3; i++){
      if(this.flow_in[i] > 0.01 && this.connected[i] && neighbours_material[i] !== undefined){
        material_flow_sum[0] += neighbours_material[i][0]*Math.abs(this.flow_in[i]);
        material_flow_sum[1] += neighbours_material[i][1]*Math.abs(this.flow_in[i]);
        material_flow_sum[2] += neighbours_material[i][2]*Math.abs(this.flow_in[i]);
        material_flow_count += Math.abs(this.flow_in[i]);
      }
    }

    if(material_flow_count > 0.0){
      if(this.fill_m3 > 0.0){
        const m3_in = (material_flow_count * dT) / 3600.0;
        this.material[0] = ((material_flow_sum[0]/material_flow_count) * m3_in + this.material[0] * this.fill_m3) / (m3_in + this.fill_m3);
        this.material[1] = ((material_flow_sum[1]/material_flow_count) * m3_in + this.material[1] * this.fill_m3) / (m3_in + this.fill_m3);
        this.material[2] = ((material_flow_sum[2]/material_flow_count) * m3_in + this.material[2] * this.fill_m3) / (m3_in + this.fill_m3);
      }
      else {
        const set_material = [0,0,0]
        set_material[0] = material_flow_sum[0] / material_flow_count;
        set_material[1] = material_flow_sum[1] / material_flow_count;
        set_material[2] = material_flow_sum[2] / material_flow_count;
        this.material[0] = Inertia(dT, 1.0, set_material[0], this.material[0]);
        this.material[1] = Inertia(dT, 1.0, set_material[1], this.material[1]);
        this.material[2] = Inertia(dT, 1.0, set_material[2], this.material[2]);
      }

    }
  }

  calcTemp(neighbours_temp, dT){
  let conn_count = 0;
  let diffusion_temp = 0.0;
  for(let i=0; i<=3; i++){
    if(this.connected[i] && neighbours_temp[i] !== undefined){
      conn_count++;
      diffusion_temp += neighbours_temp[i];
    }
  }



  let temp_flow_count = 0.0;
  let temp_flow_sum = 0.0;

  for(let i=0; i<=3; i++){
    if(this.flow_in[i] > 0.01 && this.connected[i] && neighbours_temp[i] !== undefined){
      temp_flow_sum += neighbours_temp[i]*Math.abs(this.flow_in[i]);
      temp_flow_count += Math.abs(this.flow_in[i]);
    }
  }
  if(temp_flow_count > 0.0){
    let set_temp = this.temperature;
    if(this.fill_m3 > 0.0){
      const m3_in = (temp_flow_count * dT) / 3600.0;
      this.temperature = ((temp_flow_sum/temp_flow_count) * m3_in + this.temperature * this.fill_m3) / (m3_in + this.fill_m3);
    }
    else {
      set_temp = temp_flow_sum / temp_flow_count;
      this.temperature = Inertia(dT, 5.0, set_temp, this.temperature);
    }

  }
  else{
    const diffusion= conn_count ? diffusion_temp / conn_count : 0.0;
    this.temperature = Inertia(dT, 3600.0, diffusion, this.temperature);
  }
  }

  simulate(neighbours_temp, neighbours_material, dT){
    this.calcFlow();
    this.calcTemp(neighbours_temp, dT);
    this.calcMaterial(neighbours_material, dT);
  }

  nextPath(neighbours, dir){
    const next = [];
    for (let i = 0; i < 4; i++)
      if (this.connections[i] && neighbours[i] && i!==dir)
        next.push(neighbours[i]);
    return next;
  }
}


class cValve extends cAutomation {
  constructor(data={name: "V00", open: false, connections: [0,1,0,1]}) {
    super(data);
    this.auto_type = 1; // 1 - valve
    this.connections = data.connections;
    this.open = data.open;
  }

  toggle() {
  this.open = !this.open;
  }

  calcTemp(neighbours_temp, dT){
    if(this.open)
      super.calcTemp(neighbours_temp, dT);
  }
}


class cPump extends cAutomation {
  constructor(data={name: "P00", on: false, speed: 50.0, end: 1, connections: [0,1,0,1]}) {
    super(data);
    this.auto_type = 4; // 4 - pump
    this.on = data.on;
    this.connections = data.connections;
    this.end = data.end;
    this.speed = data.speed;
    this.reverse = false;
  }

  toggle() {
  this.on = !this.on;
  }

  getDp(way_dir_in, way_dir_out) {
      const direction = this.reverse ? -1.0 : 1.0;
      this.speed = this.on ? direction*this.setpoint : this.speed;

      if(way_dir_out === this.end){
          // pump in the same direction as route, pressure positive
        return this.on ? 0.1*this.speed : 0.0;
      }
      else if(way_dir_in === this.end){
        // pump in the same direction as route, pressure positive
        return this.on ? -0.1 * this.speed : 0.0;
      }
    }

  get speed_out() {
    this.speed = this.on ? this.setpoint : this.speed;
    return this.on ? this.speed : 0.0;
  };
}


class cTank extends cAutomation {
  constructor(data={name: "T00", volume: 10.0, height: 10.0, connections: [1,1,1,1]}) {
    super(data);
    this.auto_type = 2; // 2 - tank
    this.volume = parseFloat(data.volume); // m3
    this.fill_m3 = this.fill/100.0 * this.volume;
    this.height = parseFloat(data.height); // meters
    this.connections =[1,1,1,1];
    this.is_source = true;
    this.is_target = true;
  }

  getP() {
    this.pressure = 0.01*9.81*(this.fill/100.0)*this.height; // Bar
    return this.pressure;
  }

  simulate(neighbours_temp=[undefined, undefined, undefined, undefined], neighbours_material=[undefined, undefined, undefined, undefined], dT=1.0){
    this.fill_m3 = this.fill / 100.0 * this.volume;
    let flow_in_sum = 0.0;
    for(let i=0; i<=3; i++){
      flow_in_sum += this.flow_in[i]; // Positive, flow into tank, negativ, out of tank
    }
    this.flow = Math.sqrt(Math.pow(this.flow_v[0],2) + Math.pow(this.flow_v[1],2));
    // flow positive down, vertical, outgoing from tank
    this.fill_m3 += dT*flow_in_sum/3600.0; //m3/h -> m3/s
    this.fill = this.fill_m3 / this.volume * 100.0;
    this.fill = this.fill > 100.0 ? 100.0 : this.fill < 0.0 ? 0.0 : this.fill;
    super.simulate(neighbours_temp, neighbours_material, dT);
  }
}


class cSource extends cAutomation {
  constructor(data={name: "S00", pressure: 4.0}) {
    super(data);
    this.auto_type = 5;
    this.pressure = data.pressure ? data.pressure : 4.0;
    this.connections = [1,1,1,1];
    this.is_source = true;
    this.is_target = false;
  }

  getP() {
    return this.pressure;
  }

}


class cTarget extends cAutomation {
  constructor(data={name: "T00"}) {
    super(data);
    this.auto_type = 6;
    this.pressure = 0.0;
    this.connections = [1,1,1,1];
    this.is_source = false;
    this.is_target = true;
  }

  getP() {
    return 0.0;
  }

}


class cPipe extends cAutomation{
  constructor(data={name: "", dim: 60, connections: [0,1,0,1]}) {
    super(data);
    this.auto_type = 3; // 2 - tank
    this.dim = data.dim;
    this.connections = data.connections;
  }

}


class cReactor extends cAutomation {
  constructor(data={name: "R00", volume: 10.0, height: 10.0,
  connections: [1,1,1,1], set_temperature: 21.0, set_pressure: 1.0,
  temperature_control: false, pressure_control: false, mixing_on: false} ) {
    super(data);
    this.auto_type = 8;
    this.volume = parseFloat(data.volume); // m3
    this.fill_m3 = this.fill/100.0 * this.volume;
    this.height = parseFloat(data.height); // meters
    this.set_temperature = data.set_temperature !== undefined ? parseFloat(data.set_temperature) : 21.0;
    this.set_pressure = data.set_pressure !== undefined ? parseFloat(data.set_pressure) : 1.0;
    this.temperature_control = data.temperature_control !== undefined ? data.temperature_control : false;
    this.pressure_control = data.pressure_control !== undefined ? data.pressure_control : false;
    this.mixing_on = data.mixing_on !== undefined ? data.mixing_on : false;
    this.connections = [1,1,1,1];
    this.is_source = true;
    this.is_target = true;
    this.is_reactor = true;
  }

  getP(dT) {
    this.pressureControl(dT);
    return this.pressure;
  }

  pressureControl(dT){

    const hydrostatic = 0.01*9.81*(this.fill/100.0)*this.height; // Bar
    let flow_in_sum = 0.0;
    for(let i=0; i<=3; i++){
      flow_in_sum += this.flow_in[i]; // Positive, flow into tank, negativ, out of tank
    }
    let self_pressure = flow_in_sum < 0.0 ? hydrostatic : this.pressure;
    if(self_pressure < hydrostatic){
      self_pressure = hydrostatic;
    }
    const time_factor = this.mixing_on ? 20.0 : 1200.0;
    const set_pressure = this.pressure_control ? this.set_pressure : self_pressure;
    const flowT = Math.abs(flow_in_sum) > 0.1 ? 600.0/Math.abs(flow_in_sum) : 9999999.0;
    const faktorT = this.pressure_control ? time_factor*(this.fill/100.0) : flowT;
    this.pressure = Inertia(dT, faktorT, set_pressure, this.pressure);
    return this.pressure;
  }

  temperatureControl(dT){
    if(this.temperature_control){
      const time_factor = this.mixing_on ? 20.0 : 1200.0;
      const faktorT = time_factor*(this.fill/100);
      this.temperature = Inertia(dT, faktorT, this.set_temperature, this.temperature);
    }
    return this.temperature;
  }

  simulate(neighbours_temp=[undefined, undefined, undefined, undefined], neighbours_material=[undefined, undefined, undefined, undefined], dT=1.0){
    this.fill_m3 = this.fill / 100.0 * this.volume;
    let flow_in_sum = 0.0;
    for(let i=0; i<=3; i++){
      flow_in_sum += this.flow_in[i]; // Positive, flow into tank, negativ, out of tank
    }
    this.flow = Math.sqrt(Math.pow(this.flow_v[0],2) + Math.pow(this.flow_v[1],2));
    // flow positive down, vertical, outgoing from tank
    this.fill_m3 += dT*flow_in_sum/3600.0; //m3/h -> m3/s
    this.fill = this.fill_m3 / this.volume * 100.0;
    this.fill = this.fill > 100.0 ? 100.0 : this.fill < 0.0 ? 0.0 : this.fill;
    this.pressureControl(dT);
    this.temperatureControl(dT);
    super.simulate(neighbours_temp, neighbours_material, dT);
  }
}


class cMeasurement{
  constructor(data={name: "FITXY", meas_type: 1, id: 0}, automation) {
    this.id = data.id ? data.id : 0;
    this.name = data.name ? data.name : "";
    this.auto_type = 10; // 10 - measurement
    this.meas_type = data.meas_type;
    this.automation = automation;
    this.getPV();

    switch(this.meas_type) {
      case 1: // flow
        this.background_color = "aqua";
        this.text_color = "black";
        this.unit = "m³/h";
        break;
      case 2: // pressure
        this.background_color = "blue";
        this.text_color = "white";
        this.unit = "bar";
        break;
      case 3: // temperature
        this.background_color = "yellow";
        this.text_color = "black";
        this.unit = "°C";
        break;
      case 4: // fill %
        this.background_color = "blueviolet";
        this.text_color = "white";
        this.unit = "%";
        break;
      case 5: // fill m³
        this.background_color = "blueviolet";
        this.text_color = "white";
        this.unit = "m³";
        break;
      default:
        this.background_color = "white";
        this.text_color = "black";
        this.unit = "";
    }
  }

  getPV(){
      const automation = this.automation;
      if(!automation){
        this.pv = 0.0;
        return 0.0
      }
      switch(this.meas_type) {
        case 1: // flow
          this.pv = automation.flow;
          break;
        case 2: // pressure
          this.pv = automation.pressure;
          break;
        case 3: // temperature
          this.pv = automation.temperature;
          break;
        case 4:
          this.pv = automation.auto_type === 4 ? automation.speed_out : automation.fill;
          break;
        case 5:
          this.pv = automation.fill_m3;
          break;
        default:
          this.pv = 0.0;
    }
    return this.pv;
  }

}


class cRoute {
  constructor(start_row, start_col) {
    this.start ={row: start_row, col: start_col};
    this.end = {row: start_row, col: start_col};
    this.valves = [];
    this.pumps = [];
    this.way = [{row: start_row, col: start_col, dir_in: undefined, dir_out: undefined}];
    this.dim = 60; // mm
    this.length = 1;
    this.flow = 0.0;
  }

get area(){
  return 3.14*Math.pow(this.dim/2000.0, 2);
}

calcFl(p_start, p_end, p_pump, open){
  const p_diff = p_start - p_end + p_pump;
  const p_dir = p_diff < 0 ? -1.0 : 1.0;
  //conasole.log("P start:" + p_start + ", p_end:" + p_end + ", p_pump:" + p_pump + ", open:" + open +", p_diff: "+p_diff+", p_dir:"+p_dir);
  const source_not_empty = p_dir === 1.0 ? p_start > 0.0 : p_end > 0.0;
  this.flow = open && source_not_empty ? 1000.0 * p_dir * this.area * Math.sqrt(Math.abs(p_diff)) : 0.0;
  this.flow = Math.abs(this.flow) < 0.00001 ? 0.0 : this.flow;
  return this.flow;
}

fill(source){
  this.start = {row: source.start.row, col: source.start.col};
  this.end = {row: source.end.row, col: source.end.col};
  this.valves = [];
  for (let i = 0; i<source.valves.length; i++){
    this.valves.push(source.valves[i]);
  }
  this.pumps =[];
  for (let i = 0; i<source.pumps.length; i++){
    this.pumps.push(source.pumps[i]);
  }
  this.way = [];
  for (let i = 0; i<source.way.length; i++){
    this.way.push({row: source.way[i].row, col: source.way[i].col, dir_in: source.way[i].dir_in, dir_out: source.way[i].dir_out});
  }
  this.dim = source.dim;
  this.length = source.length;
  this.flow = source.flow;
}
}


class cPID{
  constructor(data={id:0, name: "PID00", on: false, p_faktor: 1.0, i_faktor: 20.0, d_faktor: 0.0, sp: 50.0, mv: 0.0}){
    this.id=data.id ? data.id : 0;
    this.auto_type = 20;
    this.name = data.name;
    this.meas = data.meas;
    this.act = data.act;
    this.p_faktor = data.p_faktor ? data.p_faktor : 1.0;
    this.i_faktor = data.i_faktor ? data.i_faktor : 5.0;
    this.d_faktor = data.d_faktor ? data.d_faktor : 0.0;
    this.sp = data.sp ? data.sp : 0.0;
    this.mv = data.mv ? data.mv : 0.0;
    this.on = data.on ? data.on : false;

    this.error =[0.0, 0.0, 0.0];
    this.pv = this.meas ? this.meas.pv : 0.0;
    this.unit = this.meas ? this.meas.unit : "";
  }

  update(){
    this.pv = this.meas ? this.meas.pv : 0.0;
    this.pv = isNaN(parseFloat(this.pv)) ? 0.0 : parseFloat(this.pv);
    this.unit = this.meas ? this.meas.unit : "";
  };

  calc(dt){
    this.pv = this.meas ? this.meas.pv : 0.0;
    this.unit = this.meas ? this.meas.unit : "";

    const pv = isNaN(parseFloat(this.pv)) ? 0.0 : parseFloat(this.pv);
    const sp = isNaN(parseFloat(this.sp)) ? 0.0 : parseFloat(this.sp);
    const mv = isNaN(parseFloat(this.mv)) ? 0.0 : parseFloat(this.mv);

    this.error[2] = this.error[1]; // e(t-2)
    this.error[1] = this.error[0]; // e(t-1)
    this.error[0] = (sp - pv) / 10.0; // e(t)

    if(this.on && dt > 0.0 && this.i_faktor > 0.0){
      const Ki = this.p_faktor / this.i_faktor;
      const A0 = this.p_faktor + Ki*dt + this.d_faktor/dt;
      const A1 = -1*this.p_faktor - 2*this.d_faktor/dt;
      const A2 = this.d_faktor/dt;
      this.mv = mv + A0 * this.error[0] + A1 * this.error[1] + A2 * this.error[2];
      if(this.mv > 100.0)
        this.mv = 100.0;
      else if(this.mv <= 0.0)
        this.mv = 0.0;
      if(this.act){
        this.act.setpoint = this.mv;
      }
    }
    else {
      this.mv = this.act ? this.act.setpoint : this.mv;
    }
  }
}


class cPhaseTransfer{ // Phase nr 1
  constructor(data={parameters:{source: {row: undefined, col:undefined}, target:{row: undefined, col: undefined}, goal_type: 1, goal_param: 0.0, flow_control: 0, flow_control_param: 0.0}, end_cond: 0, in_background: false, id: 0}){
    this.id = data.id ? data.id : 0;
    this.phase_num = 1;
    this.parameters = data.parameters;
    if(!data.parameters.source)
        this.parameters.source = {row: undefined, col:undefined};
    if(!data.parameters.target)
        this.parameters.target = {row: undefined, col:undefined};
    if(!data.parameters.goal_type)
        this.parameters.goal_type =  0; // 0 - continuous (must be stopped), 1 - volume, 2 - level source, 3 - level is_source_target
    if(!data.parameters.goal_param)
        this.parameters.goal_param = 0.0; // volume
    if(!data.parameters.flow_control)
        this.parameters.flow_control = 0; // 0 - fixed speed, 1 - flow Controllers
    if(!data.parameters.flow_control_param)
        this.parameters.flow_control_param = 0.0; // speed or flow
    this.end_cond = data.end_cond ? data.end_cond : 0;
    this.in_background = data.in_background ? data.in_background : false;
    this.state = 0; // 0 - initial, 1 - trasnfer on
    this.source_obj=undefined;
    this.target_obj=undefined;
    this.route=undefined;
    this.volume = 0.0;
    this.pids = [];
    this.valves = [];
    this.pumps = [];
    this.opposite_way = false;
}

  init(routes, automation){
    this.getObjects(automation);
    this.findRoute(routes, automation);
  }

  getObjects(automation){
    this.source_obj=automation[this.parameters.source.row][this.parameters.source.col];
    this.target_obj=automation[this.parameters.target.row][this.parameters.target.col];
  }

  findRoute(routes, automation){
    for (let i = 0; i < routes.length; i++){
      if(routes[i].start.row === this.parameters.source.row && routes[i].start.col === this.parameters.source.col
        && routes[i].end.row === this.parameters.target.row && routes[i].end.col === this.parameters.target.col){
        this.route = routes[i];
        this.opposite = false;
        break;
      }
      else if(routes[i].start.row === this.parameters.target.row && routes[i].start.col === this.parameters.target.col
        && routes[i].end.row === this.parameters.source.row && routes[i].end.col === this.parameters.source.col){
        this.route = routes[i];
        this.opposite = true;
        break;
      }
    }
    this.pids = [];
    this.valves =[];
    this.pumps = [];
  }

  start(routes, pids, automation){
    if(this.state === 0){
      if(!routes || !automation){
        return 0;
      }

      this.findRoute(routes,automation);
      if(!pids || !this.route){
        return 0;
      }
      this.valves=[]
      for (let i = 0; i < this.route.valves.length; i++){
        const valve_idx = this.route.valves[i];
        const valve = automation[this.route.way[valve_idx].row][this.route.way[valve_idx].col];
        this.valves.push(valve);
      }
      this.pumps=[];
      for (let i = 0; i < this.route.pumps.length; i++){
        const pump_idx = this.route.pumps[i];
        const pump = automation[this.route.way[pump_idx].row][this.route.way[pump_idx].col];
        const normal = pump.end ===  this.route.way[pump_idx].dir_out;
        const reverse = pump.end ===  this.route.way[pump_idx].dir_in;
        this.pumps.push({pump: pump, normal: normal, reverse: reverse});
      }
      this.pids=[];
      for (let i = 0; i < this.pumps.length; i++){
        for (let j = 0; j < pids.length; j++){
          if(pids[j].act === this.pumps[i].pump && pids[j].meas.meas_type === 1){
            this.pids.push(pids[j]);
            }
        }
      }

      this.state = 1;
      this.volume = 0.0;
    }
    else if(this.state === 10){
      this.state = 1;
    }
  }

  pause(){
    if(this.state === 1){
      this.state = 10;
    }
  }
  stop(){
    if(this.state === 1 || this.state === 10){
      this.state = 2;
    }
  }

  control(dt){
    switch(this.state) {
      // init
      case 0:

        break;
      // transfer
      case 1:
        const flow_direction = this.opposite ? -1.0 : 1.0;
        this.volume+= flow_direction*this.route.flow/3.6*dt;
        for (let i = 0; i < this.valves.length; i++){
          this.valves[i].open = true;
        }
        for (let i = 0; i < this.pumps.length; i++){
          this.pumps[i].pump.on = this.pumps[i].reverse || this.pumps[i].normal;
          this.pumps[i].pump.reverse = (this.pumps[i].normal && this.opposite) || (this.pumps[i].reverse && !this.opposite);
          if(this.parameters.flow_control===0){
            this.pumps[i].pump.setpoint = this.parameters.flow_control_param;
          }
        }
        for (let i = 0; i < this.pids.length; i++){
          if(this.parameters.flow_control===1){

            this.pids[i].sp = this.parameters.flow_control_param;
            this.pids[i].on = true;
          }
          else
            this.pids[i].on = false;
        }

        // transition
        switch(this.parameters.goal_type){
          case 0:

          break;
          case 1:
            if(this.volume/1000.0 >= this.parameters.goal_param){
              this.state = 2;
            }
          break;
          case 2:
            if(this.source_obj.fill_m3 <= this.parameters.goal_param){
              this.state = 2;
            }
          break;
          case 3:
            if(this.target_obj.fill_m3 >= this.parameters.goal_param){
              this.state = 2;
            }
          break;
          default:
            this.state = 2;
        }
        break;
      // end
      case 2:
        for (let i = 0; i < this.valves.length; i++){
          this.valves[i].open = false;
        }
        for (let i = 0; i < this.pumps.length; i++){
          this.pumps[i].pump.on = false;
        }
        for (let i = 0; i < this.pids.length; i++){
            this.pids[i].on = false;
        }
      this.state = 0;
      break;
      // Pause
      case 10:
        for (let i = 0; i < this.valves.length; i++){
          this.valves[i].open = false;
        }
        for (let i = 0; i < this.pumps.length; i++){
          this.pumps[i].pump.on = false;
        }
        for (let i = 0; i < this.pids.length; i++){
            this.pids[i].on = false;
        }
        break;
      default:
        // code block
    }
}
}


class cPhaseReaction{ // Phase nr 2
  constructor(data={parameters:{reactor: {row: undefined, col:undefined}, time: 0.0, temperature_control: true, set_temperature: 21.0, pressure_control: true, set_pressure: 1.0, mixing_on: true}, in_background: false, id: 0}){
    this.id = data.id ? data.id : 0;
    this.phase_num = 2;
    this.parameters = data.parameters;
    if(!data.parameters.reactor)
        this.parameters.reactor = {row: undefined, col:undefined};
    if(!data.parameters.time)
        this.parameters.time = 0.0; // set reaction time
    if(!data.parameters.temperature_control)
        this.parameters.temperature_control = true; // on / off
    if(!data.parameters.set_temperature)
        this.parameters.set_temperature = 21.0;
    if(!data.parameters.pressure_control)
        this.parameters.pressure_control = true; // on / off
    if(!data.parameters.set_pressure)
        this.parameters.set_pressure = 21.0;
    if(!data.parameters.mixing_on)
        this.parameters.mixing_on = true; // on / off
    this.in_background = data.in_background ? data.in_background : false;
    this.state = 0; // 0 - initial, 1 - trasnfer on
    this.reactor_obj=undefined;
    this.time = 0.0;
}

  init(routes, automation){
    this.getObjects(automation);
  }
  getObjects(automation){
    this.reactor_obj=automation[this.parameters.reactor.row][this.parameters.reactor.col];
  }


  start(routes, pids, automation){
    if(this.state === 0){
      if(!automation || this.reactor_obj === undefined){
        return 0;
      }
      this.state = 1;
      this.time = 0.0;
    }
    else if(this.state === 10){
      this.state = 1;
    }
  }

  pause(){
    if(this.state === 1){
      this.state = 10;
    }
  }
  stop(){
    if(this.state === 1 || this.state === 10){
      this.state = 2;
    }
  }

  control(dt){
    switch(this.state) {
      // init
      case 0:

        break;
      // transfer
      case 1:
        this.time+= dt;
        this.reactor_obj.temperature_control = this.parameters.temperature_control;
        this.reactor_obj.set_temperature = this.parameters.set_temperature;
        this.reactor_obj.pressure_control = this.parameters.pressure_control;
        this.reactor_obj.set_pressure = this.parameters.set_pressure;
        this.reactor_obj.mixing_on = this.parameters.mixing_on;
        if(this.time >= this.parameters.time){
          this.state = 2;
        }
        break;
      // end
      case 2:
        this.reactor_obj.temperature_control = false;
        this.reactor_obj.pressure_control = false;
        this.reactor_obj.mixing_on = false;
        this.state = 0;
        break;
      // Pause
      case 10:
        this.reactor_obj.temperature_control = false;
        this.reactor_obj.pressure_control = false;
        this.reactor_obj.mixing_on = false;
        break;
      default:
        // code block
    }
}
}


class cRecipe{ // Phase nr 1
  constructor(data={id: 0, title: "recipeXX", step: 0, state: 0, phases: []}){
    this.id = data.id;
    this.title= data.title;
    this.step=data.step;
    this.state=data.state;
    this.phases=data.phases;
}

start(){
  if(this.state === 0){
    this.state = (this.phases.length > 0) ? 1 : 0;
    this.step = 0;
  }
  else if(this.state === 10){
    this.state = 1;
  }
}

pause(){
  if(this.state === 1){
    this.state = 10;
  }
}
stop(){
  if(this.state === 1 || this.state === 10){
    this.state = 2;
  }
}

  control(dt, routes, pids, automation){
    const active_phase = this.phases[this.step]
    switch(this.state) {
      // init
      case 0:

        break;
      // working
      case 1:
        // run phase[step]
        switch(active_phase.state){
          case 0:
          case 10:
            active_phase.start(routes, pids, automation);
            break;
          case 2:
            if(this.step < this.phases.length - 1){
              this.step += 1;
            }
            else{
              this.state = 2;
            }
          break;
          default:
            ;
        }
        ;

      break;
      // ending
      case 2:
      // stop everything
      active_phase.stop();
      this.state = 0;
      this.step = 0;
      break;
      // Pause
      case 10:
      // pause current phases
        active_phase.pause();
      break;
      default:
        this.state = 0;
    }
    return this.state !== 0 ? active_phase : undefined;
  }
}


function getNewAutomation(data){
  const auto_type = data ? data.auto_type : 0;
  switch(auto_type){
    case 1: // valve
      return new cValve(data);
    case 2: // tank
      return new cTank(data);
    case 3: // pipe
      return new cPipe(data);
    case 4: // pump
      return new cPump(data);
    case 5: // source
      return new cSource(data);
    case 6: // target
      return new cTarget(data);
    case 7: // heat exchanger
      break;
    case 8: // reactor
      return new cReactor(data);
    default:
      return new cAutomation();
        ;
  }
}


export {
  cAutomation, cValve, cPipe, cTank, cPump, cRoute, cMeasurement, cPID,
  cPhaseTransfer, cPhaseReaction, cRecipe, getNewAutomation, cSource, cTarget, cReactor
}
