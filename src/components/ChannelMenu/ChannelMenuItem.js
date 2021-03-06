import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import { ListItem, ListItemText, Badge } from '@material-ui/core'
import { SortableElement } from 'react-sortable-hoc'
import useLocalState from '../../hooks/use-local-state'
import styles from './style'

const ChannelMenuItem = ({
  classes,
  channel,
  isFocused,
  current,
  ...props
}) => {
  const [localState, setLocalState] = useLocalState()

  return (
    <ListItem
      button
      component={Link}
      to={`/channel/${channel._t_slug}`}
      className={current ? classes.currentItem : null}
      onClick={(e) => {
        setLocalState({ channelsMenuOpen: false })
        return true
      }}
      style={{ justifyContent: 'space-between' }}
      selected={!current && isFocused}
      {...props}
    >
      <ListItemText
        primary={channel.name}
        classes={{ root: classes.channelTextRoot }}
      />
      {(channel.unread || channel.unread === null) && (
        <Badge
          max={99}
          badgeContent={channel.unread}
          color="primary"
          variant={channel.unread === null ? 'dot' : null}
        />
      )}
    </ListItem>
  )
}

const Sortable = SortableElement(withStyles(styles)(ChannelMenuItem))
export { Sortable }
export default withStyles(styles)(ChannelMenuItem)
