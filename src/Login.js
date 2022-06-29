import React from 'react';
import Cookies from 'universal-cookie';
import './App.css';
import {global_url} from './Utils'

function logout(afterLogout) {
  return new Promise((resolve, reject) => {
    let response = {};
    fetch(global_url+'dj-rest-auth/logout/', {
      method: 'POST',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body:  ''
    }).then(resp => {
      response = resp;
      return resp.json();
    }).then(data => {
      console.log("reaction to logout");
      console.log(response);
      console.log(data);
      if(response.status === 200){
        const cookies = new Cookies();
        cookies.set('username', undefined, { path: '/' });
        cookies.set('token', undefined, { path: '/' });
        resolve();
      }
    }).catch(error => {
      console.log('error ->', error);
      reject();}
      );
  });
}


class LoginClass extends React.Component{
  constructor(props) {
    super(props);
    this.state = {resp: '', data: '', username: '', password: '', response_text: ''   };
  }

  changeData(data, resp, username){
    if(resp.status === 200){
      const cookies = new Cookies();

      cookies.set('username', username, { path: '/' });
      cookies.set('token', data.key, { path: '/' });
      this.props.setLogin(username, data.key);
      this.props.onClickClose();
    }
    else {
      this.props.setLogin(0, '');
    }
    this.setState({data: data});
  }

  onSubmit(e) {
    const{username, password} = this.state;
    let response = {};
     e.preventDefault();
    return fetch(global_url+'dj-rest-auth/login/', {
      method: 'POST',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body:  JSON.stringify({username, password})
    }).then(resp => {
      response = resp;
      this.setState({resp: resp});
      return resp.json();
    }).then(data => {this.changeData(data, response, username)}).catch(error => console.log('error ->', error));
  }


render(){
    const{username, password, data} = this.state;
  return (

      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Login</p>
          <button className="delete" aria-label="close" onClick={this.props.onClickClose}></button>
        </header>
        <form onSubmit={(e) => this.onSubmit(e)}>
        <section className="modal-card-body">

          <div className="field">
              <div className="control">
                <input className="input is-large"
                  onChange={(e) => this.setState({username: e.target.value})}
                  value={username}
                  type={'input'}
                  name={'username'}/>
              </div>
          </div>
          <div className="field">
              <div className="control">
                <input className="input is-large"
                  onChange={(e) => this.setState({password: e.target.value})}
                  value={password}
                  type={'password'}
                  name={'password'}/>
              </div>
          </div>
          {data ? <p className="help is-danger">{data.non_field_errors}</p> : ""}
        </section>
        <footer className="modal-card-foot">
          <input className="button is-block is-primary" type="submit" value="LOGIN"/>
        </footer>
            </form>
      </div>
  );
}
}


class SignUpClass extends React.Component{
  constructor(props) {
    super(props);
    this.state = {resp: '', data: '', username: '', password1: '', password2: '', email: '', response_text: ''   };
  }

  changeData(data, resp, username){
    console.log(data);
    if(resp.status >= 200 && resp.status < 300){
      const cookies = new Cookies();
      cookies.set('username', username, { path: '/' });
      cookies.set('token', data.key, { path: '/' });
      this.props.setLogin(username, data.key);
      this.props.onClickClose();
    }
    this.setState({data: data});
  }

  onSubmit(e) {
    const{username, password1, password2, email} = this.state;
    let response = {};
     e.preventDefault();
    return fetch(global_url+'autoregister/', {
      method: 'POST',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body:  JSON.stringify({username, password1, password2, email})
    }).then(resp => {
      console.log(resp);
      response = resp;
      this.setState({resp: resp});
      return resp.json();
    }).then(data => {this.changeData(data, response, username)}).catch(error => console.log('error ->', error));
  }

render(){
    const{username, password1, password2, email, resp, data} = this.state;
  return (




      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Registration</p>
          <button className="delete" aria-label="close" onClick={this.props.onClickClose}></button>
        </header>
        <form onSubmit={(e) => this.onSubmit(e)}>
        <section className="modal-card-body">

          <div className="field">
              <div className="control">
                <input className="input is-large"
                  onChange={(e) => this.setState({username: e.target.value})}
                  value={username}
                  type={'input'}
                  name={'username'}
                  placeholder="User name"/>
              </div>
              {data ? data.username ? data.username.map((el, idx) => (<p key={idx} className="help is-danger">{el}</p>)) : "" : ""}
          </div>
          <div className="field">
              <div className="control">
                <input className="input is-large"
                  onChange={(e) => this.setState({password1: e.target.value})}
                  value={password1}
                  type={'password'}
                  name={'password1'}
                  placeholder="password"/>
              </div>
              {data ? data.password1 ? data.password1.map((el, idx) => (<p key={idx} className="help is-danger">{el}</p>)) : "" : ""}
          </div>
          <div className="field">
              <div className="control">
                <input className="input is-large"
                  onChange={(e) => this.setState({password2: e.target.value})}
                  value={password2}
                  type={'password'}
                  name={'password2'}
                  placeholder="repeat pass"/>
              </div>
              {data ? data.password2 ? data.password2.map((el, idx) => (<p className="help is-danger">{el}</p>)) : "" : ""}
          </div>
          <div className="field">
              <div className="control">
                <input className="input is-large"
                  onChange={(e) => this.setState({email: e.target.value})}
                  value={email}
                  type={'email'}
                  name={'email'}
                  placeholder="e-mail"/>
              </div>
              {data ? data.email ? data.email.map((el, idx) => (<p className="help is-danger">{el}</p>)) : "" : ""}
          </div>
        {data ? data.non_field_errors ? data.non_field_errors.map((el, idx) => (<p className="help is-danger">{el}</p>)) : "" : ""}
        {resp !== '' ? (!(resp.status >= 200 && resp.status < 300) ? <p className="help is-danger">Registration failed</p> : "") : ""}
        </section>
        <footer className="modal-card-foot">
          <input className="button is-block is-primary" type="submit" value="Sign Up"/>
        </footer>
            </form>
      </div>
  );
}
}

export {
  LoginClass, SignUpClass, logout
}
