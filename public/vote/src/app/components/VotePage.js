import React from 'react';
import ContentCut from 'material-ui/svg-icons/content/content-cut';
import Delete from 'material-ui/svg-icons/action/delete';
import ChartIcon from 'material-ui/svg-icons/editor/insert-chart';
import SubmitIcon from 'material-ui/svg-icons/av/playlist-add-check';
import VoteIcon from 'material-ui/svg-icons/action/record-voice-over';
import DateIcon from 'material-ui/svg-icons/action/date-range';
import SaveIcon from 'material-ui/svg-icons/content/save';
import BackSpaceIcon from 'material-ui/svg-icons/content/backspace';
import {Card} from "material-ui/Card";
import {DatePicker, Dialog, Divider, FlatButton, MenuItem, SelectField, Snackbar, TextField} from "material-ui";
import {
    checkAuthority,
    checkVoting,
    deleteOption,
    deleteQuestion,
    editOption,
    editVote,
    getChartdata,
    getChartData,
    getOptions,
    retrieveSession,
    vote
} from "./service/Service";
import {AppToolbar} from "./AppToolbar";
import {CardActions, CardText, CardTitle} from "material-ui/Card/index";
import {createHashHistory} from 'history';
import {brown500, green100, green500, green600, indigo200, orange500, red200, red500} from "material-ui/styles/colors";
import {nameToUrl} from "./helper/Helper";
import AddIcon from 'material-ui/svg-icons/content/add';
import CancelIcon from 'material-ui/svg-icons/navigation/cancel';
import dateFormat from 'dateformat';


const PieChart = require("react-chartjs").Pie;
const history = createHashHistory();
const styles = {
    datePickers: {display: 'flex'},
    card: {
        width: '100%'
    },
    fields: {
        width: '100%',
        marginTop: '-14px'
    },
    question: {
        date: {
            fontSize: '12px',
            fontWeight: 'bolder',
            marginRight: '15px',
            color: 'sandybrown'
        },
        dateIcon: {
            height: '15px',
            width: '15px',
            color: 'saddlebrown'
        },
        dateText: {fontSize: '12px', color: 'sandybrown'}
    },
    options: {
        name: {margin: '10px', wordBreak: 'break-all', color: 'saddlebrown'},
        id: {marginLeft: '20px', marginRight: '5px', fontSize: '20px', color: brown500},
        voteIcon: {marginBottom: '-4px', color: orange500, cursor: 'pointer'},
        voteIconDisabled: {marginBottom: '-4px', color: orange500, cursor: 'not-allowed'},
        votedIcon: {marginBottom: '-4px', color: green600, cursor: 'not-allowed'},
        optionName: {fontSize: '20px', color: brown500}

    }
};
const options = {
    labels: {
        fontColor: red500
    }
};

export class VotePage extends React.Component {

    constructor(params) {
        super();
        this.state = {
            user: {},
            isQuestionAuthor: false,
            questionName: params.match.params.questionName,
            questionOption: {
                options: []
            },
            editVote: false,
            error: null,
            dialogOpen: false,
            voted: [],
            confirmDelete: false,
            chart: {
                show: false,
                data: []
            },
            voteFor:[]
        };


        this.editVote = this.editVote.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.deleteQuestionAction = this.deleteQuestionAction.bind(this);
        this.showCharts = this.showCharts.bind(this);
        this.openConfirmDialog = this.openConfirmDialog.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.editFormOptionsChange = this.editFormOptionsChange.bind(this);

    }

    componentWillMount() {
        retrieveSession().then(res => {
            if (!res['error']) {
                this.setState({
                    user: res['data']
                });
            }
            this.getQuestionOptions();
        });
    }

    editHandleSubmit(event) {
        event.preventDefault();
        let requestData = {
            _id: this.state.questionOption._id,
            name: this.state.questionOption.name,
            startDate: this.state.questionOption.startDate,
            endDate: this.state.questionOption.endDate,
            description: this.state.questionOption.description,
            showReportInProcess: this.state.questionOption.showReportInProcess
        };
        editVote(requestData).then(res => {
            if (!res['data']['error']) {
                editOption({options: this.state.questionOption.options}).then(res => {
                    if (!res['data']['error']) {
                        getOptions({questionName: nameToUrl(this.state.questionOption.name)}).then(res => {
                            this.setState({questionOption: res['data']});
                            this.editVote(false);
                        });
                    } else {
                        this.setState({
                            error: res['error']
                        });
                    }
                });
            } else {
                this.setState({
                    error: res['error']
                });
            }
        });
    }

    editFormOptionsChange(event, i) {
        const target = event.target;
        const value = target.value;
        let questionOption = this.state.questionOption;
        // if an option is Newly Added, need to add question ID
        questionOption.options[i]['name'] = value;
        questionOption.options[i]['questionId'] = questionOption._id;
        this.setState({questionOption: questionOption})
    }

    editFormChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let questionOption = this.state.questionOption;
        questionOption[name] = value;
        this.setState({questionOption: questionOption});
    }

    handleStartDateChange(e, date) {
        let qo = this.state.questionOption;
        qo.startDate = date;
        this.setState({
            questionOption: qo
        });
    }

    handleSelectChange(event, index, value) {
        let qo = this.state.questionName;
        qo.showReportInProcess = value;
        this.setState({questionName: qo});
    }

    handleEndDateChange(e, date) {
        let qo = this.state.questionOption;
        qo.endDate = date;
        this.setState({
            questionOption: qo
        });
    }

    getQuestionOptions() {
        getOptions({questionName: this.state.questionName}).then(res => {
            this.setState({
                questionOption: res['data']
            });
            this.checkQuestionAuthority();
            this.checkVoting();
            if (this.state.questionOption.showReportInProcess) {
                this.loadChartData();
            }
        })
    }

    editVote(bool) {
        this.setState({editVote: bool});
    }

    addOption() {
        let questionOption = this.state.questionOption;
        questionOption.options.push({name: ''});
        this.setState({
            questionOption: questionOption
        })
    }

    deleteOption(id, i) {
        if (!id) {
            let qo = this.state.questionOption;
            qo.options.splice(i, 1);
            this.setState({questionOption: qo});
        } else {
            deleteOption({_id: id}).then(res => {
                let qo = this.state.questionOption;
                qo.options.splice(i, 1);

                this.setState({questionOption: qo});
            });
        }
    }

    deleteQuestionAction(bool) {
        this.setState({confirmDelete:false});
        if (bool) {
            deleteQuestion({_id: this.state.questionOption._id}).then(res => {
                history.goBack();
            });
        }

    }

    checkQuestionAuthority() {
        checkAuthority(this.state.questionOption).then(res => {
            this.setState({isQuestionAuthor: res['data']['success']});
        });

    }

    checkVoting() {
        checkVoting(this.state.questionOption).then(res => {
            if (res['data']) {
                this.setState({voted: res['data']});
            }
        });

    }

    getVoteIcon(item) {
        if ((this.state.voted && this.state.voted.length>0 &&  this.state.voted.map(function(e){return e.optionId}).indexOf(item._id)>-1) ||
            this.state.voteFor.map(function(e) { return e._id; }).indexOf(item._id)>-1) {
            return styles.options.votedIcon;
        } else if (this.state.voted && this.state.voted.length>0 && this.state.voted.map(function(e){return e.optionId}).indexOf(item._id)<0) {
            return styles.options.voteIconDisabled;
        } else {
            return styles.options.voteIcon;
        }
    }

    voteFor = (bool) => {
        if (bool) {
            let requestData = {
                questionId: this.state.questionOption._id,
                options: this.state.voteFor
            };
            vote(requestData).then(res => {
                if (res['data'] && res['data']['success']) {
                    this.getQuestionOptions();
                } else {
                    this.setState({
                        error: res['error']
                    });
                }

            });
        }
        this.setState({dialogOpen: false});
        this.setState({voteFor: []})
    };

    disableEditButton() {
        return new Date(dateFormat(this.state.questionOption.startDate)) < new Date();
    }

    openConfirmDialog(){
        this.setState({dialogOpen: true});
    }
    clickOnVote = (item, i) => {
        if (!this.state.user.userName) {
            this.setState({error: "You Must Be Authorized!"});
            setTimeout(() => {
                this.setState({error: null})
            }, 5000);

        } else {
            let startDate = dateFormat(this.state.questionOption.startDate);
            let endDate = dateFormat(this.state.questionOption.endDate);
            if (new Date(endDate)>=new Date() && new Date() >= new Date(startDate)) {
                if (this.state.voted.length<1) {
                    let indexOfItem=this.state.voteFor.map((e)=>{return e._id}).indexOf(item._id);
                    if(indexOfItem>-1){
                        let items= this.state.voteFor;
                        items.splice(indexOfItem,1);
                        this.setState({voteFor: items});
                    } else {
                        if(this.state.questionOption.maxValues && this.state.questionOption.maxValues===this.state.voteFor.length){
                            this.setState({error: "Allowed Maximum "+ this.state.questionOption.maxValues + " Choice!"});
                        } else {
                            let items= this.state.voteFor;
                            items.push(item);
                            this.setState({voteFor: items});
                        }

                    }

                } else {
                    this.setState({error: "You Have Already Voted For!"});
                    setTimeout(() => {
                        this.setState({error: null})
                    }, 5000);

                }
            } else {
                this.setState({error: "Voting Is Out Of Date Range"});
                setTimeout(() => {
                    this.setState({error: null})
                }, 5000);
            }
        }
    };

    loadChartData() {
        getChartData(this.state.questionOption).then(res => {
            if (res['data']['error']) {

                this.setState({error: res['data']['error']});
                setTimeout(() => {
                    this.setState({error: null})
                }, 5000);

            } else {
                if (res['data']['chartData'].length === 0) {
                    // this.setState({error: "Votes Not Exist"});
                    // setTimeout(() => {
                    //     this.setState({error: null})
                    // }, 5000);
                    //todo

                } else {
                    let chart = this.state.chart;
                    chart.data = res['data']['chartData'];
                    this.setState({chart: chart});
                }

            }
        });
    }

    showCharts() {
        this.loadChartData();
    }
    confirmDelete(){
        this.setState({confirmDelete:true})
    }

    render() {
        const dialogActions = [
            <FlatButton
                label="No"
                primary={true}
                onClick={() => this.voteFor(false)}
            />,
            <FlatButton
                label="Yes"
                primary={true}
                keyboardFocused={true}
                onClick={() => this.voteFor(true)}
            />,
        ];
        const confirmDeleteDialogActions = [
            <FlatButton
                label="No"
                primary={true}
                onClick={() => this.deleteQuestionAction(false)}
            />,
            <FlatButton
                label="Yes"
                primary={true}
                keyboardFocused={true}
                onClick={() => this.deleteQuestionAction(true)}
            />,
        ];
        let questionOption = this.state.questionOption;
        return (
            <div>
                <AppToolbar history={history} user={this.state.user}  pageTitle={''}/>
                <div>
                    <Card style={styles}>
                        <CardTitle>
                            {(this.state.editVote) ?
                                <div>
                                    <TextField
                                        type="text"
                                        style={styles.fields}
                                        floatingLabelText="name"
                                        name="name"
                                        value={this.state.questionOption.name}
                                        onChange={(e) => this.editFormChange(e)}
                                    /><br/>
                                    <TextField
                                        type="text"
                                        style={styles.fields}
                                        floatingLabelText="description"
                                        name="description"
                                        value={this.state.questionOption.description}
                                        onChange={(e) => this.editFormChange(e)}
                                    /><br/>
                                    <div style={styles.datePickers}>
                                        <div>
                                            <DatePicker
                                                ref="startDate"
                                                floatingLabelText="Start Date"
                                                name="startDate"
                                                icon={<DateIcon/>}
                                                minDate={new Date()}
                                                value={new Date(dateFormat(this.state.questionOption.startDate))}
                                                onChange={(event, x) => this.handleStartDateChange(event, x)}
                                            />
                                        </div>
                                        <div>
                                            <DatePicker
                                                ref="endDate"
                                                style={{'paddingRight': '0'}}
                                                floatingLabelText="End Date"
                                                icon={<DateIcon/>}
                                                name="endDate"
                                                value={new Date(dateFormat(this.state.questionOption.endDate))}
                                                onChange={(event, x) => this.handleEndDateChange(event, x)}
                                            />
                                        </div>
                                        <div>
                                            <SelectField
                                                floatingLabelText="Report"
                                                name="showReportInProcess"
                                                value={this.state.questionOption.showReportInProcess}
                                                onChange={this.handleSelectChange}
                                            >
                                                <MenuItem value={true} primaryText="Show Report In Process"/>
                                                <MenuItem value={false}
                                                          primaryText="Show Report After Voting Finishes"/>
                                            </SelectField>
                                        </div>
                                    </div>
                                </div>
                                : <div>
                                    <h1 style={styles.options.name}>{questionOption.name}</h1>
                                    <Divider/>
                                    {/*<h5>{questionOption.description}</h5>*/}
                                    <p style={{marginLeft: '10px'}}>
                                        <DateIcon style={styles.question.dateIcon}/> <a
                                        style={styles.question.dateText}>Publish Date : <span
                                        style={styles.question.date}>{dateFormat(questionOption.created, 'mmmm dd, yyyy')}</span></a>
                                        <DateIcon style={styles.question.dateIcon}/> <a
                                        style={styles.question.dateText}>Start Date : <span
                                        style={styles.question.date}>{dateFormat(questionOption.startDate, 'mmmm dd, yyyy')}</span></a>
                                        <DateIcon style={styles.question.dateIcon}/> <a
                                        style={styles.question.dateText}>End Date : <span
                                        style={styles.question.date}> {dateFormat(questionOption.endDate, 'mmmm dd, yyyy')}</span></a>
                                    </p>
                                </div>
                            }
                        </CardTitle>
                        <CardText >
                            <div style={{display: 'flex'}}>
                            <div style={{width: '50%'}}>
                                {questionOption.options.map((item, i) => {
                                    if (this.state.editVote) {
                                        return (
                                            <div style={styles.options.name} key={i}>
                                                <h1 style={{'display': 'flex'}}>
                                                    <a style={styles.options.id}>{i + 1 + '. '}</a>
                                                    <TextField
                                                        type="text"
                                                        style={styles.fields}
                                                        hintText="option name"
                                                        name={'editFormOption' + i}
                                                        value={item.name}
                                                        onChange={(e) => this.editFormOptionsChange(e, i)}
                                                    />
                                                    <CancelIcon color={red500}
                                                                onClick={() => this.deleteOption(item._id, i)}
                                                                style={{'cursor': 'pointer'}}/>
                                                </h1>
                                            </div>
                                        )
                                    } else
                                        return (
                                            <div style={styles.options.name} key={i}>
                                                <h1>
                                                    <a style={styles.options.voteIcon}>
                                                        <VoteIcon onClick={() => this.clickOnVote(item, i)}
                                                                  style={this.getVoteIcon(item)}/>
                                                    </a>
                                                    <a style={styles.options.id}>{i + 1 + '. '}</a>
                                                    <a style={styles.options.optionName}>{item.name}</a>
                                                </h1>
                                            </div>
                                        )
                                })}
                                {(this.state.editVote) ? <AddIcon color={green600} onClick={() => this.addOption()}
                                                                  style={{'cursor': 'pointer'}}/> : null}
                            </div>
                            <div style={{width: '50%'}}>
                                <PieChart data={this.state.chart.data} options={options} width="600" height="250"/>
                                <div style={{textAlign:'right', fontWeight:'bolder'}}>
                                    {this.state.chart.data.map((val, i)=>{
                                        return <a key={i}>{(i+1)+')'+val.label +" - " + val.value+ "% " }</a>
                                    })}
                                </div>
                            </div>
                            </div>
                            <div>
                                {(this.state.voteFor.length>0)?<p style={{color:red200, fontWeight:'bolder'}}>*You Must Confirm  Your Choice By Clicking on "CONFIRM VOTE", Or Uncheck By Clicking On Option</p>:null}
                            </div>
                        </CardText>
                        <CardActions style={{'textAlign': 'right'}}>
                            {(this.state.isQuestionAuthor) ?
                                (
                                    <div>
                                        {
                                            (!this.state.editVote ) ?

                                                (<FlatButton icon={<ContentCut color={indigo200}/>} label="Edit"
                                                             disabled={this.disableEditButton()}
                                                             onClick={() => this.editVote(true)}/>)
                                                :
                                                (<span><FlatButton icon={<SaveIcon color={green100}/>}
                                                                   onClick={(e) => this.editHandleSubmit(e)}
                                                                   label="Save"/>
                                                    <FlatButton icon={<BackSpaceIcon color={indigo200}/>} label="Cancel"
                                                                onClick={() => this.editVote(false)}/></span>)
                                        }
                                        <FlatButton icon={<Delete color={red500}/>} label="Delete"
                                                    onClick={()=>this.confirmDelete()}/>
                                        <FlatButton icon={<ChartIcon color={red500}/>} label="Charts"
                                                    disabled={!(new Date(dateFormat(this.state.questionOption.endDate)) < new Date())}
                                                    onClick={this.showCharts}/>
                                        <FlatButton icon={<SubmitIcon color={green500}/>} label="Confirm Vote"
                                                    disabled={this.state.voteFor.length===0}
                                                    onClick={this.openConfirmDialog}/>
                                    </div>

                                ) : (<span>
                                    <FlatButton icon={<ChartIcon color={red500}/>} label="Charts"
                                                       disabled={!(new Date(dateFormat(this.state.questionOption.endDate)) < new Date())}
                                                       onClick={this.showCharts}/>
                                    <FlatButton icon={<SubmitIcon color={green500}/>} label="Confirm Vote"
                                                       disabled={this.state.voteFor.length===0}
                                                       onClick={this.openConfirmDialog}/>
                                </span>)
                            }


                        </CardActions>
                    </Card>
                </div>
                <Dialog
                    title="Are You Sure?"
                    actions={dialogActions}
                    modal={false}
                    open={this.state.dialogOpen}
                >
                    You have Only One Try to Vote For
                </Dialog>
                <Dialog
                    title="Are You Sure, You Want To Delete ?"
                    actions={confirmDeleteDialogActions}
                    modal={false}
                    open={this.state.confirmDelete}
                />
                <Snackbar
                    open={!!(this.state.error)}
                    message={this.state.error || "Error"}
                    autoHideDuration={4000}
                />

            </div>
        );
    }
    ;
}