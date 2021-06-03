import React, {Component} from "react";
import {connect} from "react-redux";
import {ToastContainer, toast} from 'react-toastify';

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
import style from "../../styles/app/MainCallBoxScene.scss";
import styleVar from "../../styles/variables.scss";
import {avatarNameGenerator, avatarUrlGenerator, getMessageMetaData} from "../utils/helpers";
import {CHAT_CALL_STATUS_INCOMING, CHAT_CALL_STATUS_OUTGOING, MOCK_CONTACT, MOCK_USER} from "../constants/callModes";
import {getImage, getName} from "./_component/contactList";
import classnames from "classnames";


@connect(store => {
  return {
    user: store.user.user,
    chatCallParticipantList: store.chatCallParticipantList.participants
  };
})
export default class MainCallBoxScene extends Component {

  constructor(props) {
    super(props);

  }

  componentDidMount() {
    setInterval(e=>{
      toast.error('دست قوی داری ماشاالله با سرعت زیادی تایپ کردی یه 5 دقیقه شرمنده بلاک شدی.!!!', {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
    },1000)

  }

  componentDidUpdate(prevProps, prevState, snapshot) {

  }

  render() {


    return <Container className={style.MainCallBoxScene}>
      <ToastContainer position="bottom-left"
                      autoClose={5000}
                      hideProgressBar={false}
                      newestOnTop={false}
                      closeOnClick
                      rtl={true}
                      pauseOnFocusLoss
                      draggable
                      pauseOnHover/>

    </Container>
  }
}