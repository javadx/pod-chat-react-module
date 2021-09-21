// src/app/MainExtraMenu.jsort React, {Component, Fragment} from "react";
import React, {Component} from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";

//strings
import strings from "../constants/localization";
import {THREAD_LEFT_ASIDE_SEARCH} from "../constants/actionTypes";

//actions
import {
  threadLeftAsideShowing,
  threadSelectMessageShowing,
  threadExportMessagesShowing
} from "../actions/threadActions";

//UI components
import Container from "../../../pod-chat-ui-kit/src/container";
import Context, {ContextItem} from "../../../pod-chat-ui-kit/src/menu/Context";
import {isChannel, mobileCheck} from "../utils/helpers";

//styling

@connect(store => {
  return {
    supportMode: store.chatSupportMode
  };
})
class MainExtraMenu extends Component {

  constructor(props) {
    super(props);
    this.onLeftAsideShow = this.onLeftAsideShow.bind(this);
    this.onSelectMessagesShow = this.onSelectMessagesShow.bind(this);
    this.onExportMessagesClick = this.onExportMessagesClick.bind(this);
  }

  onLeftAsideShow(e) {
    e.stopPropagation();
    this.props.dispatch(threadLeftAsideShowing(true, THREAD_LEFT_ASIDE_SEARCH));
  }

  onSelectMessagesShow(e) {
    e.stopPropagation();
    this.props.dispatch(threadSelectMessageShowing(true));
  }

  onExportMessagesClick(e) {
    e.stopPropagation();
    this.props.dispatch(threadExportMessagesShowing(true));
  }

  render() {
    const {thread, supportMode} = this.props;
    return (
      <Context id="thread-extra-context" style={{zIndex: 5000}}>

        {
          thread.lastMessageVO && !supportMode &&
          <ContextItem onClick={this.onSelectMessagesShow}>
            {strings.selectMessages}
          </ContextItem>
        }
        {
          !isChannel(thread) &&
          <ContextItem onClick={this.onExportMessagesClick}>
            {strings.exportMessages}
          </ContextItem>
        }
        <ContextItem onClick={this.onLeftAsideShow}>
          {strings.search}
        </ContextItem>
      </Context>
    )
  }
}

export default withRouter(MainExtraMenu);