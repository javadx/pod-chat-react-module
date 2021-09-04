// src/
import React, {Component} from "react";
import {connect} from "react-redux";

//strings
import {THREAD_LEFT_ASIDE_SEARCH, THREAD_LEFT_ASIDE_SEEN_LIST} from "../constants/actionTypes";

//actions
import {threadLeftAsideShowing} from "../actions/threadActions";

//UI components
import LeftAsideMainSearch from "./LeftAsideMainSearch";
import LeftAsideMainSeenList from "./LeftAsideMainSeenList";

//styling
import style from "../../styles/app/LeftAsideMain.scss";
import classnames from "classnames";
import Container from "../../../pod-chat-ui-kit/src/container";
import Scroller from "../../../pod-chat-ui-kit/src/scroller";
import {CHAT_CALL_BOX_COMPACTED} from "../constants/callModes";

@connect(store => {
  return {
    smallVersion: store.chatSmallVersion,
    thread: store.thread.thread,
    leftAsideShowing: store.threadLeftAsideShowing,
    chatCallBoxShowing: store.chatCallBoxShowing
  }
})
export default class LeftAsideMain extends Component {

  constructor(props) {
    super(props);
  }

  componentDidUpdate(oldProps) {
    const {thread: oldThread} = oldProps;
    const {thread, dispatch} = this.props;
    this.scroller = React.createRef();
    if (oldThread.id !== thread.id) {
      return dispatch(threadLeftAsideShowing(false));
    }
  }

  render() {
    const {leftAsideShowing, smallVersion, chatCallBoxShowing} = this.props;
    const callBoxCompactedCondition = chatCallBoxShowing.showing === CHAT_CALL_BOX_COMPACTED;
    const {type, data, isShowing} = leftAsideShowing;
    const commonProps = {data, smallVersion};
    const classNames = classnames({
      [style.LeftAsideMain]: true,
      [style["LeftAsideMain--callBoxCompacted"]]: callBoxCompactedCondition,
      [style["LeftAsideMain--smallVersion"]]: smallVersion
    });
    return (
      <Scroller className={classNames} ref={this.scroller}>
        {
          leftAsideShowing ?
            type === THREAD_LEFT_ASIDE_SEARCH ?
              <LeftAsideMainSearch {...commonProps}/>
              :
              <LeftAsideMainSeenList {...commonProps}/>
            : ""
        }
      </Scroller>
    )
  }
}
