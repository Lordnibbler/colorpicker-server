import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DocumentMeta from 'react-document-meta';
import { isLoaded as isInfoLoaded, load as loadInfo } from 'redux/modules/info';
import { isLoaded as isAuthLoaded, load as loadAuth, logout } from 'redux/modules/auth';
import { pushState } from 'redux-router';
import config from '../../config';

@connect(
  state => ({user: state.auth.user}),
  {logout, pushState})

export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.object,
    logout: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  componentWillReceiveProps(nextProps) {
    if (!this.props.user && nextProps.user) {
      // login
      this.props.pushState(null, '/loginSuccess');
    } else if (this.props.user && !nextProps.user) {
      // logout
      this.props.pushState(null, '/');
    }
  }

  static fetchData(getState, dispatch) {
    const promises = [];
    if (!isInfoLoaded(getState())) {
      promises.push(dispatch(loadInfo()));
    }
    if (!isAuthLoaded(getState())) {
      promises.push(dispatch(loadAuth()));
    }
    return Promise.all(promises);
  }

  handleLogout(event) {
    event.preventDefault();
    this.props.logout();
  }

  render() {
    const styles = require('./App.scss');
    return (
      <div className={styles.app}>
        <DocumentMeta {...config.app}/>

        <div id="appframe">
          <div id="drawer">
            <div className="container">
              <ul id="saved-colors"></ul>
            </div>
          </div>

          <div id="header">
            <div className="container">

              <div className="logo">
              </div>

              <div className="panel">
                <h2>Options</h2>
              </div>

              <div className="panel">
                <h2>How to</h2>

                <ul id="instructions">
                  <li>
                    <i className="fa fa-arrows-h fa-2x"></i>
                    <p>
                      Back &amp; Forth for Hue
                    </p>
                  </li>

                  <li>
                    <i className="fa fa-arrows-v fa-2x"></i>
                    <p>
                      Up &amp; Down for Lightness
                    </p>
                  </li>

                  <li>
                    <i className="fa fa-sort fa-2x"></i>
                    <p>
                      Scroll for Saturation
                    </p>
                  </li>
                </ul>
              </div>

            </div>

            <button id="saved-colors-tab" className="btn tab"><i className="fa fa-align-justify fa-lg"></i></button>
            <button id="save-color" className="btn tab"><i className="fa fa-save          fa-lg"></i></button>
            <button id="huecomplement" className="btn tab"><i className="fa fa-exchange      fa-lg"></i></button>
            <button id="gradient" className="btn tab"><i className="fa fa-signal        fa-lg"></i></button>
            <button id="white" className="btn tab"><i className="fa fa-lightbulb-o   fa-lg"></i></button>
            <button id="clear" className="btn tab"><i className="fa fa-ban           fa-lg"></i></button>
            <button id="header-tab" className="btn tab"><i className="fa fa-cog           fa-lg"></i></button>
          </div>

          <div id="swatches">
            <ul id="colors">
              <li id="edit" className="swatch animating">
                <div className="info">
                  <h2></h2>
                  <small>Click to save</small>
                </div>
                <div id="constraints"><div></div></div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
