// src/list/BoxScene.jss
import React, {Component} from "react";
import {connect} from "react-redux";

//strings

//actions
import {
  threadEmojiShowing
} from "../../actions/threadActions";

//components
import Container from "../../../../pod-chat-ui-kit/src/container";

//styling
import {MdSentimentVerySatisfied, MdClose} from "react-icons/md";
import style from "../../../styles/modules/InputEmojiTrigger.scss";


@connect(store => {
  return {
    threadFilesToUpload: store.threadFilesToUpload,
    threadId: store.thread.thread.id,
    isSendingText: store.threadIsSendingMessage
  };
})
export default class InputEmojiTrigger extends Component {

  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    const {emojiShowing, onEmojiShowing} = this.props;
    const showing = !emojiShowing;
    onEmojiShowing && onEmojiShowing(showing);
  }

  render() {
    const {emojiShowing} = this.props;
    return (
      <Container inline className={style.InputEmojiTrigger} relative onClick={this.onClick}>
        {emojiShowing ?
          <MdClose size={style.iconSizeMd}
                                    color={style.colorAccentDark}
                                    style={{margin: "3px 4px"}}/>
          :
          <MdSentimentVerySatisfied size={style.iconSizeMd}
                                color={style.colorAccentDark}
                                style={{margin: "3px 4px"}}/>
        }
      </Container>
    );
  }
}