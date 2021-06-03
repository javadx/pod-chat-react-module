import React, {Component} from "react";
import {connect} from "react-redux";

//actions

//components
import Container from "../../../pod-chat-ui-kit/src/container";
import Avatar, {AvatarImage, AvatarName, AvatarText} from "../../../pod-chat-ui-kit/src/avatar";
import {Text} from "../../../pod-chat-ui-kit/src/typography";
import {
  MdMicOff
} from "react-icons/md";

//styling
import style from "../../styles/app/MainCallBoxCompactedGroup.scss";
import styleVar from "../../styles/variables.scss";
import {avatarNameGenerator, avatarUrlGenerator} from "../utils/helpers";
import {getImage, getName} from "./_component/contactList";

@connect(store => {
  return {
    chatCallParticipantList: store.chatCallParticipantList.participants
  };
})
export default class MainCallBoxCompactedGroup extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {chatCallBoxShowing, chatCallStatus, chatCallParticipantList} = this.props;
    return <Container className={style.MainCallBoxCompactedGroup}>
      {chatCallParticipantList.map(participant =>
        <Container className={style.MainCallBoxCompactedGroup__Participant}>
          {participant.mute &&
          <Container className={style.MainCallBoxCompactedGroup__MicOffContainer}>
            <MdMicOff size={styleVar.iconSizeXs}
                      color={styleVar.colorGrayDark}
                      style={{margin: "3px 4px"}}/>
          </Container>
          }
          <Avatar inline={false}>
            <AvatarImage src={avatarUrlGenerator(getImage(participant), avatarUrlGenerator.SIZES.XLARGE)}
                         text={avatarNameGenerator(getName(participant)).letter}
                         textBg={avatarNameGenerator(getName(participant)).color}/>
          </Avatar>
        </Container>
      )}

    </Container>
  }
}