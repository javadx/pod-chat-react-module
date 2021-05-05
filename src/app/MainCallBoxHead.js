import React, {Component} from "react";
import {connect} from "react-redux";

//actions
import {threadCreateWithExistThread, threadGoToMessageId} from "../actions/threadActions";
import {chatAudioPlayer, chatCallBoxShowing} from "../actions/chatActions";

//components
import Container from "../../../pod-chat-ui-kit/src/container";
import {ButtonFloating} from "../../../pod-chat-ui-kit/src/button"
import {Text} from "../../../pod-chat-ui-kit/src/typography";
import {
  MdExpandLess
} from "react-icons/md";

//styling
import style from "../../styles/app/MainCallBoxHead.scss";
import styleVar from "../../styles/variables.scss";
import {CHAT_CALL_STATUS_INCOMING, CHAT_CALL_STATUS_STARTED} from "../constants/callModes";
import classnames from "classnames";
import {getParticipant} from "./ModalThreadInfoPerson";
import strings from "../constants/localization";


@connect(store => {
  return {
    chatCallStatus: store.chatCallStatus
  }
})
export default class MainCallBoxHead extends Component {

  constructor(props) {
    super(props);
    this.onDropCallClick = this.onDropCallClick.bind(this);
    this.onVolumeClick = this.onVolumeClick.bind(this);
    this.onMicClick = this.onMicClick.bind(this);
    this.state = {
      volume: true,
      mic: true
    }
  }

  onDropCallClick(e) {
    e.stopPropagation();
    const {dispatch} = this.props;
    dispatch(chatCallBoxShowing(false, null, null));
  }

  onVolumeClick(e) {
    e.stopPropagation();
    this.setState({
      volume: !this.state.volume,
    })
  }

  onMicClick(e) {
    e.stopPropagation();
    this.setState({
      mic: !this.state.mic,
    })
  }

  render() {
    const {chatCallStatus} = this.props;
    const {status} = chatCallStatus;
    const incomingCondition = status === CHAT_CALL_STATUS_INCOMING;
    const callStarted = status === CHAT_CALL_STATUS_STARTED;
    return <Container className={style.MainCallBoxHead}>
      <Container className={style.MainCallBoxHead__StatusContainer}>
        <Text bold size="sm">{incomingCondition ? strings.ringing : callStarted ? strings.callStarted : strings.calling}</Text>
      </Container>
      <Container>
        <MdExpandLess size={styleVar.iconSizeMd} color={styleVar.colorAccent} style={{margin: "-3px"}}
                      onClick={this.onCallBoxClick}/>
      </Container>

    </Container>
  }
}