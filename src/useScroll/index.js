import React from 'react';
import css from './index.less';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { addEvent, removeEvent, isIOS} from './utils';
import Timer from './utils/timer';
import SpeedReduce from './utils/speedReduce';

// @observer
export default class useScroll extends React.Component {

  static propTypes = {
    defaultScrollTop: PropTypes.number,
    className: PropTypes.string,
    onScroll: PropTypes.func,
  };

  static defaultProps = {
    defaultScrollTop: 0,
    onScroll: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      isWheel: false,
    };
    this.refScrollArea = React.createRef();
    this.scrollToY.bind(this);
    this.isTouching = false;
  }

  componentDidMount() {
    if (this.props.defaultScrollTop) this.scrollTop = this.props.defaultScrollTop;
  }

  componentWillUnmount() {
    if (this.SpeedReduce) {
      this.SpeedReduce.stop();
      this.SpeedReduce = null;
    }
    if (this.autoScrollTimer) {
      this.autoScrollTimer.stop();
      this.autoScrollTimer = null;
    }
    removeEvent(document, 'touchend', this.onTouchEnd);
  }

  get element() {
    return this.refScrollArea.current;
  }

  set scrollTop(y) {
    this.props.onScroll(y);
    this.element.scrollTop = y;
  }

  get scrollTop() {
    return this.element.scrollTop;
  }

  get scrollHeight() {
    // scrollHeight 是只读属性
    // https://developer.mozilla.org/zh-CN/docs/Web/API/Element/scrollHeight
    return this.element.scrollHeight;
  }

  get isScrollBottom() {
    return this.scrollTop === this.scrollBottom;
  }

  get scrollBottom() {
    return this.scrollHeight - this.element.clientHeight;
  }

  scrollToY(toY, duration = 0) {
    const { isWheel } = this.state;
    //  鼠标滚轮滚动时，不再触发滚动
    if (isWheel) {
      return;
    }

    if (duration) {
      const startScrollTop = this.scrollTop;
      this.autoScrollTimer = new Timer({
        duration,
        easing: 'easeOutSine',
        onRun: (e) => {
          if (toY >= 0) {
            this.scrollTop = startScrollTop + e.percent * (toY - startScrollTop);
          }
        }
      });
      this.autoScrollTimer.run();
    } else {
      this.scrollTop = toY;
    }
  }

  onTouchStart(e) {
    if (this.autoScrollTimer) {
      this.autoScrollTimer.stop();
    }
    // 如果是ios系统，需要自己做做滑动衰减
    if (isIOS && !this.isTouching) {
      this.isTouching = true;
      if (this.SpeedReduce) {
        this.SpeedReduce.stop();
        this.SpeedReduce = null;
      }
      if (!this.SpeedReduce) {
        this.SpeedReduce = new SpeedReduce({
          friction: 0.8, // 衰减速率 (阻力)
          onRun: (speed, direction) => {
            const nowScrollTop = this.scrollTop;

            if (!isNaN(speed)) {
              if (direction === 'up') { // 上滑
                this.scrollTop = nowScrollTop + speed;
              } else {
                this.scrollTop = nowScrollTop - speed;
              }
            }
          },
        });
      }

      this.SpeedReduce.record(() => this.scrollTop);
      addEvent(document, 'touchend', this.onTouchEnd);
    } else {
      if (this.SpeedReduce) this.SpeedReduce.stop();
    }
  }

  onTouchEnd = () => {
    if (this.SpeedReduce) {
      this.SpeedReduce.run();
      this.isTouching = false;
    }
    removeEvent(document, 'touchend', this.onTouchEnd);
  };

  render() {
    // 不要删除没有用到的 defaultScrollTop
    const { defaultScrollTop, className, ...other } = this.props;
    const props = {
      ...other,
      ref: this.refScrollArea,
      className: classnames([css.scrollArea, className]),
      onTouchStart: this.onTouchStart.bind(this),
    };
    return <div {...props} />;
  }
}
