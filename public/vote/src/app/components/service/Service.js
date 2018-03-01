import axios from "axios";
const BASE_URL="http://localhost:3000";
function logOut(){
    const url=BASE_URL+"/logOut";
    return axios.get(url);
}
function logIn(requestData){
    const url=BASE_URL+"/login";
    return axios.post(url,requestData);
}
function register(requestData){
    const url=BASE_URL+"/register";

    return axios.post(url,requestData);
}
function uploadFile(requestData) {
    const url=BASE_URL+"/files";
    return axios.post(url, requestData);
}
function questions(requestObject){
    const url=BASE_URL+"/app/question/get";
    return axios.post(url,requestObject);
}

function getOptions(requestObject){
    const url=BASE_URL+"/app/question/option/get";
    return axios.post(url,requestObject);
}

function retrieveSession(){
    const url=BASE_URL+"/retrieve/session";
    return axios.post(url,{});
}
function editVote(requestData) {
    const url = BASE_URL + "/app/question/edit";
    return axios.post(url, requestData);
}
function editOption(requestData){
    const url=BASE_URL+"/app/question/option/edit";
    return axios.post(url,requestData);
}
function addQuestion(requestData){
    const url=BASE_URL+"/app/question/add";
    return axios.post(url,requestData);
}
function addQuestionOption(requestData){
    const url=BASE_URL+"/app/question/option/add";
    return axios.post(url,requestData);
}
function deleteOption(requestData){
    const url=BASE_URL+"/app/question/option/delete";
    return axios.post(url,requestData);
}

function deleteQuestion(requestData){
    const url=BASE_URL+"/app/question/delete";
    return axios.post(url,requestData);
}
function checkAuthority(requestData){
    const url=BASE_URL+"/app/question/check/authority";
    return axios.post(url,requestData);
}
function vote(requestData){
    const url=BASE_URL+"/app/vote";
    return axios.post(url,requestData);
}
function getVoting(requestData){
    const url=BASE_URL+"/app/vote/get";
    return axios.post(url,requestData);
}
function checkVoting(requestData){
    const url=BASE_URL+"/app/vote/checkVoting";
    return axios.post(url,requestData);
}
function getChartData(requestData){
    const url=BASE_URL+"/app/vote/chartData";
    return axios.post(url,requestData);
}

export {logOut, logIn, register, questions,getOptions, retrieveSession, editVote, editOption,addQuestion,addQuestionOption, deleteOption,deleteQuestion , checkAuthority,getVoting,uploadFile,vote,checkVoting,getChartData}

