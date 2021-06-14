import React, {Component} from "react";
import {connect} from "react-redux";

//actions
import {threadCreateWithExistThread, threadGoToMessageId} from "../actions/threadActions";
import {chatAudioPlayer} from "../actions/chatActions";

//components
import Container from "../../../pod-chat-ui-kit/src/container";
import {Text} from "../../../pod-chat-ui-kit/src/typography";
import {
  MdMicOff,
  MdPlayArrow,
  MdPause
} from "react-icons/md";
import Avatar, {AvatarImage, AvatarName} from "../../../pod-chat-ui-kit/src/avatar";
import AvatarText from "../../../pod-chat-ui-kit/src/avatar/AvatarText";
import MainCallBoxToaster from "./MainCallBoxToaster";

//styling
import style from "../../styles/app/MainCallBoxSceneVideo.scss";
import styleVar from "../../styles/variables.scss";
import {avatarNameGenerator, avatarUrlGenerator, getMessageMetaData, isVideoCall} from "../utils/helpers";
import {CHAT_CALL_STATUS_INCOMING, CHAT_CALL_STATUS_OUTGOING, MOCK_CONTACT, MOCK_USER} from "../constants/callModes";
import {getImage, getName} from "./_component/contactList";
import classnames from "classnames";
import Gap from "raduikit/src/gap"
import ReactDOM from "react-dom";


@connect()
export default class MainCallBoxSceneVideo extends Component {

  constructor(props) {
    super(props);
    this.remoteVideoRef = React.createRef();
    this.localVideoRef = React.createRef();
  }

  _injectVideos() {
    const {call} = this.props.chatCallStatus;
    if (call.uiRemoteVideo) {
      const remoteVideoTag = ReactDOM.findDOMNode(this.remoteVideoRef.current);
      const localVideoTag = ReactDOM.findDOMNode(this.localVideoRef.current);
      call.uiRemoteVideo.setAttribute("class", style.MainCallBoxSceneVideo__SideCamVideo);
      call.uiLocalVideo.setAttribute("class", style.MainCallBoxSceneVideo__MyCamVideo);
      call.uiRemoteVideo.removeAttribute("height");
      call.uiRemoteVideo.removeAttribute("width");
      call.uiLocalVideo.removeAttribute("height");
      call.uiLocalVideo.removeAttribute("width");
      call.uiLocalVideo.disablePictureInPicture = true;
      call.uiRemoteVideo.disablePictureInPicture = true;
      remoteVideoTag.append(call.uiRemoteVideo);
      localVideoTag.append(call.uiLocalVideo);
    }
  }

  componentDidMount() {
    this._injectVideos();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {call: oldCall} = prevProps.chatCallStatus;
    const {call} = this.props.chatCallStatus;
    if (oldCall) {
      if (!oldCall.uiRemoteVideo) {
        this._injectVideos();
      }
    }
  }

  render() {
    const {chatCallStatus, chatCallBoxShowing, user, chatCallParticipantList} = this.props;
    const {status, call} = chatCallStatus;
    const sideUserFromParticipantList = chatCallParticipantList.find(participant => user.id !== participant.id);
    return <Container className={style.MainCallBoxSceneVideo}>
      <Container className={style.MainCallBoxSceneVideo__SideCam} ref={this.remoteVideoRef}>
        <Container className={style.MainCallBoxSceneVideo__MuteContainer}>
          {sideUserFromParticipantList && sideUserFromParticipantList.mute &&
          <MdMicOff size={styleVar.iconSizeXs}
                    color={styleVar.colorAccent}
                    style={{margin: "3px 4px"}}/>
          }
        </Container>
      </Container>
      <Container className={style.MainCallBoxSceneVideo__MyCam} ref={this.localVideoRef}/>
    </Container>
  }
}