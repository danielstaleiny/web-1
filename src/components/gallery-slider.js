import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { withStyles } from 'material-ui/styles';
import GridList, { GridListTile, GridListTileBar } from 'material-ui/GridList';
import Avatar from 'material-ui/Avatar';
import Button from 'material-ui/Button';
import Dialog from 'material-ui/Dialog';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import InfoIcon from 'material-ui-icons/Info';
import CloseIcon from 'material-ui-icons/Close';
import Slide from 'material-ui/transitions/Slide';
import TogetherCard from './card';
import Carousel from 'nuka-carousel';
import FullscreenPhoto from './fullscreen-photo';
import authorToAvatarData from '../modules/author-to-avatar-data';

const styles = theme => ({
  loadMore: {
    width: '100%',
    marginTop: 16,
  },
  carousel: {
    // width: '100%',
    // height: '100%',
    // overflow: 'hidden',
    // background: theme.palette.primary.dark,
  },
  popup: {
    display: 'flex',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    background: theme.palette.primary.dark,
  },
  popupImage: {
    display: 'block',
    margin: 'auto',
    maxWidth: '100%',
    maxHeight: '100%',
    width: 'auto',
    height: 'auto',
    boxShadow: '0 0 3em rgba(0,0,0,.5)',
  },
  popupClose: {
    position: 'absolute',
    top: 0,
    right: 0,
    color: 'white',
    background: 'rgba(0,0,0,.5)',
    borderRadius: 0,
  },
  infoButton: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    color: 'white',
    background: 'none',
    borderRadius: 0,
  },
  drawer: {
    // padding: '1em',
    width: 300,
    maxWidth: '80%',
  },
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class Gallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: this.props.open,
    };
    this.handleClose = this.handleClose.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.open != this.state.open) {
      this.setState({ open: newProps.open });
    }
  }

  handleClose() {
    this.setState({ open: false });
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  render() {
    return (
      <Dialog
        fullScreen
        open={this.state.open}
        onClose={this.handleClose}
        transition={Transition}
      >
        <Carousel
          className={this.props.classes.carousel}
          slideIndex={this.props.startIndex}
        >
          {this.props.posts.map(post => {
            if (typeof post.photo === 'string') {
              post.photo = [post.photo];
            }
            return post.photo.map(photo => (
              <div className={this.props.classes.popup}>
                <IconButton
                  className={this.props.classes.infoButton}
                  onClick={() => this.setState({ showInfo: true })}
                >
                  <InfoIcon />
                </IconButton>
                <img
                  className={this.props.classes.popupImage}
                  src={photo}
                  alt=""
                />
                <Drawer
                  open={this.state.showInfo}
                  onClose={() => this.setState({ showInfo: false })}
                  classes={{
                    paperAnchorLeft: this.props.classes.drawer,
                  }}
                >
                  <TogetherCard post={post} embedMode="photo" />
                </Drawer>
              </div>
            ));
          })}
        </Carousel>
        <IconButton
          className={this.props.classes.popupClose}
          onClick={this.handleClose}
        >
          <CloseIcon />
        </IconButton>
      </Dialog>
    );
  }
}

Gallery.defaultProps = {
  posts: [],
};

Gallery.propTypes = {
  posts: PropTypes.array.isRequired,
  onClose: PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(null, mapDispatchToProps)(withStyles(styles)(Gallery));
