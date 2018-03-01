import React from 'react';
import Divider from 'material-ui/Divider';
import {Card} from "material-ui/Card";
import {AppToolbar} from "./AppToolbar";
import {deleteQuestion, questions, retrieveSession} from "./service/Service";
import {createHashHistory} from 'history';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow,
    TableRowColumn
} from "material-ui";
import Link from "react-router-dom/es/Link";
import {ActionFlightTakeoff} from "material-ui/svg-icons/index";
import {green500, red500} from "material-ui/styles/colors";
import Delete from 'material-ui/svg-icons/action/delete';
import {nameToUrl} from "./helper/Helper";
import dateFormat from 'dateformat';
const history = createHashHistory();

export class VotingList extends React.Component {

    constructor(props) {
        super();
        this.state = {
            my:props.match.params.my,
            selected: [],
            user: {},
            questions: []
        };
    }
    getQuestions() {
        questions({userName:this.props.match.params.my}).then(res => {
            this.setState({
                questions: res['data']
            })
        });
        retrieveSession().then(res => {
            if (!res['error']) {
                this.setState({
                    user: res['data']
                })
            }
        });
    }
   
    componentWillReceiveProps(){
        if(this.props.match.params.my){
            this.setState({my:this.props.match.params.my});
            setTimeout(()=>{this.getQuestions()},50);
        } else {
            this.setState({my:null});
            setTimeout(()=>{this.getQuestions()},50);
        }
       
    }
    componentDidMount() {
        this.getQuestions();
    }

    
    isSelected = (index) => {
        return this.state.selected.indexOf(index) !== -1;
    };

    handleRowSelection = (selectedRows) => {
        this.setState({
            selected: selectedRows,
        });
    };


    render() {

        let questions = this.state['questions'];
        return (
            <div>
                <AppToolbar history={history} user={this.state.user} pageTitle={(this.state.my)?'My Votes':'All Votes'}/>
                <div>
                    <Card>
                        <Table onRowSelection={this.handleRowSelection}>
                            <TableHeader>
                                <TableRow>
                                    <TableHeaderColumn>Name</TableHeaderColumn>
                                    <TableHeaderColumn>Start Date</TableHeaderColumn>
                                    <TableHeaderColumn>End Date</TableHeaderColumn>
                                    <TableHeaderColumn>Publish Date</TableHeaderColumn>
                                    <TableHeaderColumn>action</TableHeaderColumn>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {questions.map((item, i) => {
                                    return ( <TableRow selected={this.isSelected(i)} key={i} >

                                        <TableRowColumn>{item.name}</TableRowColumn>
                                        <TableRowColumn>
                                            {dateFormat(item.startDate,'mmmm dS, yyyy')}
                                            </TableRowColumn>
                                        <TableRowColumn>{dateFormat(item.endDate,'mmmm dd, yyyy')}</TableRowColumn>
                                        <TableRowColumn>{dateFormat(item.created,'mmmm dd, yyyy')}</TableRowColumn>
                                        <TableRowColumn>
                                            <Link to={'/vote-page/'+nameToUrl(item.name) }>
                                                <ActionFlightTakeoff color={green500} />
                                            </Link>
                                            {/*<Delete onClick={()=>this.deleteQuestionAction(item._id)} color={red500} style={{'cursor':'pointer'}}/>*/}
                                        </TableRowColumn>
                                        </TableRow>)
                                })}
                            </TableBody>
                        </Table>
                        <Divider/>
                    </Card>
                </div>
            </div>
        );
    };
}