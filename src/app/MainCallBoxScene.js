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
import style from "../../styles/app/MainCallBoxScene.scss";
import styleVar from "../../styles/variables.scss";
import {avatarNameGenerator, avatarUrlGenerator, getMessageMetaData} from "../utils/helpers";
import {CHAT_CALL_STATUS_INCOMING, CHAT_CALL_STATUS_OUTGOING, MOCK_CONTACT, MOCK_USER} from "../constants/callModes";
import {getImage, getName} from "./_component/contactList";
import classnames from "classnames";
import Gap from "raduikit/src/gap";


@connect(store => {
  return {
    user: store.user.user
  };
})
export default class MainCallBoxScene extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {chatCallStatus, chatCallBoxShowing, user} = this.props;
    const {status} = chatCallStatus;
    const incomingCondition = status === CHAT_CALL_STATUS_INCOMING;
    const {contact} = chatCallBoxShowing;
    const avatarContainerClassNames = classnames({
      [style.MainCallBoxScene__AvatarContainer]: !incomingCondition
    });
    const avatarClassName = isSide => classnames({
      [style.MainCallBoxScene__Avatar]: true,
      [style["MainCallBoxScene__Avatar--side"]]: isSide
    });

    const AvatarBuilder = ({user, className}) =>
      <Container className={avatarContainerClassNames}>
        <Avatar cssClassNames={className} inline={false}>
          <AvatarImage src={avatarUrlGenerator(getImage(user), avatarUrlGenerator.SIZES.XLARGE)}
                       size="xlg"
                       text={avatarNameGenerator(getName(user)).letter}
                       textBg={avatarNameGenerator(getName(user)).color}/>
          <Gap y={5}/>
          <AvatarName maxWidth={"110px"} style={{marginRight: "0", maxWidth: "96px"}} size="sm">
            {getName(user)}
          </AvatarName>
        </Avatar>
      </Container>;

    return <Container className={style.MainCallBoxScene}>
      <AvatarBuilder user={incomingCondition ? contact : user} className={incomingCondition ? "" : avatarClassName()}/>
      {!incomingCondition &&
      <AvatarBuilder user={contact} className={avatarClassName(true)}/>}

    </Container>
  }
}