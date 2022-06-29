import { cAutomation, cValve, cPipe, cTank, cPump, cRoute, cMeasurement} from './Automation';


preConfig(){
  automation[0][0] = new cTank(25.0, 10.0, 10.0);
  automation[0][1] = new cAutomation();
  automation[0][2] = new cTank(50.0, 10.0, 10.0);
  automation[0][3] = new cTank(50.0, 10.0, 10.0);
  automation[1][0] = new cPipe(60,[true,true,true,false]);
  automation[1][1] = new cValve(false,[0,1,0,1]);
  automation[1][2] = new cPipe(60,[true,false,false,true]);
  automation[1][3] = new cPipe(60,[true,false,true,false]);
  automation[2][0] = new cPipe(60,[true,true,false,false]);
  automation[2][1] = new cPump([0,1,0,1],1);
  automation[2][2] = new cValve(false,[0,1,0,1]);
  automation[2][3] = new cPipe(60,[true,false,false,true]);
  measurements[0][0] = [new cMeasurement(3), // Temperature
                        new cMeasurement(4)];
  measurements[0][2] = [new cMeasurement(3), // Temperature
                        new cMeasurement(4)];
  measurements[0][3] = [new cMeasurement(3), // Temperature
                        new cMeasurement(4)];
  measurements[2][0] = [new cMeasurement(1)];

return{automation: automation, measurements: measurements}

}

preConfig1(){
  automation[0][0] = new cTank(25.0, 10.0, 10.0);
  automation[0][1] = new cAutomation();
  automation[0][2] = new cTank(50.0, 10.0, 10.0);

  automation[1][0] = new cPipe(0,2, 60);
  automation[1][1] = new cAutomation();
  automation[1][2] = new cPipe(0,2, 60);

  automation[2][0] = new cValve(false,0,1);
  automation[2][1] = new cPump([0,1,0,1],1);
  automation[2][2] = new cValve(false,0,3);

return{automation: automation, measurements: measurements}

}
