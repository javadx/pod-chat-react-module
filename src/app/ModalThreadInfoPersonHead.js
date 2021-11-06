import React, {Fragment} from "react";
import {avatarNameGenerator, avatarUrlGenerator} from "../utils/helpers";
import strings from "../constants/localization";
import style from "../../styles/utils/ghost.scss";
import Gap from "../../../pod-chat-ui-kit/src/gap";
import {Heading, Text} from "../../../pod-chat-ui-kit/src/typography";
import Avatar, {AvatarImage, AvatarName} from "../../../pod-chat-ui-kit/src/avatar";
import Loading, {LoadingBlinkDots} from "../../../pod-chat-ui-kit/src/loading";
import {
  MdPersonAdd,
  MdPerson,
  MdPhone,
  MdBlock,
  MdNotifications,
  MdEdit,
  MdDelete,
  MdDeleteForever
} from "react-icons/md";
import Container from "../../../pod-chat-ui-kit/src/container";
import List, {ListItem} from "../../../pod-chat-ui-kit/src/list";
import date from "../utils/date";

export default function f(props) {
  let {
    thread,
    notificationPending,
    GapFragment,
    AvatarModalMediaFragment,
    participantImage,
    contact,
    participant,
    contactBlocking,
    onEdit,
    $this,
    onRemove,
    onAddContact,
    onRemoveThread,
    onBlockSelect,
    onNotificationSelect,
    isOnTheFly
  } = props;


  const isMyContact = participant.isMyContact || participant.contactId;

  return <Container>
    <Container relative>

      <Container>
        <Avatar>
          <AvatarImage src={avatarUrlGenerator(participantImage, avatarUrlGenerator.SIZES.LARGE)} size="xlg"
                       text={avatarNameGenerator(thread.title).letter}
                       textBg={avatarNameGenerator(thread.title).color}>
            <AvatarModalMediaFragment participant={participant}/>
          </AvatarImage>
          <AvatarName>
            <Heading h1>{thread.title}</Heading>
            <Text>{strings.lastSeen(date.prettifySince(participant ? participant.notSeenDuration : ""))}</Text>
          </AvatarName>
        </Avatar>
      </Container>

      <Container bottomLeft>
        <MdPerson size={style.iconSizeMd} color={style.colorGray}/>
      </Container>

    </Container>
    <Fragment>
      <GapFragment/>
      <List>
        {(participant.username || (contact.linkedUser && contact.linkedUser.username)) &&
        <ListItem invert>

          <Container userSelect="text">
            <MdPerson size={style.iconSizeMd} color={style.colorGray}/>
            <Gap x={20}>
              <Text inline>{participant.username || contact.linkedUser.username}</Text>
            </Gap>
          </Container>

        </ListItem>
        }
        {isMyContact ?

          <Fragment>
            {(contact.cellphoneNumber &&
              <ListItem invert>

                <Container userSelect="text">
                  <MdPhone size={style.iconSizeMd} color={style.colorGray}/>
                  <Gap x={20}>
                    <Text inline>{contact.cellphoneNumber}</Text>
                  </Gap>
                </Container>

              </ListItem>)
            }

            {
              <ListItem selection invert onSelect={onEdit.bind($this, participant, contact)}>
                <Container relative>
                  <MdEdit size={style.iconSizeMd} color={style.colorGray}/>
                  <Gap x={20}>
                    <Text>{strings.edit}</Text>
                  </Gap>
                </Container>
              </ListItem>
            }

            {
              <ListItem selection invert onSelect={onRemove.bind($this, participant)}>
                <Container relative>
                  <MdDelete size={style.iconSizeMd} color={style.colorGray}/>
                  <Gap x={20}>
                    <Text>{strings.remove}</Text>
                  </Gap>
                </Container>
              </ListItem>
            }

          </Fragment>
          :
          <ListItem selection invert onSelect={onAddContact.bind($this, participant)}>
            <Container relative>
              <MdPersonAdd size={style.iconSizeMd} color={style.colorGray}/>
              <Gap x={20}>
                <Text>{strings.addToContact}</Text>
              </Gap>
            </Container>
          </ListItem>
        }
      </List>
      {!isOnTheFly &&
      <Fragment>
        <Container>
          {
            isMyContact &&
            <GapFragment/>
          }
          <List>

            {
              <ListItem selection invert onSelect={onRemoveThread.bind($this, participant)}>
                <Container relative>
                  <MdDeleteForever size={style.iconSizeMd} color={style.colorGray}/>
                  <Gap x={20}>
                    <Text>{strings.removeThread}</Text>
                  </Gap>
                </Container>
              </ListItem>
            }

            <ListItem selection invert onSelect={onBlockSelect.bind($this, thread.id, participant.blocked)}>
              <Container relative>
                <MdBlock size={style.iconSizeMd} color={style.colorGray}/>
                <Gap x={20}>
                  <Text>{strings.block}</Text>
                </Gap>
                <Container centerLeft>
                  {contactBlocking ?
                    <Container centerTextAlign>
                      <Loading hasSpace><LoadingBlinkDots size="sm"/></Loading>
                    </Container>
                    :
                    <Gap x={5}>
                      <Text size="sm"
                            color={participant.blocked ? "red" : "green"}>{participant.blocked ? strings.blocked : ""}</Text>
                    </Gap>
                  }
                </Container>
              </Container>
            </ListItem>

            <ListItem selection invert onSelect={onNotificationSelect.bind(this, thread)}>

              <Container relative>
                <MdNotifications size={style.iconSizeMd} color={style.colorGray}/>
                <Gap x={20}>
                  <Text>{strings.notification}</Text>
                </Gap>
                <Container centerLeft>
                  {notificationPending ?
                    <Container centerTextAlign>
                      <Loading hasSpace><LoadingBlinkDots size="sm"/></Loading>
                    </Container>
                    :
                    <Gap x={5}>
                      <Text size="sm"
                            color={thread.mute ? "red" : "green"}>{thread.mute ? strings.inActive : strings.active}</Text>
                    </Gap>
                  }

                </Container>
              </Container>
            </ListItem>
          </List>

        </Container>
      </Fragment>
      }
    </Fragment>

  </Container>
}