import React from 'react';
import {AppToolbar} from "./AppToolbar";
import {createHashHistory} from 'history';
import {DatePicker, FloatingActionButton, MenuItem, RaisedButton, SelectField, TextField} from "material-ui";
import {addQuestion, addQuestionOption, retrieveSession} from "./service/Service";
import AddIcon from 'material-ui/svg-icons/content/add';
import {green600} from "material-ui/styles/colors";

import dateFormat from 'dateformat';

const history = createHashHistory();
export class NewVote extends React.Component {


    constructor() {
        super();
        this.state = {
            user:{},
            addResponse: "",
            options: [{
                name: ''
            }, {
                name: ''
            }],
            showReportInProcess:true
        };
        this.disableAddButton = this.disableAddButton.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.AddHandleSubmit = this.AddHandleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }
    componentWillMount() {
        retrieveSession().then(res => {
            if (!res['error']) {
                this.setState({
                    user: res['data']
                })
            }
        });
    }
    disableAddButton() {
        return !(this.state.name && this.state.startDate && this.state.endDate && this.state.options[0]['name'] && this.state.options[1]['name']);
    }

    AddHandleSubmit(e) {
        e.preventDefault();

        var requestData = {
            name: this.state.name,
            description: this.state.description,
            showReportInProcess:this.state.showReportInProcess,
            maxValues:this.state.maxValues,
            startDate: dateFormat(this.state.startDate),
            endDate: dateFormat(this.state.endDate)
        };
        console.log(requestData)
        addQuestion(requestData).then(res => {
            if (res['data']) {
               var requestData={
                   questionId:res['data']['_id'],
                   options:this.state.options
               };
               addQuestionOption(requestData).then(res=>{
                   if (res['data']['status']) {
                       this.props.history.goBack();
                   }
               });

            }
        });

    }

    handleOptionChange(event, index) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        var tmpArr = this.state.options;
        tmpArr[index]['name'] = value;
        this.setState({
            options: tmpArr
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
    handleSelectChange(event, index, value) {
        this.setState({ showReportInProcess: value });
    }

    handleStartDateChange(e, date) {
        this.setState({
            startDate: date
        });
    }

    handleEndDateChange(e, date) {
        this.setState({
            endDate: date
        });
    }

    clearInputs() {
        this.setState({
            name: null,
            description: null,
            options: [{
                name: ''
            }, {
                name: ''
            }]
        });
        var newDate;
        this.refs.name.input.value = null;
        this.refs.description.input.value = null;
        this.refs.startDate.setState({
            date: newDate
        }, () => {
            this.refs.startDate.props.onChange(null, newDate);
        });
        this.refs.endDate.setState({
            date: newDate
        }, () => {
            this.refs.endDate.props.onChange(null, newDate);
        });

        this.state.options.forEach((opt,index) => {
            this.refs['option'+index].input.value=null;
        })
    }
    addOption(){
        var tmpOptions = this.state.options;
        tmpOptions.push({name:''});
        this.setState({
            options:tmpOptions
        })
    }
    render() {
        var styles = {
            textField: {'width': '100%'},
            datePickers: {'display': 'flex'}
        };
        return (
            <div>
                <div>
                    <AppToolbar history={history} user={this.state.user}  pageTitle={'New Vote'}/>
                </div>
                <div>
                    <div style={styles.parent}>
                        <form onSubmit={this.AddHandleSubmit}>
                            <TextField
                                ref="name"
                                style={styles.textField}
                                floatingLabelText="Vote Name"
                                name="name"
                                onChange={this.handleInputChange}
                            /><br/>
                            <TextField
                                ref="description"
                                style={styles.textField}
                                floatingLabelText="Vote Description"
                                name="description"
                                onChange={this.handleInputChange}
                            /><br/>
                            {this.state.options.map((opt, index) => {
                                return (
                                    <div key={index}>
                                        <TextField
                                            ref={'option' + index}
                                            style={styles.textField}
                                            floatingLabelText={'option ' + (index + 1)}
                                            name={'option' + index}
                                            onChange={(e) => this.handleOptionChange(e, index)}
                                        /><br/>

                                    </div>
                                );
                            })}
                            <FloatingActionButton onClick={()=>this.addOption()} mini={true}>
                                <AddIcon  />
                            </FloatingActionButton>
                            <div style={{display:'flex'}}>
                                <div  style={{width:'50%'}}>
                                    <SelectField
                                        floatingLabelText="Report"
                                        name="showReportInProcess"
                                        style={{width:'100%'}}
                                        value={this.state.showReportInProcess}
                                        onChange={this.handleSelectChange}
                                    >
                                        <MenuItem value={true} primaryText="Show Report In Process" />
                                        <MenuItem value={false} primaryText="Show Report After Voting Finishes" />
                                    </SelectField>
                                </div>
                                <div  style={{width:'50%'}}>
                                    <TextField
                                        type="number"
                                        style={styles.textField}
                                        floatingLabelText={'Max Answers'}
                                        name={'maxValues'}
                                        onChange={this.handleInputChange}
                                    /><br/>
                                </div>
                            </div>
                            <div style={styles.datePickers}>
                                <div>
                                    <DatePicker
                                        ref="startDate"
                                        floatingLabelText="Start Date"
                                        name="startDate"
                                        minDate={new Date()}
                                        onChange={(event, x) => this.handleStartDateChange(event, x)}
                                    />
                                </div>
                                <div>
                                    <DatePicker
                                        ref="endDate"
                                        style={{'paddingRight': '0'}}
                                        floatingLabelText="End Date"
                                        name="endDate"
                                        minDate={new Date()}
                                        onChange={(event, x) => this.handleEndDateChange(event, x)}
                                    />
                                </div>

                                <div style={{'paddingTop': '30px'}}>
                                    <RaisedButton label="Add" disabled={this.disableAddButton()} type='submit'
                                                  primary={true} style={{'marginRight': '10px'}}/>
                                    <RaisedButton label="Clear" onClick={() => this.clearInputs()}
                                                  primary={true}/>
                                </div>
                            </div>
                            <br/>
                        </form>
                    </div>
                </div>
            </div>
        )

    }
};