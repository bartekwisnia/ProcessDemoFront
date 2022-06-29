function FieldWithBar(props) {
  return(
  <div className="level">
    <div className="level-left" >
      {!props.hide_input ? <p className="control has-icons-right">
        <input className="input level-item" style={{width: 80}} type="input" value={props.value}
          onChange={(e) => {
            if(props.updateObject)
              props.updateObject(e.target.value);
            }}/>
        <span className="icon is-small is-right">{props.unit}</span>
      </p> : ""}
      <p className="control is-expanded level-item">
        <input type="range"
               min={props.min} max={props.max} value={props.value} step={props.step}
              onChange={(e) => {
                if(props.updateObject)
                  props.updateObject(e.target.value)}
              }/>
      </p>
      <p className="label level-item">{props.label}</p>
    </div>
  </div>
);
}

function SmallField(props) {
  return(
  <div className="level">
    <div className="level-left" >
      {!props.hide_input ? <p className="control has-icons-right">
        <input className="input level-item" style={{width: 80}} type="input" value={props.value}
          onChange={(e) => {props.updateObject(e.target.value)}} readOnly={props.readonly}/>
        <span className="icon is-small is-right">{props.unit}</span>
      </p> : ""}
      <p className="label level-item">{props.label}</p>
    </div>
  </div>
);
}

export {  FieldWithBar, SmallField}
