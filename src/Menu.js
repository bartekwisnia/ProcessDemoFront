import React from "react";
import {Link} from "react-router-dom";
import {logout} from './Login';
import {ImgLogo31} from './static'
class Menu extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        sel: 0,
              };
  }

  componentDidMount(){
    let sel = 0;
    switch(window.location.pathname){
      case '/':
        sel = 1;
        break;
      case '/technology/':
        sel = 3;
        break;
      case '/about/':
        sel = 4;
        break;
      case '/contact/':
        sel = 5;
        break;
      case '/manual/':
        sel = 6;
        break;
      default:
        ;
    }
    this.setState({sel: sel});
  }
  // ParentClass function

  render() {
    const {onClickDemo, onClickSim, onClickEdit, sim, demo, demo_step} = this.props;
    const {sel} = this.state;

    return(
      <nav className="navbar is-transparent is-spaced" role="navigation" aria-label="main navigation" style={{borderBottom: "2px solid grey"}}>
        <div className="navbar-brand">
          <div className="navbar-item">
            <Link to="/" onClick={() => {this.setState({sel: 1}); onClickEdit()}}>
              <img src={ImgLogo31} width="105" height="35" alt="Logo"/>
            </Link>
          </div>
          <div className="navbar-item">
            <Link to="/" className="button is-primary" onClick={() => {this.setState({sel: 1}); onClickEdit()}}>
              <strong>PROCESS AUTOMATION SIMULATOR 30k</strong>
            </Link>
          </div>
          <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>
          <div className="navbar-menu">

            <div className="navbar-start">
              <div className="navbar-item">
                <Link to="/" className={demo && sel===1 ? "button is-primary" : "button"} onClick={() => {this.setState({sel: 1}); onClickDemo()}}>
                  Demo
                </Link>
              </div>
              <div className="navbar-item">
                <Link to="/"><a className={demo_step === 61 ? "button is-warning" : sim && !demo && sel===1 ? "button is-primary" : "button"}  onClick={() => {this.setState({sel: 1}); onClickSim()}}>
                  Simulator</a>
                </Link>
              </div>
              <div className="navbar-item">
                <Link to="/" className={demo_step === 69 ? "button is-warning" : !sim && !demo && sel===1 ? "button is-primary" : "button"}  onClick={() => {this.setState({sel: 1}); onClickEdit()}}>
                  Editor
                </Link>
              </div>
              <div className="navbar-item">
                <Link to="/manual" className={!sim && sel===6 ? "button is-primary" : "button"}  onClick={() => {this.setState({sel: 6}); onClickEdit()}}>
                  Manual
                </Link>
              </div>
              <div className="navbar-item has-dropdown is-hoverable">
                <a className="navbar-link">
                    More
                </a>
                <div className="navbar-dropdown">
                  <div className="navbar-item">
                    <Link className={sel===3 ? "button is-primary" : "button"} to="/technology" onClick={() => this.setState({sel: 3})}>
                      Technology
                    </Link>
                  </div>
                  <div className="navbar-item">
                    <Link className={sel===4 ? "button is-primary" : "button"} to="/about" onClick={() => this.setState({sel: 4})}>
                      About me
                    </Link>
                  </div>

                  <div className="navbar-item">
                    <Link className={sel===5 ? "button is-primary" : "button"} to="/contact" onClick={() => this.setState({sel: 5})}>
                      Contact
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="navbar-end">
              <div className="navbar-item">
              {this.props.logged_user ?
                <div className="buttons">
                  <button className="button">{this.props.logged_user}</button>
                  <a className="button is-primary" onClick={() => {logout().then(() => this.props.setLogin(undefined, undefined))}}>
                    <strong>Logout</strong>
                  </a>
                </div>
                :
                <div className="buttons">
                  <a className="button is-primary" onClick={this.props.onClickSignUp}>
                    <strong>Sign up</strong>
                  </a>
                  <a className="button is-light" onClick={this.props.onClickLogin}>
                    Log in
                  </a>
                </div>
              }
              </div>
            </div>
          </div>
      </nav>

);
  }
}

export default Menu;
