import React, {Component} from "react";
import {connect} from "react-redux";

//actions
import {threadCreateWithExistThread, threadGoToMessageId} from "../actions/threadActions";
import {chatAudioPlayer} from "../actions/chatActions";

//components
import Container from "../../../pod-chat-ui-kit/src/container";
import {Text} from "../../../pod-chat-ui-kit/src/typography";
import {
  MdClose,
  MdPlayArrow,
  MdPause
} from "react-icons/md";
import Avatar, {AvatarImage, AvatarName} from "../../../pod-chat-ui-kit/src/avatar";
import AvatarText from "../../../pod-chat-ui-kit/src/avatar/AvatarText";

//styling
import style from "../../styles/app/MainCallBoxSceneGroupParticipants.scss";
import styleVar from "../../styles/variables.scss";
import {avatarNameGenerator, avatarUrlGenerator, getMessageMetaData} from "../utils/helpers";
import {CHAT_CALL_STATUS_INCOMING, CHAT_CALL_STATUS_OUTGOING, MOCK_CONTACT, MOCK_USER} from "../constants/callModes";
import {getImage, getName} from "./_component/contactList";
import classnames from "classnames";
import Gap from "raduikit/src/gap";
import strings from "../constants/localization";
import MainCallBoxSceneGroupParticipantsDetails from "./MainCallBoxSceneGroupParticipantsDetails";


@connect(store => {
  return {
    user: store.user.user,
    chatCallParticipantList: store.chatCallParticipantList.participants
  };
})
export default class MainCallBoxSceneGroup extends Component {

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
    })
  }

  render() {
    const {chatCallParticipantList} = this.props;
    const {detailsListShowing} = this.state;
    const mainCallBoxSceneGroupParticipantsClassNames = classnames({
      [style.MainCallBoxSceneGroupParticipants]: true,
      [style["MainCallBoxSceneGroupParticipants--details"]]: detailsListShowing
    });
    const avatarClassName = classnames({
      [style.MainCallBoxSceneGroupParticipants__Avatar]: true
    });
    if (detailsListShowing) {
      return <MainCallBoxSceneGroupParticipantsDetails chatCallParticipantList={chatCallParticipantList}
                                                       setDetailsShowing={this.setDetailsShowing}/>
    }
    return <Container className={mainCallBoxSceneGroupParticipantsClassNames}
                      onClick={() => this.setDetailsShowing(true)}>
      {chatCallParticipantList.map(participant =>
        <Container className={style.MainCallBoxSceneGroupParticipants__Participant}>
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