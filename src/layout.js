/**
 * Created by hasee on 2017/3/5.
 */

// var notice = [{id: 1, text: "111111", time: "11:11"}, {id: 2, text: "2222", time: "22:22"}]
var InputText = React.createClass({
    getInitialState: function () {
        return {text: '', time: ''}
    },
    handleTextChange: function (e) {
        this.setState({text: e.target.value})

        // this.state.text= e.target.value
    },
    handleTimeChange: function (e) {
        this.setState({time: e.target.value})
        // this.state.time= e.target.value
    },
    handleAddNotice: function () {
        if (this.state.text != "" && this.state.time != "") {
            var data = {text: this.state.text, time: this.state.time};
            var oldData = window.localStorage.getItem("notice");
            window.localStorage.clear();
            if (oldData == undefined) {
                data.id = 0;
                window.localStorage.setItem("notice", JSON.stringify([data]));
            } else {
                var newData = JSON.parse(oldData);
                data.id = newData.length;
                newData = newData.concat(data);
                window.localStorage.setItem("notice", JSON.stringify(newData));
            }
            var temp = window.localStorage.getItem("notice");
            temp = JSON.parse(temp);
            // console.log("inAdd");
            // console.log(temp);
            this.props.addNote(temp);
            this.setState({text:'',time:''})
        }
        else {
            window.localStorage.clear();
        }
    },
    render: function () {
        return (
            <form className="inputForm">
                <textarea id="inputText" type="text" placeholder="add new notice..." value={this.state.text}
                          onChange={this.handleTextChange}
                />
                <textarea id="inputTime" type="text" placeholder="noticing time(e.g. 21:11)..." value={this.state.time}
                          onChange={this.handleTimeChange}/>
                <input id="addButton" type="button" value="Add" onClick={this.handleAddNotice}/>
            </form>
        )
    }
});
var TextList = React.createClass({
    getInitialState:function () {
        return {color:"ffffff",opacity:1};
    },
    handleDeleteNotice: function () {
        var list = window.localStorage.getItem("notice");
        if(list.length > 0) {
            list = JSON.parse(list);
            console.log(list);
            list.splice(this.props.index, 1);
            window.localStorage.setItem("notice", JSON.stringify(list));
            console.log("nextProps");
            console.log(this.props.index);
            console.log(list);
        }else {
            window.localStorage.clear();
            list =  [];
        }
        this.props.delete(list);
    },
    componentDidMount:function () {
        var self = this;
        var timer = setInterval((function () {
            console.log("into setInterval.."+self.props.notice.id.toString())
            var time = new Date();
            var hour = time.getHours();
            var minutes = time.getMinutes();
            var setedTime = self.props.notice.time.split(":");
            if(hour == setedTime[0] && minutes ==setedTime[1]){
                self.handleAlarm();
            }else if(hour > setedTime[0]||(hour == setedTime[0]&&minutes >setedTime[1])){
                clearInterval(timer);
            }else {
                // self.setState({color:"ffffff",opacity:1})
            }
        }),10000)
    },
    handleAlarm:function () {
        console.log("into handleAlarm..")
        var self = this;
        var opacity = 0;
        var timer = setInterval((function () {
            if(opacity<=1) {
                opacity +=0.1
            }else {
                opacity = 0;
            }
            self.setState({color:"#f00",opacity:opacity})
        }),200)
        setTimeout(function () {
            clearInterval(timer);
        },60000)
    },
    // shouldComponentUpdate:function () {
    //     var time = new Date();
    //     var hour = time.getHours();
    //     var minutes = time.getMinutes();
    //     var setedTime = this.props.notice.time.split(":");
    //     if(hour == setedTime[0] && minutes ==setedTime[1]) {
    //         return true;
    //     }else {
    //         this.setState({color:"ffffff",opacity:1})
    //         return false;
    //     }
    // },
    render: function () {
        var style ={
            color:this.state.color,
            opacity:this.state.opacity
        };
        return (
            <div className="listRow">
                <div className="textRow" id={this.props.notice.id} style={style}>
                    {this.props.notice.text}
                </div>
                <input className="buttonRow" type="button" value="checked" onClick={this.handleDeleteNotice}/>
            </div>
        )
    }
});
var Notificaiton = React.createClass({
    getInitialState:function () {
        // window.localStorage.clear();
        var a  = [];
        if(window.localStorage.getItem("notice") !== null){
            a = JSON.parse(window.localStorage.getItem("notice"))
        }
        // console.log(a);
        return ({noticeList:a});
    },
    handleDeleteList:function (list) {
        this.setState({noticeList: list});
    },
    handleListChange:function (nextProps) {
        this.setState({noticeList:nextProps});
    },
    render: function () {
        console.log("intextList");
        console.log(this.state.noticeList);
        var self = this;
        if(this.state.noticeList.length != 0){
            var list = this.state.noticeList.map(function (notice, i) {
                return (
                    <TextList notice={notice} index={i} delete={self.handleDeleteList}/>
                )
            })
        }else {
            var list = <p>There is nothing need to do!</p>
        }
        return (
            <div>
                <div className="inputDiv">
                    <InputText addNote={this.handleListChange}/>
                </div>
                <div className="textList">
                    {list}
                </div>
            </div>
        )
    }
})


ReactDOM.render(
    <Notificaiton />,
    document.getElementById("example")
);