// src/app/MainHeadExtraMenu.js
import React, {Component, Fragment} from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";

//strings
import strings from "../constants/localization";
import {THREAD_LEFT_ASIDE_SEARCH} from "../constants/actionTypes";

//actions
import {
  threadLeftAsideShowing,
  threadSelectMessageShowing
} from "../actions/threadActions";

//UI components
import Container from "../../../pod-chat-ui-kit/src/container";
import Context, {ContextItem} from "../../../pod-chat-ui-kit/src/menu/Context";
import {mobileCheck} from "../utils/helpers";

//styling

@connect()
class MainHeadExtraMenu extends Component {

  constructor(props) {
    super(props);
    this.onLeftAsideShow = this.onLeftAsideShow.bind(this);
    this.onSelectMessagesShow = this.onSelectMessagesShow.bind(this);
  }

  onLeftAsideShow(e) {
    e.stopPropagation();
    this.props.dispatch(threadLeftAsideShowing(true, THREAD_LEFT_ASIDE_SEARCH));
  }

  onSelectMessagesShow(e) {
    e.stopPropagation();
    this.props.dispatch(threadSelectMessageShowing(true));
  }

  render() {
    const {thread,supportMode} = this.props;
    return (
      <Context id="thread-extra-context" preventHideOnScroll={false}>
        {
          thread.lastMessageVO && !supportMode &&
          <ContextItem onClick={this.onSelectMessagesShow}>
            {strings.selectMessages}
          </ContextItem>
        }
        <ContextItem onClick={this.onLeftAsideShow}>
          {strings.search}
        </ContextItem>
      </Context>
    )
  }
}

export default withRouter(MainHead);