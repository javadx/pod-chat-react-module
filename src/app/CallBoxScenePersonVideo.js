import React, {Component} from "react";
import {connect} from "react-redux";
import classnames from "classnames";
import ReactDOM from "react-dom";

//constants
import {
  CALL_DIV_ID, CHAT_CALL_BOX_FULL_SCREEN
} from "../constants/callModes";

//actions

//components
import Container from "../../../pod-chat-ui-kit/src/container";
import {
  MdMicOff
} from "react-icons/md";

//styling
import style from "../../styles/app/CallBoxSceneVideo.scss";
import {mobileCheck} from "../utils/helpers";



@connect()
export default class CallBoxScenePersonVideo extends Component {

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
      call.uiRemoteVideo.setAttribute("class", style.CallBoxSceneVideo__SideCamVideo);
      call.uiLocalVideo.setAttribute("class", style.CallBoxSceneVideo__MyCamVideo);
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

  componentWillUnmount() {
    const {call} = this.props.chatCallStatus;
    if (call.uiRemoteVideo) {
      const callDivTag = document.getElementById(CALL_DIV_ID);
      callDivTag.append(call.uiRemoteVideo);
      callDivTag.append(call.uiLocalVideo);
    }
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
    const fullScreenCondition = chatCallBoxShowing.showing === CHAT_CALL_BOX_FULL_SCREEN || mobileCheck();
    const sideUserFromParticipantList = chatCallParticipantList.find(participant => user.id !== participant.id);

    const classNames = classnames({
      [style.CallBoxSceneVideo]: true,
      [style["CallBoxSceneVideo--fullScreen"]]: fullScreenCondition
    });

    const callBoxSceneCamContainerClassName = classnames({
      [style.CallBoxSceneVideoCamContainer]: true,
      [style["CallBoxSceneVideoCamContainer--fullScreen"]]: fullScreenCondition
    });

    return <Container className={classNames}>
      <Container className={callBoxSceneCamContainerClassName}>
        <Container className={style.CallBoxSceneVideo__SideCam} ref={this.remoteVideoRef}>
          <Container className={style.CallBoxSceneVideo__MuteContainer}>
            {sideUserFromParticipantList && sideUserFromParticipantList.mute &&
            <MdMicOff size={style.iconSizeXs}
                      color={style.colorAccent}
                      style={{margin: "3px 4px"}}/>
            }
          </Container>
        </Container>
        <Container className={style.CallBoxSceneVideo__MyCam} ref={this.localVideoRef}/>
      </Container>
    </Container>
  }
}