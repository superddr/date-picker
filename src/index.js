import React from 'react';
import styles from './index.css';
import Panel from './panels.js';


function copyDate(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
function getWeek(value){
    value = getThisWeekDay(value);
    return Math.floor((value.getTime() - new Date(value.getFullYear(),0,1).getTime()) / 1000 / 60 / 60 / 24 / 7) + 1;
}

function getThisWeekDay(date){
    return new Date(date.getFullYear(),date.getMonth(),date.getDate() + 4 - date.getDay());
}

export default Panel;

export var SinglePicker = React.createClass({
    getInitialState(){
        return { open: false, view: copyDate(this.props.value) };
    },
    toggle() {
        this.setState({ open: !this.state.open, view:copyDate(this.props.value) });
    },
    onChange() {
        this.props.onChange(this.state.view);
        this.setState({open:false});
    },
    
    adj(year,month,date) {
        this.props.onChange(new Date(this.props.value.getFullYear()+year, this.props.value.getMonth()+month, this.props.value.getDate() + date));
    },

    componentWillReceiveProps(nextProps) {
        if(nextProps.value.getTime() !== this.props.value.getTime())
            this.setState({view: copyDate(nextProps.value)});
    },
    render(){
        var value = this.props.value;
        var year = (this.props.type==='week' ? getThisWeekDay(value) : value).getFullYear(),
            month = value.getMonth() + 1,
            date = value.getDate(),
            week = getWeek(value);

        var params = {
            date: {width:215,left:211,height:271,adj:[0,0,1],title:year + '年 ' + month + '月' + date + '日'},
            week: {width:205,left:241,height:270,adj:[0,0,7],title:year + '年 第' + week + '周'},
            month:{width:188,left:241,height:150,adj:[0,1,0],title:year + '年 ' + month + '月'},
            year: {width:158,left:241,height:211,adj:[1,0,0],title:year + '年 '}
        }[this.props.type];
        

        return <div id={styles.container} style={Object.assign({width:params.width}, this.props.style)}>
            <div onClick={this.adj.bind(this,...params.adj.map(o=>o*-1))} className={styles.left} />
            <div onClick={this.toggle}  className={styles.middle}>
                {params.title}
                <span className={styles.calendar} />
            </div>
            <div onClick={this.adj.bind(this,...params.adj)} className={styles.right} />
            
            {this.state.open && <div className={styles.bigPanel} style={{width:params.left,height:params.height}}>
                <Panel 
                    type={this.props.type}
                    position={'single'}
                    value={this.state.view} 
                    onChange={o=>this.setState({view:copyDate(o)})} 
                    onCancel={this.toggle}
                    onConfirm={this.onChange}
                    verify={this.props.verify}
                />
            </div>}
        </div>;
    }
});



export var RangePicker = React.createClass({
    getInitialState() {
        return {type:'year',open: false,from: copyDate(this.props.from),to:copyDate(this.props.to)};
    },
    toggle() {
        this.setState({
            open: !this.state.open,
            from: copyDate(this.props.from),
            to:copyDate(this.props.to)
        });
    },
    onChange() {
        var from = this.state.from;
        var to = this.state.to;
        if (from.getTime() > to.getTime()) {
            !this.props.onError && alert('起始时间不能大于结束时间哦');
            return;
        }
        this.props.onChange(from, to);
        this.setState({open: false});
    },
    fromToday() {
        this.setState({ from: copyDate(new Date()) });
    },
    toToday(){
        this.setState({ to: copyDate(new Date()) });
    },
    componentWillReceiveProps(nextProps) {
        if (nextProps.from.getTime() !== this.props.from.getTime())
            this.setState({from: nextProps.from});


        if(nextProps.to.getTime() !== this.props.to.getTime())
            this.setState({to:nextProps.to});

    },
    render() {
        var type = this.props.type;

        var from = this.props.from;
        var year =  (type==='week' ? getThisWeekDay(from):from).getFullYear(),
            month = from.getMonth() + 1;

        var to = this.props.to;
        var toyear = (type==='week' ? getThisWeekDay(to):to).getFullYear(), 
            tomonth = to.getMonth() + 1;

        var params = {
            date:{width:340,left:211,height:271,title:year + '年 ' + month + '月' + from.getDate() + '日 ~ ' + toyear + '年 ' + tomonth + '月' + to.getDate() + '日'},
            week:{width:320,left:241,height:270,title:year + '年 第' + getWeek(from) + '周 ~ '+ toyear + '年 第' +  getWeek(to) + '周'},
            month:{width:290,left:241,height:150,title:year + '年 ' + month + '月 ~ ' + toyear + '年 ' + tomonth + '月'},
            year:{width:220,left:241,height:211,title:year + '年 ~ ' + toyear + '年'}
        }[type];

        return <div id={styles.container} style={Object.assign({width:340},this.props.style)} >
            <div onClick={this.toggle} className={styles.middle}>
                {params.title}
                <span className={styles.calendar} />
            </div>          

            {this.state.open && <div className={styles.bigPanel} style={{width:params.left*2,height:params.height}}>
                <Panel 
                    type={type} 
                    value={this.state.from} 
                    onChange={o=>this.setState({from:copyDate(o)})} 
                    onCancel={this.toggle}
                    onConfirm={this.onChange}
                    position={'from'}
                    style={{left:-1,top:0}}
                    verify={this.props.verify}
                />

                <Panel 
                    type={type} 
                    value={this.state.to} 
                    onChange={o=>this.setState({to:copyDate(o)})} 
                    onCancel={this.toggle}
                    onConfirm={this.onChange}
                    position={'to'}
                    style={{left:params.left-1,top:0,borderLeftWidth:1}}
                    verify={this.props.verify}
                />
            </div>}
        </div>;
    }
});
