### 1. install
npm install scroll

### 2. import
import Scroll  from 'Scroll'

### 3. props

 props | type | isRequired | default | desc 
 ------- | :-------: | :-------: | :-------: | :-------: 
 defaultScrollTop | number | false | 0 | 默认滚动位置 
 className | string | false | '' |css名字
 onScroll | func | false | () => {} |传递一个方法如修改状态等
 element | func | false | 200 | 获取的节点 
 isScrollBottom | boolean | false |  | 是否滚动到底部 
 scrollBottom | number | false |  | 滚动高度 - 节点的可视高度 
 scrollTop | number | false |  | 滚动距顶部 

### 

### 4. 示例

```react
import React from 'react';
import useScroll from 'src/useScroll';

export default class Layout extends React.Component {

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {};
          this.srcollTopRef = React.createRef();
  }

  componentDidMount() {}

  renderScrollMenus() {
    let pics = [1, 1,, 1, 1, 1];
    return (
      <Scroll width={230} height={1110} ref={this.srcollTopRef} onScroll={() => {
        const {scrollBottom, scrollTop} = this.srcollTopRef.current;
        const {isBottom} = this.state;
        if (scrollBottom - scrollTop < 10 && !isBottom || scrollTop >= 120) {
          this.setState({
            isBottom: true,
          });
        } else if (isBottom) {
          this.setState({
            isBottom: false,
          });
        }
      }
      }>
        <ul className={css.listBox}>
          {
            pics.map((item, index) => {
              return (
                <li key={index}>
                  <div className={css.yellowLine}/>
                  <div className={css.content}>{item.chinese}</div>
                </li>
              );
            })
          }
        </ul>
      </Scroll>
    );
  }

  render() {
    return this.renderScrollMenus();
  }
}
```
