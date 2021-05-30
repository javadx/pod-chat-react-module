import React, {Component} from "react";
import {connect} from "react-redux";

//actions
import {threadCreateWithExistThread, threadGoToMessageId} from "../actions/threadActions";
import {chatAudioPlayer} from "../actions/chatActions";

//components
import Container from "../../../pod-chat-ui-kit/src/container";
import {Text} from "../../../pod-chat-ui-kit/src/typography";
import {
  MdMic,
  MdMicOff,
  MdClose,
  MdPause
} from "react-icons/md";
import Avatar, {AvatarImage, AvatarName} from "../../../pod-chat-ui-kit/src/avatar";
import AvatarText from "../../../pod-chat-ui-kit/src/avatar/AvatarText";

//styling
import style from "../../styles/app/MainCallBoxSceneGroupParticipantsDetails.scss";
import styleVar from "../../styles/variables.scss";
import {avatarNameGenerator, avatarUrlGenerator, getMessageMetaData} from "../utils/helpers";
import {CHAT_CALL_STATUS_INCOMING, CHAT_CALL_STATUS_OUTGOING, MOCK_CONTACT, MOCK_USER} from "../constants/callModes";
import {ContactList, getImage, getName} from "./_component/contactList";
import classnames from "classnames";
import Gap from "raduikit/src/gap";
import strings from "../constants/localization";


@connect()
export default class MainCallBoxSceneGroupParticipantsDetails extends Component {

  constructor(props) {
    super(props);
    this.onDetailsShowClick = this.onDetailsShowClick.bind(this);
    this.state = {}
  }

  onDetailsShowClick() {
    this.setState({
      detailsListShowing: !this.state.detailsListShowing
    })
  }

  render() {
    const {chatCallParticipantList, setDetailsShowing} = this.props;
    const {detailsListShowing} = this.state;
    const classNames = classnames({
      [style.MainCallBoxSceneGroupParticipantsDetails]: true
    });
    return <Container className={classNames} topLeft>
      <Container className={style.MainCallBoxSceneGroupParticipantsDetails__Head}>
        <Container className={style.MainCallBoxSceneGroupParticipantsDetails__HeadText}>
          <Text bold
                size="sm">{strings.peopleIsTalking(chatCallParticipantList.length)}
          </Text>
        </Container>
        <Container cursor="pointer">
          <MdClose onClick={() => setDetailsShowing(false)}
                   size={styleVar.iconSizeMd}
                   color={styleVar.colorAccentDark}/>
        </Container>
      </Container>

      <ContactList invert
                   AvatarNameFragment={
                     ({contact}) => {
                       return contact.admin ?
                         <Container className={style.ModalThreadInfoGroupSettingsAdminAdd__AdminDisable}
                                    onMouseDown={e => e.stopPropagation()}>
                         </Container> : ""
                     }
                   }
                   LeftActionFragment={
                     ({contact}) => {
                       return contact.muted ?
                         <MdMicOff size={styleVar.iconSizeMd}
                                   color={styleVar.colorGrayDark}
                                   style={{margin: "3px 4px"}}/>
                         :
                         <MdMic size={styleVar.iconSizeMd}
                                color={styleVar.colorAccentDark}
                                style={{margin: "3px 4px"}}/>
                     }
                   }
                   contacts={chatCallParticipantList}/>
    </Container>
  }
}