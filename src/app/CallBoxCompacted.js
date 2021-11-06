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
import CallBoxCompactedPerson from "./CallBoxCompactedPerson";
import CallBoxControlSet from "./CallBoxControlSet";

//styling
import style from "../../styles/app/CallBoxCompacted.scss";
import {chatCallBoxShowingReducer} from "../reducers/chatReducer";
import {CHAT_CALL_BOX_COMPACTED, CHAT_CALL_BOX_NORMAL, CHAT_CALL_STATUS_INCOMING} from "../constants/callModes";
import classnames from "classnames";
import {isGroup} from "../utils/helpers";
import CallBoxCompactedGroup from "./CallBoxCompactedGroup";


@connect(store => {
  return {
    chatCallStatus: store.chatCallStatus,
    threadObject: store.thread
  }
})
export default class CallBoxCompacted extends Component {

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
    const {chatCallBoxShowing, chatCallStatus, CallBoxRef, small, threadObject} = this.props;
    const {thread: currentThread, threadFetching} = threadObject;
    const {thread} = chatCallBoxShowing;
    const {status} = chatCallStatus;
    const incomingCondition = status === CHAT_CALL_STATUS_INCOMING;
    const className = classnames({
      [style.CallBoxCompacted]: true,
      [style["CallBoxCompacted--noThreadOpened"]]: (!currentThread.id && !threadFetching),
      [style["CallBoxCompacted--small"]]: small,
      [style["CallBoxCompacted--incoming"]]: incomingCondition
    });
    return <Container className={className} onClick={this.onCompactCallClick}>
      <Container className={style.CallBoxCompacted__Person}>
        {isGroup(thread) ?
          <CallBoxCompactedGroup chatCallBoxShowing={chatCallBoxShowing} chatCallStatus={chatCallStatus}/>
          :
          <CallBoxCompactedPerson chatCallBoxShowing={chatCallBoxShowing} chatCallStatus={chatCallStatus}/>
        }
      </Container>
      <Container className={style.CallBoxCompacted__ControlSet}>
        <CallBoxControlSet stopRingtone={CallBoxRef.current && CallBoxRef.current.stopRingtone} buttonSize="sm"/>
      </Container>
    </Container>
  }
}