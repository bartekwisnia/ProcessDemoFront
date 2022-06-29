import React from "react";
import {ImgDjango, ImgRest, ImgReact, ImgCloud, ImgJS,
  ImgPython, ImgPostgresql, ImgReactRouter} from './static'

function Manual(props){
return(
<>

<section className="section">
  <div className="columns">
  <div className="column is-10 is-offset-1">
  <div className="tile is-ancestor">
    <div className="tile is-vertical">
      <div className="tile is-parent">
        <article className="tile is-child notification is-primary">
          <div className="media">
            <div className="media-left">
              <figure className="image is-96x96">
                <img src={ImgCloud} alt="Cloud"/>
              </figure>
            </div>
            <div className="media-content">
              <p className="title is-4">Cloud</p>
              <p className="subtitle is-6">Google</p>
            </div>
          </div>
          <p className="subtitle">The application is made of 2 seperate services: backend based on python django and frontend using React JS library. Both of them are running in google cloud environment.</p>
          <div className="content">
          </div>

        </article>
      </div>
      <div className="tile">
        <div className="tile is-parent">
          <div className="tile is-child notification is-success">
            <p className="title">Backend</p>
            <p className="subtitle">As mentioned backend is a python application, django framework with rest API</p>
              <div className="tile is-parent is-vertical">
                <article className="tile is-child notification is-primary">
                  <div className="media">
                    <div className="media-left">
                      <figure className="image is-96x96">
                        <img src={ImgPython} alt="Python"/>
                      </figure>
                    </div>
                    <div className="media-content">
                      <p className="title is-4">Python</p>
                      <p className="subtitle is-6">3.10.5</p>
                    </div>
                  </div>
                  <div className="content has-text-right">
                    <p className="subtitle">Backend coded in ~[sssssssssssss]</p>
                  </div>
                </article>
                <article className="tile is-child notification is-link">
                  <div className="media">
                    <div className="media-left">
                      <figure className="image is-96x96">
                        <img src={ImgDjango} alt="Django"/>
                      </figure>
                    </div>
                    <div className="media-content">
                      <p className="title is-4">Django</p>
                      <p className="subtitle is-6">4.0.5</p>
                    </div>
                  </div>
                </article>
                <article className="tile is-child notification is-white">
                  <div className="media">
                    <div className="media-left">
                      <figure className="image is-96x96">
                        <img src={ImgRest} alt="REST"/>
                      </figure>
                    </div>
                    <div className="media-content">
                      <p className="title is-4">Django REST framework</p>
                      <p className="subtitle is-6">3.13.1</p>
                    </div>
                  </div>
                  <div className="content has-text-right">
                    <p className="subtitle">Backend is serving requests with using django rest framework</p>
                  </div>
                </article>
                <article className="tile is-child notification is-info">
                  <div className="media">
                    <div className="media-left">
                      <figure className="image is-96x96">
                        <img src={ImgPostgresql} alt="DB"/>
                      </figure>
                    </div>
                    <div className="media-content">
                      <p className="title is-4">PostgreSql</p>
                      <p className="subtitle is-6">database</p>
                    </div>
                  </div>
                </article>
              </div>
          </div>
        </div>
        <div className="tile is-parent">
          <div className="tile is-child notification is-info">
            <p className="title">Frontend</p>
            <p className="subtitle">Javascript/React/Html/CSS etc.</p>
              <div className="tile is-parent is-vertical">
                <article className="tile is-child notification is-white">
                  <div className="media">
                    <div className="media-left">
                      <figure className="image is-96x96">
                        <img src={ImgJS} alt="JS"/>
                      </figure>
                    </div>
                  </div>
                  <div className="content has-text-right">
                    <p className="subtitle">Programming language: Javascript!</p>
                  </div>
                </article>
                <article className="tile is-child notification is-primary">
                  <div className="media">
                    <div className="media-left">
                      <figure className="image is-96x96">
                        <img src={ImgReact} alt="React"/>
                      </figure>
                    </div>
                    <div className="media-content">
                      <p className="title is-4">React</p>
                      <p className="subtitle is-6">18.1.0</p>
                    </div>
                  </div>
                  <div className="content has-text-right">
                    <p className="subtitle">react application compiled with webpack</p>
                  </div>
                </article>

                <article className="tile is-child notification is-dark">
                  <div className="media">
                    <div className="media-left">
                      <figure className="image is-96x96">
                        <img src={ImgReactRouter} alt="Router"/>
                      </figure>
                    </div>
                    <div className="media-content">
                      <p className="title is-4">React-router</p>
                      <p className="subtitle is-6">6.3.0</p>
                    </div>
                  </div>
                  <div className="content has-text-right">
                    <p className="subtitle">to control urls I use react-router package</p>
                  </div>
                </article>
              </div>
          </div>
        </div>
      </div>
      <div className="tile is-parent">
        <article className="tile is-child notification">
          <p className="title">Background</p>
          <p className="subtitle">All simulations and process objects behaviour is
          based on my own ideas, calculations and project experience. It does
          not correspond ideally to physics but should react quite reasonable to what you design</p>
          <div className="content">
          </div>
        </article>
      </div>
    </div>

  </div>
  </div>
  </div>

</section>
</>
);
}

export default Manual;
