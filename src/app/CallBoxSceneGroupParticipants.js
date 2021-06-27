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

//styling
import style from "../../styles/app/CallBoxSceneGroupParticipants.scss";
import styleVar from "../../styles/variables.scss";
import {avatarNameGenerator, avatarUrlGenerator, getMessageMetaData} from "../utils/helpers";
import {CHAT_CALL_STATUS_INCOMING, CHAT_CALL_STATUS_OUTGOING, MOCK_CONTACT, MOCK_USER} from "../constants/callModes";
import {getImage, getName} from "./_component/contactList";
import classnames from "classnames";
import Gap from "raduikit/src/gap";
import strings from "../constants/localization";
import CallBoxSceneGroupParticipantsDetails from "./CallBoxSceneGroupParticipantsDetails";


@connect(store => {
  return {
    user: store.user.user,
    chatCallParticipantList: store.chatCallParticipantList.participants
  };
})
export default class CallBoxSceneGroup extends Component {

  constructor(props) {
    super(props);
    this.setDetailsShowing = this.setDetailsShowing.bind(this);
    this.state = {
      detailsListShowing: false
    }
  }

  setDetailsShowing(showing) {
    this.setState({
      detailsListShowing: showing
    });
  }

  render() {
    const {chatCallParticipantList, chatCallBoxShowing, user} = this.props;
    const {detailsListShowing} = this.state;
    const CallBoxSceneGroupParticipantsClassNames = classnames({
      [style.CallBoxSceneGroupParticipants]: true,
      [style["CallBoxSceneGroupParticipants--details"]]: detailsListShowing
    });
    const avatarClassName = classnames({
      [style.CallBoxSceneGroupParticipants__Avatar]: true
    });
    if (detailsListShowing) {
      return <CallBoxSceneGroupParticipantsDetails chatCallParticipantList={chatCallParticipantList}
                                                   chatCallBoxShowing={chatCallBoxShowing}
                                                   user={user}
                                                   setDetailsShowing={this.setDetailsShowing}/>
    }
    return <Container className={CallBoxSceneGroupParticipantsClassNames}
                      onClick={() => this.setDetailsShowing(true)}>
      {chatCallParticipantList.map(participant =>
        <Container className={style.CallBoxSceneGroupParticipants__Participant}>
          {participant.mute &&
          <Container className={style.CallBoxSceneGroupParticipants__MicOffContainer} topLeft>
            <MdMicOff size={styleVar.iconSizeXs}
                      color={styleVar.colorGrayDark}
                      style={{margin: "3px 4px"}}/>
          </Container>
          }
          <Avatar cssClassNames={avatarClassName} inline={false}>
            <AvatarImage src={avatarUrlGenerator(getImage(participant), avatarUrlGenerator.SIZES.XLARGE)}
                         text={avatarNameGenerator(getName(participant)).letter}
                         textBg={avatarNameGenerator(getName(participant)).color}/>
          </Avatar>
        </Container>
      )}

    </Container>
  }
}