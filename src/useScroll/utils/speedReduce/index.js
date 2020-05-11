
import requestAnimationFrame, {cancelAnimationFrame} from '../requestAnimationFrame';

const noop = () => {};

/**
 * props
 *
 * friction,   阻力
 * onStart,
 * onRun,
 * onStop,
 * onEnd,
 */
export default class SpeedReduce {
  constructor(props) {
    const {onStart = noop, onRun = noop, onStop = noop, onEnd = noop, ...other} = props;
    this.props = {
      onStart,
      onRun,
      onStop,
      onEnd,
      ...other,
    };
    this.offsetChanges = []; // 记录没帧的偏移量
    this.endInstantV = 0; // 记录完成时的瞬时速度
    this.endInstantDirection = 'down'; // 记录完成时的瞬时速度的方向
  }

  /**
   * 记录每一帧的偏移量
   * @param recordOffset
   */
  record(recordOffset = () => 0) {
    this.recordTimer = requestAnimationFrame(() => {
      this.offsetChanges.push(recordOffset());
      this.record(recordOffset);
    });
  }

  /**
   * 开始执行速度递减
   */
  run() {
    cancelAnimationFrame(this.recordTimer);
    // 最后一帧的偏移量 减去 倒数第二帧的偏移量  大约等于离开时的瞬时速度
    const lastOne = this.offsetChanges.pop();
    const lastTwo = this.offsetChanges.pop();
    this.endInstantV = Math.abs(lastOne - lastTwo);
    this.endInstantDirection = lastOne > lastTwo ? 'up' : 'down';
    this.offsetChanges = [];
    this.props.onStart();
    this.start();
  }

  start() {
    const {friction, onRun, onEnd} = this.props;
    this.reduceTimer = requestAnimationFrame(() => {
      if (this.endInstantV <= 0) {
        this.stop();
        onEnd();
        return;
      } else {
        this.endInstantV -= friction;
        if (this.endInstantV < 0) this.endInstantV = 0;
        onRun(this.endInstantV, this.endInstantDirection);
      }

      this.start();
    });
  }

  stop() {
    this.props.onStop();
    this.endInstantV = 0;
    this.offsetChanges = [];
    if (this.reduceTimer) {
      cancelAnimationFrame(this.reduceTimer);
    }
    if (this.recordTimer) {
      cancelAnimationFrame(this.recordTimer);
    }
  }
}
