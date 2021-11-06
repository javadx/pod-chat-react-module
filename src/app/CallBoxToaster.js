import React, {Component} from "react";
import {connect} from "react-redux";
import {ToastContainer, toast} from 'react-toastify';

//components
import Container from "../../../pod-chat-ui-kit/src/container";

//styling
import style from "../../styles/app/CallBoxScene.scss";

@connect(store => {
  return {
    user: store.user.user,
    chatCallParticipantList: store.chatCallParticipantList.participants
  };
})
export default class CallBoxScene extends Component {

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


    return <Container className={style.CallBoxScene}>
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