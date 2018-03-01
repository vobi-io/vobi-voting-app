import React from 'react';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import {Link} from "react-router-dom";
import {logOut, retrieveSession} from "./service/Service";
import Poll from 'material-ui/svg-icons/social/poll';
import Person from 'material-ui/svg-icons/social/person';
import CreateNewFolder from 'material-ui/svg-icons/file/create-new-folder';
import CheckCircleIcon from 'material-ui/svg-icons/action/check-circle';

const styles={
    logoIcon:{height:'48px',width:'48px',color:'rgb(0, 188, 212)'},
    appName:{color:'rgb(0, 188, 212)'}
};
export class AppToolbar extends React.Component {

    constructor(props) {
        super();
        this.state = {
            user: props.user,
            pageTitle: props.pageTitle
        };
    }
    componentWillReceiveProps(props){
        this.setState({user:props.user});
        this.setState({pageTitle:props.pageTitle})
    }
    logOut() {
        logOut().then(res => {
            this.props.history.goBack();
        });
    }

    render() {
        let actionButtons = "";
        let toolbarTitle = "";
        if (this.state.user && this.state.user.userName) {
            toolbarTitle = this.state.user.firstName + " " + this.state.user.lastName;
            actionButtons =
                <div>
                    <Link to='/'><RaisedButton icon={<Poll/>} label="Votes" style={{margin: '10px'}}
                                               primary={true}/></Link>
                    <Link to={'/new'}><RaisedButton icon={<CreateNewFolder/>} label="Create Vote"
                                                    style={{margin: '10px'}} primary={true}/></Link>

                </div>;
        } else {
            toolbarTitle = "";
            actionButtons =
                <div>
                    <Link to="/"><RaisedButton icon={<Poll/>} label="All Votes" style={{margin: '10px'}}
                                               primary={true}/></Link>
                    <Link to='/auth'><RaisedButton icon={<Person/>} label="Auth" style={{margin: '10px'}}
                                                   primary={true}/></Link>
                </div>;
        }
        return (
            <Toolbar style={{'paddingRight': '0px'}}>
                <ToolbarGroup firstChild={true}>
                    <CheckCircleIcon style={styles.logoIcon}/> <h1 style={styles.appName} >Voting App | {this.state.pageTitle}</h1>
                </ToolbarGroup>
                <ToolbarGroup>
                    {actionButtons}
                    <ToolbarTitle text={toolbarTitle}/>

                    {(toolbarTitle) ?
                        <span>
                        <IconMenu iconButtonElement={
                            <IconButton touch={true}>
                                <NavigationExpandMoreIcon/>
                            </IconButton>
                        }>
                            <Link to={'/my/'+this.state.user.userName}><MenuItem  primaryText="My Votes"/></Link>
                            <MenuItem onClick={() => this.logOut()} primaryText="Log Out"/>
                        </IconMenu> </span>: null }


                </ToolbarGroup>
            </Toolbar>
        );
    }
}