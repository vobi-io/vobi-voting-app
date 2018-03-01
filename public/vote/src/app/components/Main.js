import React from 'react';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {VotingList} from "./VotingList";
import {VotePage} from "./VotePage";
import {Login} from "./Login";
import {NewVote} from "./NewVote";
import {browserHistory} from 'react-router';

export class Main extends React.Component {

    constructor(params) {
        super();
        this.state = {
            user: {}
        };

    }
    render() {
        return (
            <BrowserRouter history={browserHistory}>
                    <Switch>
                        <Route exact path={'/'} component={VotingList}/>
                        <Route path={'/auth'} component={Login}/>
                        <Route path={'/new'} component={NewVote}/>
                        <Route path={'/vote-page/:questionName'} component={VotePage}/>
                        <Route path={'/my/:my'} component={VotingList}/>
                    </Switch>
            </BrowserRouter>
        );
    }
}