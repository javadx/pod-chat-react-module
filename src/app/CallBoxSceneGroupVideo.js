import React, {Component} from "react";
import {connect} from "react-redux";
import classnames from "classnames";
import {avatarNameGenerator, avatarUrlGenerator, getMessageMetaData} from "../utils/helpers";
import {CALL_DIV_ID, CHAT_CALL_BOX_FULL_SCREEN, CHAT_CALL_STATUS_INCOMING} from "../constants/callModes";
import {getImage, getName} from "./_component/contactList";
import Gap from "raduikit/src/gap";
import CallBoxSceneGroupVoiceParticipants from "./CallBoxSceneGroupVoiceParticipants";

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
import style from "../../styles/app/CallBoxSceneGroupVideo.scss";
import styleVar from "../../styles/variables.scss";
import ReactDOM from "react-dom";
import CallBoxSceneGroupParticipantsControl from "./CallBoxSceneGroupParticipantsControl";
import strings from "../constants/localization";


@connect(store => {
  return {
    chatCallParticipantList: store.chatCallParticipantList.participants,
    chatCallGroupSettingsShowing: store.chatCallGroupSettingsShowing,
    chatCallGroupVideoViewMode: store.chatCallGroupVideoViewMode
  };
})
export default class CallBoxSceneGroupVideo extends Component {

  constructor(props) {
    super(props);
  }

  _injectVideo(injectTo, sendTopic, local) {
    const {call} = this.props.chatCallStatus;
    if (call.uiRemoteVideo || call.uiLocalVideo) {
      const id = `uiRemoteVideo-Vi-${sendTopic}`;
      const videoTag = local ? call.uiLocalVideo : document.getElementById(id);
      if (!videoTag) {
        const videoTagSample = <video className={style.CallBoxSceneGroupVideo__CamVideo} disablePictureInPicture
                                      autoPlay={true}
                                      loop={true}
                                      controls=""
                                      name="media">
          <source src="https://www.w3schools.com/tags/movie.mp4"
                  type="video/mp4"/>
        </video>;
        ReactDOM.render(videoTagSample, injectTo);
        return;
      }
      videoTag.setAttribute("class", style.CallBoxSceneGroupVideo__CamVideo);
      videoTag.removeAttribute("height");
      videoTag.removeAttribute("width");
      videoTag.disablePictureInPicture = true;
      injectTo.append(videoTag);
    }
  }

  _traverseOverContactForInjecting() {
    let {filterParticipants, grid} = this._getGridContacts();
    filterParticipants.map((participant, index) => {
      const id = participant.sendTopic;
      const tag = document.getElementById(id);
      if (tag) {
        if (tag.firstChild) {
        } else {
          this._injectVideo(tag, id, participant.id === this.props.user.id);
        }
      }
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this._traverseOverContactForInjecting();
  }

  componentDidMount() {
    this._traverseOverContactForInjecting();
  }

  componentWillUnmount() {
    const {call} = this.props.chatCallStatus;
    if (call.uiRemoteVideo) {
      const callDivTag = document.getElementById(CALL_DIV_ID);
      callDivTag.append(call.uiRemoteVideo);
      callDivTag.append(call.uiLocalVideo);
    }
  }

  _getGridContacts() {
    const {chatCallParticipantList} = this.props;
    const filterParticipants = chatCallParticipantList.filter(partcipant => partcipant.callStatus && partcipant.callStatus === 6);
    const grid = {rows: 2, columns: 1, itemsCell: []};

    function buildRowColumn(index, columnException, toColumnException, rowException, rowToException) {
      const workingIndex = index + 1;
      const row = rowException || Math.ceil(workingIndex / 2);
      const column = columnException || (workingIndex % 2 === 0 ? 2 : 1);
      const toRow = row + (rowToException || 1);
      const toColumn = column + (toColumnException || 1);
      return {
        row: `${row} / ${toRow}`,
        column: `${column} / ${toColumn}`,
        area: `${row} / ${column} / ${toRow} / ${toColumn}`
      };
    }

    if (filterParticipants.length > 2) {
      grid.columns = 2;
      grid.rows = Math.ceil(filterParticipants.length / 2);
      const checkForLastEvenIndex = filterParticipants.length % 2 !== 0;
      for (let index in filterParticipants) {
        index = +index;
        if (checkForLastEvenIndex) {
          if (filterParticipants[index + 1]) {
            grid.itemsCell.push(buildRowColumn(index));
          } else {
            grid.itemsCell.push(buildRowColumn(index, 1, 3));
          }
        } else {
          grid.itemsCell.push(buildRowColumn(index));
        }
      }
    } else {
      if (filterParticipants.length <= 1) {
        grid.rows = 1;
        grid.itemsCell = [buildRowColumn(0)];
      } else {
        grid.itemsCell = [buildRowColumn(0), buildRowColumn(1, 1, 2, 2)];
      }
    }

    grid.template = `repeat(${grid.rows}, ${100 / grid.rows}%) / repeat(${grid.columns}, ${100 / grid.columns}%)`;
    return {grid, filterParticipants}
  }


  render() {
    const {chatCallStatus, chatCallBoxShowing, user, chatCallParticipantList, chatCallGroupSettingsShowing} = this.props;
    const {status, call} = chatCallStatus;
    const fullScreenCondition = chatCallBoxShowing.showing === CHAT_CALL_BOX_FULL_SCREEN;
    let {filterParticipants, grid} = this._getGridContacts();
    const classNames = classnames({
      [style.CallBoxSceneGroupVideo]: true,
      [style["CallBoxSceneGroupVideo--settings"]]: chatCallGroupSettingsShowing,
      [style["CallBoxSceneGroupVideo--fullScreen"]]: fullScreenCondition
    });

    const gridClassNames = classnames({
      [style.CallBoxSceneGroupVideo__Grid]: true,
      [style["CallBoxSceneGroupVideo__Grid--fullScreen"]]: fullScreenCondition
    });

    return <Container className={classNames}>

        <Container className={gridClassNames} style={{gridTemplate: grid.template}}>
          {filterParticipants.map((participant, index) =>
            <Container className={style.CallBoxSceneGroupVideo__CamContainer}
                       key={participant.id}
                       ref={this.remoteVideoRef}
                       style={{gridArea: grid.itemsCell[index].area}}>
              <Container className={style.CallBoxSceneGroupVideo__MuteContainer}>
                {participant && participant.mute &&
                <MdMicOff size={styleVar.iconSizeXs}
                          color={styleVar.colorAccent}
                          style={{margin: "3px 4px"}}/>
                }
              </Container>
              <Container id={participant.sendTopic} className={style.CallBoxSceneGroupVideo__CamVideoContainer}/>
            </Container>
          )}
        </Container>
      {chatCallGroupSettingsShowing &&

      <CallBoxSceneGroupParticipantsControl chatCallParticipantList={chatCallParticipantList}
                                            chatCallBoxShowing={chatCallBoxShowing}
                                            user={user}/>}
    </Container>
  }
}