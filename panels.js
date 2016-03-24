import React from 'react';
import styles from './index.css';




function copy(value,year=0,month=0,date=0){ 
    return new Date(
        value.getFullYear() + year, 
        value.getMonth() + month, 
        value.getDate() + date
    );
}
const monthes = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];

export default React.createClass({
    getInitialState() {
        return {currentView: copy(this.props.value)};
    },
    componentWillReceiveProps(nextProps) {
        if (nextProps.value.getTime() !== this.props.value.getTime())
            this.setState({ currentView: copy(nextProps.value) });
    },
    adj(year, month = 0, date = 0) {
        this.setState({ currentView: copy(this.state.currentView, year, month,date)});
    },
    select(e) {
        return this.available(e) && this.props.onChange(new Date(e));
    },
    today(){
        this.setState({ currentView: copy(new Date()) });
        this.props.onChange(new Date());
    },

    render() {
        return {
            'date':this.renderDay,
            'week':this.renderWeek,
            'month':this.renderMonth,
            'year':this.renderYear
        }[this.props.type]();
    },
    available(date){
        return !this.props.available || this.props.available(date,this.props.type);
    },
    getPanelClassName(){
        return styles.panel + ' ' + styles[this.props.position || 'single'];
    },
    getDiv(current,today,title,width=30){
        return <div
            key={current.getTime()} 
            onClick={()=>this.select(current)} 
            style={{width:width}}
            className={
                (today == current.getTime()? styles.highLight:'') 
                + ' ' + (this.available(current) ? styles.available:'')
            }
        >
            {title}
        </div>;
    },
    getButtons(todayTitle){
        return <div className = {styles.buttons} >
            <div onClick={this.props.onCancel} className={styles.cancelButton}>取消</div> 
            <div onClick={this.today} className={styles.todayButton}>{todayTitle}</div>
            <div onClick={this.props.onConfirm} className={styles.confirmButton}>确定</div>
        </div>;
    },
    renderDay() {
        const year = this.state.currentView.getFullYear();
        const month = this.state.currentView.getMonth();

        var dates = [];
        for(let i=0;i<31;i++)
            dates[i] = new Date(year, month,  i);
        dates = dates.filter(o => o.getMonth() === month)


        var blanks = [];
        for(let i=(new Date(year, month, 1).getDay() + 6) % 7;i>0;i--)blanks[i-1]=i;

        const currentValue = copy(this.props.value).getTime();

        return <div className={this.getPanelClassName()} style={Object.assign({width:212},this.props.style)}>
            <div className={styles.title}>
                <span className={styles.titleMiddle}>{year}年 {monthes[month]}月</span>
                <span onClick={o=>this.adj(-1,0)} className={styles.fastbackward}></span>
                <span onClick={o=>this.adj(0,-1)} className={styles.backward}></span>
                <span onClick={o=>this.adj(0,1)} className={styles.forward}></span>
                <span onClick={o=>this.adj(1,0)} className={styles.fastforward}></span>
            </div>
            <div className={styles.content} style={{height:211}}>
                {['一','二','三','四','五','六','日'].map(o=><div key={o}>{o}</div>)}           
                {blanks.map(o=><div key={'b' + o} style={{color:'rgba(0,0,0,0)'}}>{o}</div>)}
                {dates.map((o,i)=>this.getDiv(o,currentValue,i+1))}
            </div>
            {this.getButtons('今天')}
        </div>;
    },

    renderWeek() {
        const getThisWeekDay = o=>new Date(o.getFullYear(),o.getMonth(),o.getDate() + 4 - o.getDay());      
        const year = getThisWeekDay(this.state.currentView).getFullYear();
        const currentValue = getThisWeekDay(this.props.value).getTime();

        var firstThur = getThisWeekDay(new Date(year,0,1));
        if(firstThur.getFullYear() < year){
            firstThur.setDate(firstThur.getDate() + 7);
        }

        var weeks = [];
        for(let i=0;i<53;i++){
            let w = new Date(year,0,firstThur.getDate()+7*i);
            if(w.getFullYear()==year)
                weeks[i] = w;
        }

        return <div className={this.getPanelClassName()} style={Object.assign({width:242},this.props.style)}>
            <div className={styles.title}>
                <span className={styles.titleMiddle}>{year}年</span>
                <span onClick={o=>this.adj(-1)} className={styles.fastbackward}></span>
                <span onClick={o=>this.adj(1)} className={styles.fastforward}></span>
            </div>
            <div className={styles.content}>
                {weeks.map((o,i)=>this.getDiv(o,currentValue,i+1))}
            </div>
            {this.getButtons('本周')}
        </div>;
    },

    renderMonth() {
        const year = this.state.currentView.getFullYear();

        var dates = [];
        for(let i=0;i<12;i++)dates[i] = new Date(year,i,1);
        
        const currentValue = new Date(this.props.value.getFullYear(),this.props.value.getMonth(),1).getTime();

        return <div className={this.getPanelClassName()} style={Object.assign({width:242},this.props.style)}>
            <div className={styles.title}>
                <span className={styles.titleMiddle}>{year}年</span>
                <span onClick={o=>this.adj(-1)} className={styles.fastbackward}></span>
                <span onClick={o=>this.adj(1)} className={styles.fastforward}></span>
            </div>
            <div className={styles.content}>
                {dates.map(o=>this.getDiv(o,currentValue,monthes[o.getMonth()]+"月",60))}
            </div>
            {this.getButtons('本月')}
        </div>;
    },


    renderYear() {
        var beginYear = Math.floor((this.state.currentView.getFullYear()-1)/20)*20+1;
        var years = [];
        for(let i=0;i<20;i++){
            years[i]= new Date(beginYear + i,0,1);
        }

        var currentValue = new Date(this.props.value.getFullYear(),0,1).getTime();

        return <div className={this.getPanelClassName()} style={Object.assign({width:242},this.props.style)}>
            <div className={styles.title}>
                <span className={styles.titleMiddle}>{beginYear}年 - {beginYear+20}年</span>
                <span onClick={o=>this.adj(-20)} className={styles.fastbackward}></span>
                <span onClick={o=>this.adj(20)} className={styles.fastforward}></span>
            </div>
            <div className={styles.content}>
                {years.map(o=>this.getDiv(o,currentValue,o.getFullYear(),60))}
            </div>
            {this.getButtons('今年')}
        </div>;
    }
});

