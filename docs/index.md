#Demo
```js
import DatePanel,{SinglePicker,RangePicker} from 'DatePicker';

var Me = React.createClass({
    getInitialState() {
        return { 
            date:new Date(),

            from:new Date(),
            to:new Date()
        };
    },
   	render(){
        return <div>
            <SinglePicker
                type={'week'}
                value={this.state.date}
                onChange={date=>this.setState({date:date})}
            />
            
            <RangePicker
                type={'date'}
                style={{marginTop:300}}
                from={this.state.from}
                to={this.state.to}
                onChange={(from,to)=>this.setState({from:from,to:to})}
            />

            
            <DatePanel
                type={'month'}
                style={{marginTop:300}}
                value={this.state.date}
                position={'from'}
                onChange={value=>this.setState({date:value})}
                onCancel={()=>null}
                onConfirm={()=>null}
            />
        </div>
    }
});

dom.render(<Me />, document.getElementById('container'));
```