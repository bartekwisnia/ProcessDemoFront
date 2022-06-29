import React  from "react";
import {ImgProfile34, ImgProfile32, ImgLogo11} from './static'

function About(props){
return(
  <>
<section className="section">
<div className="columns">
<div className="column is-4 is-offset-4">
<div className="card">
  <header className="card-header">
    <p className="card-header-title">
      Hi! Nice to meet you!
    </p>
  </header>

  <div className="card-image">
    <div className="columns">
      <div className="column is-12 is-offset-0">
        <figure className="image is-3by2">
          <img src={ImgProfile32} alt="My profile"/>
        </figure>
      </div>
    </div>
  </div>
  <div className="card-content">
    <div className="media">
      <div className="media-left">
        <figure className="image is-48x48">
          <img src={ImgLogo11} alt="It's me! Sorry you can't see it"/>
        </figure>
      </div>
      <div className="media-content">
        <p className="title is-4">Bartosz Wiśniewski</p>
        <p className="subtitle is-6">https://github.com/bartekwisnia</p>
      </div>
    </div>

    <div className="content">
      <p>
        Hi! Welcome on my page. Here I wanted to write just some words about me.
        I am a graduate of Warsaw University of Technology / Mechatronics faculty,
        specialized in process automation.
        I have been working for last 12 years as a programmist of various control
        systems, from small machines to complex chemical plants.
        On my work I am programming PLCs, advanced automation systems as well as
        server/client applications for industry. I have a lot of
        experience not only with programming automated processes themself but
        also with data processing, system integration and making dedicated
        solutions for industry like communication with external systems,
        recipe/batch control, database connection, higher level data processing
        for process engineers or technologists etc.
        For some time I have been learning and having fun with web
        applications based on python (django) and javascript (react). One of my
        webdev projects is the very page you are visiting right now.</p>
        <p>
        Privately I am a happy father of 1.6 children (the second is loaded in 60%) and a
        husband of the most awesome, beautifull and supporting wife. In a free time I am a sailor (some may call me a captain), snowboarder, guitar player and former footballist (twisted ankle :( ))</p>
        <p>Welcome on my home page and have fun with simulating some processes!<br/>Bartek
      </p>
    </div>
  </div>
</div>
</div>
</div>
</section>
</>
);
}


class Contact extends React.Component{

  constructor(props){
    super(props);
    this.state = {
    };
  }

  render(){
    // console.log("render Blogs site");

      const logo = <figure className="image is-96x96">
                          <img src={ImgLogo11} alt="CODIND LOGO"/>
                        </figure>

      const address = <article className="message is-primary">
                        <div className="message-header">
                          <p>Address</p>
                        </div>
                        <div className="message-body has-text-centered">
                          al. Rzeczypospolitej 24B/3
                          <br/>
                          02-972 Warszawa
                        </div>
                      </article>

      const phone = <article className="message is-primary">
                        <div className="message-header">
                          <p>Mobile</p>
                        </div>
                        <div className="message-body has-text-centered">
                          +48 604 521 186
                        </div>
                      </article>

      const email = <article className="message is-primary">
                        <div className="message-header">
                          <p>e-mail</p>
                        </div>
                        <div className="message-body has-text-centered">
                          wisniewski.codind@gmail.com
                        </div>
                      </article>

      return  <React.Fragment>
      <section className={"hero hero-bg-img is-primary"}>
        <div className="hero-body">
          <div className="container">
            <div className="level">
              <div className="level-left">
              <div className="level-item">
                {logo}
              </div>
              <div className="level-item">
                <p className="title is-4">CODIND.Coding for Industry</p>
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>
      <section className="section columns" style={{paddingTop: 20}}>
      <div className="column is-8 is-offset-2">
        <div className="tile is-ancestor ">
          <div className="tile is-vertical">
            <div className="tile is-parent">
              <div className="tile is-child">
                {address}
              </div>
            </div>
            <div className="tile is-parent">
              <div className="tile is-child">
                {phone}
              </div>
            </div>
            <div className="tile is-parent">
              <div className="tile is-child">
                {email}
              </div>
            </div>
          </div>
          <div className="tile">
            <div className="tile is-parent">
              <div className="tile is-child">
                <ContactSmallAbout />
              </div>
            </div>
          </div>
      </div>
    </div>
  </section>
  </React.Fragment>
  }
}



class ContactSmallAbout extends React.Component{

  constructor(props){
    super(props);
    this.state = {
    };
  }

  render(){
      return  <React.Fragment>
                      <div className="columns" style={{marginBottom: "0.5rem"}}>
                        <div className="column is-4 is-offset-4">
                          <figure className="image is-3by4">
                              <img className="is-rounded" src={ImgProfile34} alt="Moja fotografia"/>
                          </figure>
                        </div>
                      </div>
                      <div className="level" style={{paddingTop: "0.5rem", marginBottom: "0.5rem"}}>
                        <div className="level-item">
                          <h1 className="title is-4">Bartosz Wiśniewski</h1>

                        </div>
                      </div>
                      <div className="level" style={{paddingTop: "0.0rem"}}>
                        <div className="level-item">
                          <h2 className="subtitle is-6">"the programmer"</h2>
                        </div>
                      </div>
                      <div className="content" style={{paddingLeft: "0.5rem", paddingRight: "0.5rem"}}>
                          <p>
                          Programming since 2007. A lot of experience with DCS class systems, PLC programming, client/server applications, IIOT and generally speaking data processing and system integration.
                          Professionally using C++, VBS and dedicated languages for automation. Afterwork learning and having fun with python, django, javascript, react, result of which can be seen here.</p>
                          <p>Since 2020 I am self-employed, registered as CODIND => Coding for Industry.</p>
                          <p>Welcome on my home page!<br/>Bartek
                          </p>
                      </div>
                    </React.Fragment>
  }
}




export default Contact;

export {
  About
}
