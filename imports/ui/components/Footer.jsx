import React from 'react';
import {
    Navbar,
    Nav,
    NavItem } from 'reactstrap';

import { NavLink } from 'react-router-dom';
import moment from 'moment';
import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();

export default class Footer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Navbar light expand="md" fixed="bottom" id="footer" className="d-md-flex footer-color">
                    <span className="text-muted">All rights reserved &copy;{moment().format('YYYY')}</span>
                    <Nav className="ml-auto" navbar>
                        <NavItem id="footer">
                            <NavLink to="/" className="white">Antlia Explorer</NavLink>
                        </NavItem>
                    </Nav>
                </Navbar>
                <Navbar fixed="bottom" className="d-block d-md-none mobile-menu">
                    <Nav>
                        <NavItem>
                            <NavLink className={window.location.pathname.split('/')[1]===""?'is-active':null} to="/"><i className="fa fa-fw fa-home" /></NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className={window.location.pathname.split('/')[1]==="validator" || window.location.pathname.split('/')[1]==="validators" || window.location.pathname.split('/')[1]==="account"?'is-active':null} to="/validators"><i className="fa fa-fw fa-spinner" /></NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className={window.location.pathname.split('/')[1]==="blocks"?'is-active':null} to="/blocks"><i className="fa fa-fw fa-cube" /></NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className={window.location.pathname.split('/')[1]==="transactions"?'is-active':null} to="/transactions"><i className="fa fa-fw fa-random" /></NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className={window.location.pathname.split('/')[1]==="proposals"?'is-active':null} to="/proposals"><i className="fa fa-fw fa-edit" /></NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className={window.location.pathname.split('/')[1]==="voting-power-distribution"?'is-active':null} to="/voting-power-distribution"><i className="fa fa-fw fa-chart-bar" /></NavLink>
                        </NavItem>
                    </Nav>
                </Navbar>
            </div>  
        );
    }
}