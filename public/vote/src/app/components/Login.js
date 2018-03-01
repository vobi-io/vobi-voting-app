import React from 'react';
import {logIn, register, uploadFile} from "./service/Service";
import {RaisedButton, Snackbar, Tab, Tabs, TextField} from "material-ui";
import {AppToolbar} from "./AppToolbar";
import Delete from 'material-ui/svg-icons/action/delete';
import {createHashHistory} from 'history';
import {red500} from "material-ui/styles/colors";

const history = createHashHistory();
const styles = {
    textField: {'width': '100%'}
};

export class Login extends React.Component {

    constructor(params) {
        super();
        this.state = {
            user: {},
            response: ""
        };
        this.fileSelected = this.fileSelected.bind(this);
        this.clearFile = this.clearFile.bind(this);
        this.logInHandleSubmit = this.logInHandleSubmit.bind(this);
        this.registerHandleSubmit = this.registerHandleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);

    }

    logInHandleSubmit(event) {
        event.preventDefault();
        let requestData = {
            userName: this.state.logUserName,
            password: this.state.logPassword
        };
        logIn(requestData).then(res => {
            if (!res['data']['error']) {
                this.setState({
                    user: res['data']
                });
                this.props.history.push("/");
            } else {
                this.setState({
                    response: res['data']['error']
                });
            }
        });
    }

    fileSelected(e) {
        this.setState({file: e.target.files[0]});
        setTimeout(() => {
            this.uploadFile();
        }, 100)
    }

    clearFile() {
        this.refs.fileInput.input.value = null;
        this.setState({file: null});

    }

    uploadFile() {
        let data = new FormData();
        data.append('file', this.state.file);
        data.append('name', name);
        uploadFile(data).then(response => {
            if (response['data']) {
                this.setState({file: response['data']['filePath']})
            }
        });

    }

    registerHandleSubmit(event) {
        event.preventDefault();
        const requestData = {
            userName: this.state.userName,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            pid: this.state.pid,
            file: this.state.file,
            password: this.state.password

        };
        register(requestData).then(res => {
            if (res['data']['success']) {
               this.refs.tabs.setState({selectedIndex:0});
               this.setState({response:"Success"});
            } else {

                this.setState({
                    response: res['data']['error']
                });
            }
        });
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    disableRegisterButton() {
        return (!(this.state.userName && this.state.firstName && this.state.lastName && this.state.pid && this.state.password));
    }

    disableLogInButton() {
        return (!(this.state.logUserName && this.state.logPassword));
    }

    render() {

        return (
            <div>
                <AppToolbar history={history} user={this.state.user} pageTitle={'Auth'}/>
                <Tabs ref={'tabs'}>
                    <Tab label="Log In">
                        <div>
                            <form onSubmit={this.logInHandleSubmit}>
                                <TextField
                                    style={styles.textField}
                                    floatingLabelText="User Name"
                                    name="logUserName"
                                    onChange={this.handleInputChange}
                                /><br/>
                                <TextField
                                    type='password'
                                    style={styles.textField}
                                    floatingLabelText="Password"
                                    name="logPassword"
                                    onChange={this.handleInputChange}
                                /><br/>
                                <div>
                                    <RaisedButton label="Log In" disabled={this.disableLogInButton()} type="submit"
                                                  primary={true}/>
                                </div>
                            </form>
                            {this.state.logInReponse}
                        </div>
                    </Tab>
                    <Tab label="Registration">
                        <div style={styles.parent}>
                            <form onSubmit={this.registerHandleSubmit}>
                                <TextField
                                    style={styles.textField}
                                    floatingLabelText="User Name"
                                    name="userName"
                                    onChange={this.handleInputChange}
                                /><br/>
                                <TextField
                                    type='password'
                                    style={styles.textField}
                                    floatingLabelText="Password"
                                    name="password"
                                    onChange={this.handleInputChange}
                                /><br/>
                                <TextField
                                    style={styles.textField}
                                    floatingLabelText="First Name"
                                    name="firstName"
                                    onChange={this.handleInputChange}
                                /><br/>
                                <TextField
                                    style={styles.textField}
                                    floatingLabelText="Last Name"
                                    name="lastName"
                                    onChange={this.handleInputChange}
                                /><br/>
                                <TextField
                                    style={styles.textField}
                                    floatingLabelText="Personal Id"
                                    name="pid"
                                    onChange={this.handleInputChange}
                                /><br/>

                                <TextField type="file" name="fileInput" ref={'fileInput'} onChange={this.fileSelected}/>
                                {(this.state.file) ? <Delete onClick={this.clearFile} style={{
                                    color: red500,
                                    paddingTop: '20px',
                                    cursor: 'pointer'
                                }}/> : null}
                                <br/>
                                <div>
                                    <RaisedButton label="Register" disabled={this.disableRegisterButton()} type='submit'
                                                  primary={true}/>
                                </div>
                            </form>
                        </div>
                    </Tab>
                </Tabs>
                <Snackbar
                    open={!!(this.state.response)}
                    message={this.state.response || "Error"}
                    autoHideDuration={4000}
                />
            </div>
        );
    };
}