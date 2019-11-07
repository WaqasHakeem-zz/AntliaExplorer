import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Nav, NavLink, Card } from 'reactstrap';
import List from './ListContainer.js';
import ChainStates from '../components/ChainStatesContainer.js'
import { Helmet } from 'react-helmet';
import i18n from 'meteor/universe:i18n';
import qs from 'querystring';
import SideNav, { NavItem, NavIcon, NavText} from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

const T = i18n.createComponent();

const PriorityEnum = {
    'moniker': {code: 0, dirKey: 'monikerDir', name: 'moniker'},
    'votingPower': {code: 1, dirKey: 'votingPowerDir', name: 'votingPower'},
    'uptime': {code: 2, dirKey: 'uptimeDir', name: 'uptime'},
    'commission': {code: 3, dirKey: 'commissionDir', name: 'commission'},
    'selfDel': {code: 4, dirKey: 'selfDelDir', name: 'selfDel'},
    'status': {code: 5, dirKey: 'statusDir', name: 'status'},
    'jailed': {code: 6, dirKey: 'jailedDir', name: 'jailed'}
}

const renderToggleIcon = (order) =>
    <i className="material-icons marginleft"> {(order == 1)?'arrow_drop_up':'arrow_drop_down'}</i>;

export default class Validators extends Component{
    constructor(props){
        super(props);
        let state = {
            monikerDir: 1,
            votingPowerDir: -1,
            uptimeDir: -1,
            commissionDir: 1,
            selfDelDir: 1,
            statusDir: 1,
            jailedDir: 1,
            priority: PriorityEnum.moniker.code
        }
        if (props.location.search) {
            let queryParams = qs.parse(props.location.search.substring(1));
            let sortField = queryParams.sort;
            if (sortField && PriorityEnum[sortField]) {
                state.priority = PriorityEnum[sortField].code;
                if (queryParams.dir && Number(queryParams.dir)) {
                    state[PriorityEnum[sortField].dirKey] = Number(queryParams.dir) > 0?1:-1;
                }
            }
        }
        this.state = state;
    };
    state = {
        selected: 'validators',
        expanded: false
    };

    toggleDir(field, e){
        e.preventDefault();
        if (!PriorityEnum[field])
            return;

        let dirKey = PriorityEnum[field].dirKey;
        let newDir = this.state[dirKey] * -1;
        this.setState({
            [dirKey]: newDir,
            priority: PriorityEnum[field].code
        });
        this.props.history.replace({
            search: qs.stringify({
                sort: field,
                dir: newDir
            })
        });
    };

    onSelect = (selected) => {
        this.setState({ selected: selected });
    };

    onToggle = (expanded) => {
        this.setState({ expanded: expanded });
    };

    render() {
        const { expanded, selected } = this.state;
        let title = <T>validators.active</T>;
        let desc = <T>validators.listOfActive</T>;
        if (this.props.inactive){
            title = <T>validators.inactive</T>;
            desc = <T>validators.listOfInactive</T>;
        }

        return (
        <div>
            <div id="validator-list" style={{
                        marginLeft: expanded ? 200 : 64,
                        padding: '15px 20px 0 20px'
                    }}>
            <Helmet>
                <title>Validators on Color Explorer | Color</title>
                <meta name="description" content="Here is a list of Color Validators" />
            </Helmet>
            <Row>
                <Col lg={12} xs={12}><h1 className="d-none d-lg-block">{title}</h1></Col>
                {/* <Col lg={9} xs={12} className="text-lg-right"><ChainStates /></Col> */}
            </Row>
            <Nav pills className="status-switch">
                <NavItem>
                    <NavLink tag={Link} to="/validators" active={(this.props.match.url == "/validators")}><T>validators.navActive</T></NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={Link} to="/validators/inactive"
                        active={(this.props.match.url.indexOf("inactive")>0)}>
                        <T>validators.navInactive</T>
                    </NavLink>
                </NavItem>
            </Nav>
            <p className="lead">{desc}</p>
            <Row className="validator-list">
                <Col md={12}>
                    <Card body>
                        <Row className="header text-nowrap">
                            <Col className="d-none d-md-block counter" md={1}>&nbsp;</Col>
                            <Col className="moniker" md={2} onClick={(e) => this.toggleDir('moniker',e)}><i className="material-icons">perm_contact_calendar</i> <span className="d-inline-block d-md-none d-lg-inline-block"><T>validators.moniker</T></span> {renderToggleIcon(this.state.monikerDir)} </Col>
                            <Col className="voting-power" md={3} lg={2} onClick={(e) => this.toggleDir('votingPower',e)}><i className="material-icons">power</i> <span className="d-inline-block d-md-none d-lg-inline-block"><T>common.votingPower</T></span> {renderToggleIcon(this.state.votingPowerDir)} </Col>
                            <Col className="self-delegation" md={2} onClick={(e) => this.toggleDir('selfDel',e)}><i className="material-icons">equalizer</i> <span className="d-md-none d-lg-inline-block"><T>validators.selfPercentage</T></span> {renderToggleIcon(this.state.selfDelDir==1)} </Col>
                            {(!this.props.inactive)?<Col className="commission" md={1} lg={2} onClick={(e) => this.toggleDir('commission',e)}><i className="material-icons">call_split</i> <span className="d-inline-block d-md-none d-lg-inline-block"><T>validators.commission</T></span> {renderToggleIcon(this.state.commissionDir==1)}</Col>:''}
                            {(!this.props.inactive)?<Col className="uptime" md={2} lg={3} onClick={(e) => this.toggleDir('uptime',e)}><i className="material-icons">flash_on</i> <span className="d-inline-block d-md-none d-lg-inline-block"><T>validators.uptime</T> ({Meteor.settings.public.uptimeWindow} <i className="fas fa-cube"></i>)</span> {renderToggleIcon(this.state.uptimeDir==1)}</Col>:''}
                            {(this.props.inactive)?<Col className="last-seen" md={2}><i className="far fa-clock"></i> <span className="d-md-none d-lg-inline-block"><T>validators.lastSeen</T> (UTC)</span></Col>:''}
                            {(this.props.inactive)?<Col className="bond-status d-none d-md-block" md={1} onClick={(e) => this.toggleDir('status',e)}><i className="material-icons">toggle_on</i> <span className="d-md-none d-lg-inline-block"><T>validators.status</T></span> {renderToggleIcon(this.state.statusDir)} </Col>:''}
                            {(this.props.inactive)?<Col className="jail-status d-none d-md-block" md={1} onClick={(e) => this.toggleDir('jailed',e)}><i className="material-icons">lock</i> <span className="d-md-none d-lg-inline-block"><T>validators.jailed</T></span> {renderToggleIcon(this.state.jailedDir)} </Col>:''}
                        </Row>
                    </Card>
                    {(this.props.inactive)?<List
                        inactive={this.props.inactive}
                        monikerDir={this.state.monikerDir}
                        votingPowerDir={this.state.votingPowerDir}
                        uptimeDir={this.state.uptimeDir}
                        commissionDir={this.state.commissionDir}
                        selfDelDir={this.state.selfDelDir}
                        statusDir={this.state.statusDir}
                        jailedDir={this.state.jailedDir}
                        priority={this.state.priority}
                        status={this.props.status}
                    />:<List
                        monikerDir={this.state.monikerDir}
                        votingPowerDir={this.state.votingPowerDir}
                        uptimeDir={this.state.uptimeDir}
                        commissionDir={this.state.commissionDir}
                        selfDelDir={this.state.selfDelDir}
                        priority={this.state.priority}
                    />}
                </Col>
            </Row>
        </div>
            <SideNav className="sidenav position-fixed" onSelect={this.onSelect} onToggle={this.onToggle}>
                <SideNav.Toggle />
                <SideNav.Nav selected={selected} defaultSelected="validators">
                    <NavItem eventKey="dashboard" onClick={ e => this.props.history.push("/") } title="Dashboard">
                        <NavIcon>
                            <i className="fa fa-fw fa-home" />
                        </NavIcon>
                        <NavText>
                            Dashboard
                        </NavText>
                        
                    </NavItem>
                    <NavItem eventKey="validators" onClick={ e => this.props.history.push("/validators") } title="Validators">
                        <NavIcon>
                            <i className="fa fa-fw fa-spinner" />
                        </NavIcon>
                        <NavText>
                            Validators
                        </NavText>
                        
                    </NavItem>
                    <NavItem eventKey="blocks" onClick={ e => this.props.history.push("/blocks") } title="Blocks">
                        <NavIcon>
                            <i className="fa fa-fw fa-cube" />
                        </NavIcon>
                        <NavText>
                            Blocks
                        </NavText>
                        
                    </NavItem>
                    <NavItem eventKey="transactions" onClick={ e => this.props.history.push("/transactions") } title="Transactions">
                        <NavIcon>
                            <i className="fa fa-fw fa-random" />
                        </NavIcon>
                        <NavText>
                            Transactions
                        </NavText>
                        
                    </NavItem>
                    <NavItem eventKey="proposals" onClick={ e => this.props.history.push("/proposals") } title="Proposals">
                        <NavIcon>
                            <i className="fa fa-fw fa-edit" />
                        </NavIcon>
                        <NavText>
                            Proposals
                        </NavText>
                        
                    </NavItem>
                    <NavItem eventKey="voting-power-distribution" onClick={ e => this.props.history.push("/voting-power-distribution") } title="Voting Power">
                        <NavIcon>
                            <i className="fa fa-fw fa-chart-bar" />
                        </NavIcon>
                        <NavText>
                            Voting Power
                        </NavText>
                    </NavItem>
                </SideNav.Nav>
            </SideNav>
            </div>
        )
    }

}
