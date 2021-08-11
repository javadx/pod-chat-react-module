import React, {Component} from "react";
import {connect} from "react-redux";
import classnames from "classnames";
import {avatarNameGenerator, avatarUrlGenerator, getMessageMetaData} from "../utils/helpers";
import {
  CALL_DIV_ID, CALL_SETTING_COOKIE_KEY_NAME,
  CALL_SETTINGS_CHANGE_EVENT,
  CHAT_CALL_BOX_FULL_SCREEN,
  CHAT_CALL_STATUS_INCOMING, GROUP_VIDEO_CALL_VIEW_MODE
} from "../constants/callModes";
import {getImage, getName} from "./_component/contactList";
import Gap from "raduikit/src/gap";
import CallBoxSceneGroupVoiceParticipants from "./CallBoxSceneGroupVoiceParticipants";

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

//styling
import style from "../../styles/app/CallBoxSceneGroupVideoThumbnail.scss";
import styleVar from "../../styles/variables.scss";


@connect(store => {
  return {
    chatCallParticipantList: store.chatCallParticipantList.participants,
    chatCallGroupSettingsShowing: store.chatCallGroupSettingsShowing,
    chatCallGroupVideoViewMode: store.chatCallGroupVideoViewMode
  };
})
export default class CallBoxSceneGroupVideoThumbnail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sceneParticipant: null
    }
  }

  render() {
    const {chatCallBoxShowing, user, chatCallParticipantList, participant} = this.props;
    let {sceneParticipant} = this.state;
    sceneParticipant = sceneParticipant || participant;
    sceneParticipant = sceneParticipant && sceneParticipant.id ? sceneParticipant : chatCallParticipantList.find(partcipant => partcipant.id === sceneParticipant);
    if (!sceneParticipant) {
      sceneParticipant = chatCallParticipantList && chatCallParticipantList[0];
    }
    let filterParticipants = chatCallParticipantList.filter(participant => participant.callStatus && participant.callStatus === 6 && participant.id !== sceneParticipant.id);

    filterParticipants = [...filterParticipants, ...filterParticipants, ...filterParticipants];
    const classNames = classnames({
      [style.CallBoxSceneGroupVideoThumbnail]: true,
    });

    return <Container className={classNames}>
      <Container className={style.CallBoxSceneGroupVideoThumbnail__Scene}>
        <Container id={sceneParticipant.sendTopic}
                   className={style.CallBoxSceneGroupVideoThumbnail__CamVideoContainer}/>
      </Container>
      <Container className={style.CallBoxSceneGroupVideoThumbnail__List}>
        {filterParticipants.map((participant, index) =>
          <Container className={style.CallBoxSceneGroupVideoThumbnail__ListItem}
                     key={participant.id}
                     ref={this.remoteVideoRef}>
            <Container className={style.CallBoxSceneGroupVideoThumbnail__MuteContainer}>
              {participant && participant.mute &&
              <MdMicOff size={styleVar.iconSizeXs}
                        color={styleVar.colorAccent}
                        style={{margin: "3px 4px"}}/>
              }
            </Container>
            <Container id={participant.sendTopic} className={style.CallBoxSceneGroupVideoThumbnail__CamVideoContainer}/>
          </Container>
        )}
      </Container>
    </Container>
  }
}