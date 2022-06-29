import React from "react";
import {getData} from'./Utils';

class ProjectTree extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {plants, plant, recipes, recipe, demo_step} = this.props;
    const plants_html = plants ?   plants.map((p, index) => (
      <li key={"project"+index} className={(demo_step === 7 && index === plants.length-1) ? "has-background-warning" : ""}>
            <a>
              <span className={plant===p ? "tag is-primary" : "tag is-white"} onClick={() => this.props.getPlantData(index)}>{ p.title}{p.rows}x{p.columns}</span>
              <span className="tag icon-copy" onClick={() => getData('plantcopy/'+p.id+'/', this.props.token).then(data => getData('plants', this.props.token).then(data => this.props.updatePlants(data.results)))}></span>
              <span className="tag is-delete is-danger"  onClick={() => this.props.deletePlant(index)}>X</span>
            </a>
            {plant===p ? <ul>
              <p className="menu-label">
                Recipes:
              </p>
              {recipes.map((rec, rec_idx) => (
                <li key={rec_idx} className={(demo_step === 76 && rec_idx === recipes.length-1) ? "has-background-warning" : ""}>
                  <a>
                    <span className={recipe===rec_idx ? "tag is-primary" : "tag is-white"} onClick={() => this.props.getRecipeData(rec_idx)}>{rec.title} </span>
                    <span className="tag icon-copy" onClick={() => getData('recipecopy/'+rec.id+'/', this.props.token).then(data => getData('recipes?plant='+p.id, this.props.token).then(data => this.props.updateRecipes(data.results)))}></span>
                    <span className="tag is-delete is-danger"  onClick={() => this.props.deleteRecipe(rec_idx)}>X</span>
                  </a>
                </li>
              ))}
              <li>
                <a>
                  <span className={demo_step === 72 ? "tag is-warning icon-plus" : "tag is-white icon-plus"}
                  onClick={() => this.props.newRecipe(index)}>
                  </span>
                </a>
              </li>
            </ul> : ''}
      </li>

      ))  : "";
    return (

        <aside className="menu" style={{paddingLeft: 16}}>
          <p className="menu-label">
            Projects / Plants:
          </p>
          <ul className="menu-list">
              {plants_html}
            <li key="new">
              <a>
                <span className={demo_step === 3 ? "tag is-warning icon-plus" : "tag is-white icon-plus"}
                onClick={this.props.newPlant}>
                </span>
              </a>
            </li>
          </ul>
          </aside>);
  }
}


function ProjectTreeManual(props){

    return (
          <>
          </>
);
}

export default ProjectTree;
export {
  ProjectTreeManual
}
