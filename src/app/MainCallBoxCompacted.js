import React, {Component} from "react";
import {connect} from "react-redux";

//actions
import {threadCreateWithExistThread, threadGoToMessageId} from "../actions/threadActions";
import {chatAudioPlayer, chatCallBoxShowing as chatCallBoxShowingAction} from "../actions/chatActions";

//components
import Container from "../../../pod-chat-ui-kit/src/container";
import {Text} from "../../../pod-chat-ui-kit/src/typography";
import {
  MdClose,
  MdPlayArrow,
  MdPause
} from "react-icons/md";
import MainCallBoxCompactedPerson from "./MainCallBoxCompactedPerson";
import MainCallBoxControlSet from "./MainCallBoxControlSet";

//styling
import style from "../../styles/app/MainCallBoxCompacted.scss";
import styleVar from "../../styles/variables.scss";
import {chatCallBoxShowingReducer} from "../reducers/chatReducer";
import {CHAT_CALL_BOX_COMPACTED, CHAT_CALL_BOX_NORMAL, CHAT_CALL_STATUS_INCOMING} from "../constants/callModes";
import classnames from "classnames";


@connect(store => {
  return {
    chatCallStatus: store.chatCallStatus
  }
})
export default class MainCallBoxCompacted extends Component {

  constructor(props) {
    super(props);
    this.onCompactCallClick = this.onCompactCallClick.bind(this);
  }

  onCompactCallClick() {
    const {dispatch, chatCallBoxShowing} = this.props;
    const {thread, contact} = chatCallBoxShowing;
    dispatch(chatCallBoxShowingAction(CHAT_CALL_BOX_NORMAL, thread, contact));
  }

  render() {
    const {chatCallBoxShowing, chatCallStatus} = this.props;
    const {status} = chatCallStatus;
    const incomingCondition = status === CHAT_CALL_STATUS_INCOMING;
    const className = classnames({
      [style.MainCallBoxCompacted]: true,
      [style["MainCallBoxCompacted--incoming"]]: incomingCondition
    });
    return <Container className={className} onClick={this.onCompactCallClick}>
      <Container className={style.MainCallBoxCompacted__Person}>
        <MainCallBoxCompactedPerson chatCallBoxShowing={chatCallBoxShowing} chatCallStatus={chatCallStatus}/>
      </Container>
      <Container className={style.MainCallBoxCompacted__ControlSet}>
        <MainCallBoxControlSet buttonSize="sm"/>
      </Container>
    </Container>
  }
}