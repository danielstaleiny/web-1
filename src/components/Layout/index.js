import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import AddFeed from '../AddFeed'
import Gallery from './Gallery'
import Map from './Map'
import Classic from './Classic'
import Timeline from './Timeline'
import layouts from '../../modules/layouts'
import { posts as postsService } from '../../modules/feathers-services'
import getChannelSetting from '../../modules/get-channel-setting'
import {
  addPosts,
  setTimelineAfter,
  setTimelineBefore,
  selectChannel,
  addNotification,
} from '../../actions'
import styles from './style'

class MainPosts extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      layout: layouts[0],
    }

    this.handleLoadMore = this.handleLoadMore.bind(this)
    this.checkForNewPosts = this.checkForNewPosts.bind(this)
    this.renderTimelinePosts = this.renderTimelinePosts.bind(this)
  }

  componentDidMount() {
    if (
      this.props.user.me &&
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.channelSlug
    ) {
      const channel = decodeURIComponent(this.props.match.params.channelSlug)
      this.props.selectChannel(channel)
    }
    this.checkForNewPostsInterval = setInterval(
      this.checkForNewPosts,
      1000 * 60
    )
  }

  componentWillReceiveProps(newProps) {
    let newState = {}
    if (
      newProps.user.me &&
      newProps.match &&
      newProps.match.params &&
      newProps.match.params.channelSlug &&
      newProps.match.params.channelSlug !== newProps.selectedChannel
    ) {
      const channel = decodeURIComponent(newProps.match.params.channelSlug)
      newProps.selectChannel(channel)
    } else if (
      newProps.match &&
      newProps.match.params &&
      !newProps.match.params.channelSlug &&
      !newProps.selectedChannel &&
      newProps.channels.length &&
      newProps.user.me
    ) {
      const firstChannel = newProps.channels.find(
        channel => channel.uid !== 'notifications'
      )
      if (firstChannel && firstChannel.uid) {
        newProps.selectChannel(firstChannel.uid)
      }
    }
    if (
      newProps.selectedChannel &&
      newProps.user.me &&
      newProps.selectedChannel !== this.props.selectedChannel
    ) {
      newState.loading = true
      newState.layout = layouts[0]
      postsService
        .find({ query: { channel: newProps.selectedChannel } })
        .then(res => {
          this.setState({ loading: false })
          if (res.items) {
            this.props.addPosts(res.items)
          }
          if (res.paging) {
            if (res.paging.before) {
              this.props.setTimelineBefore(res.paging.before)
            }
            if (res.paging.after) {
              this.props.setTimelineAfter(res.paging.after)
            }
          }
        })
        .catch(err => {
          this.setState({ loading: false })
          console.log(err)
        })
    }
    const foundLayout = layouts.find(
      layout =>
        layout.id ===
        getChannelSetting(
          newProps.selectedChannel,
          'layout',
          newProps.channelSettings
        )
    )
    if (foundLayout) {
      newState.layout = foundLayout
    }
    this.setState(newState)
  }

  componentWillUnmount() {
    clearInterval(this.checkForNewPostsInterval)
  }

  checkForNewPosts() {
    const { selectedChannel, timelineBefore, addNotification } = this.props
    if (document.hasFocus && selectedChannel && timelineBefore) {
      postsService
        .find({ query: { channel: selectedChannel, before: timelineBefore } })
        .then(res => {
          if (res.items && res.items.length) {
            this.props.addPosts(res.items, 'prepend')
            addNotification('Loaded new posts')
          }
          if (res.paging && res.paging.before) {
            this.props.setTimelineBefore(res.paging.before)
          }
        })
        .catch(err => {
          console.log('Error checking for new posts', err)
        })
    }
  }

  handleLoadMore() {
    if (!this.state.loading) {
      this.setState({ loading: true })
      postsService
        .find({
          query: {
            channel: this.props.selectedChannel,
            after: this.props.timelineAfter,
          },
        })
        .then(res => {
          if (res.items) {
            this.props.addPosts(res.items)
          }
          if (res.paging && res.paging.after) {
            this.props.setTimelineAfter(res.paging.after)
          } else {
            this.props.setTimelineAfter('')
          }
          this.setState({ loading: false })
        })
        .catch(err => {
          this.setState({ loading: false })
          console.log(err)
        })
    }
  }

  renderTimelinePosts() {
    let posts = this.props.items
    if (this.state.layout && this.state.layout.filter) {
      posts = posts.filter(this.state.layout.filter)
    }
    switch (this.state.layout.id) {
      case 'gallery':
        return (
          <Gallery
            posts={posts}
            loadMore={this.props.timelineAfter ? this.handleLoadMore : null}
          />
        )
      case 'map':
        return (
          <Map
            posts={posts}
            loadMore={this.props.timelineAfter ? this.handleLoadMore : null}
          />
        )
      case 'classic':
        return (
          <Classic
            posts={posts}
            loadMore={this.props.timelineAfter ? this.handleLoadMore : null}
          />
        )
      case 'timeline':
        return (
          <Timeline
            posts={posts}
            loadMore={this.props.timelineAfter ? this.handleLoadMore : null}
          />
        )
      default:
        return (
          <Timeline
            posts={posts}
            loadMore={this.props.timelineAfter ? this.handleLoadMore : null}
          />
        )
    }
  }

  renderNoPosts() {
    return (
      <div className={this.props.classes.noPosts}>
        <Typography variant="h5" component="h2">
          <span role="img" aria-label="">
            🤷‍
          </span>{' '}
          Nothing to show
        </Typography>
        <Typography component="p">
          Maybe you need to subscribe to a site or select a different channel
        </Typography>
      </div>
    )
  }

  render() {
    return (
      <div style={{ height: '100%' }}>
        {this.state.loading && (
          <LinearProgress className={this.props.classes.loading} />
        )}
        {this.props.items.length > 0 || this.state.loading
          ? this.renderTimelinePosts()
          : this.renderNoPosts()}
        <AddFeed />
      </div>
    )
  }
}

MainPosts.defaultProps = {
  items: [],
}

MainPosts.propTypes = {
  items: PropTypes.array.isRequired,
}

const mapStateToProps = state => ({
  timelineBefore: state.app.get('timelineBefore'),
  timelineAfter: state.app.get('timelineAfter'),
  selectedChannel: state.app.get('selectedChannel'),
  channels: state.channels.toJS(),
  items: state.posts.toJS(),
  user: state.user.toJS(),
  channelSettings: state.settings.get('channels') || {},
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      addPosts,
      setTimelineAfter,
      setTimelineBefore,
      selectChannel,
      addNotification,
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(MainPosts))