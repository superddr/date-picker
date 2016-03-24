# date-picker-react
A react date picker control

##Installation
    npm install date-picker-react

##Demo
![demo](docs/imgs/demo.png)

##Usage
```js
import {SinglePicker,RangePicker} from 'DatePicker';
var Me = React.createClass({
    getInitialState() {
        return { date:new Date()};
    },
    render(){
        return <SinglePicker
            type={'date'}
            value={this.state.date}
            onChange={date=>this.setState({date:date})}
        />
    }
});

dom.render(<Me />, document.getElementById('container'));
```

##Single Picker Props
Name|Type|Description
---|---|---
type|string|'date','week','month','year'
value|Date|selected date
onChange|Function|callback to recieve selected date, 1 param:the date
style|Object|css style to be used on the component
verify|Function|callback to specify whether a date can be selected,see below


##Range Picker Props
Name|Type|Description
---|---|---
type|string|'date','week','month','year'
from|Date|when the time range starts
to|Date|when the time range ends
onChange|Function|callback to recieve selected date, 2 param2:from,to(type:date)
style|Object|css style to be used on the component
verify|Function|callback to specify whether a date can be selected,see below
onError|Function|callback to handle errors


##The 'verify' Function
1.它用来指定可选日期，如果未被指定，则所有的日期都可选

2.它会在渲染时被多次调用，每一个可选日期格子被渲染时都会来询问是否可选

3.它有两个参数，第一个Date类型，用于判断是否可选

4.第二个参数string类型，type，即'date','week','month','year'

5.第二个参数用于帮助判断当前日期是否可用，因为对于像'year'这样的类型，收到的日期将是每年的第一天，而你手里用来比较的日期可能是年内的某一段时间，这样日期就会落在范围外。但实际上该年应该可选。这需要额外的处理才能正确工作。而这些处理需要依赖控件类型。
