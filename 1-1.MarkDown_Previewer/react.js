/**
 * Created by zyx on 4/16/17.
 */
var InputArea = React.createClass({
    propTypes: {
        updateInput: React.PropTypes.func,
        checkKey: React.PropTypes.func,
        initialText: React.PropTypes.string
    },
    getInitialState: function(){
        return {currentText: "This is the starting text created in the child component"}
    },
    render: function() {

        return (
            <div className="col-md-6">
            <textarea className="textEntry"  onChange={this.props.updateInput} value={this.props.currentText}> </textarea>
        </div>
        )
    }
})

var PreviewArea = React.createClass({
    markup(content) {
        const markup = marked(content);
        return {__html: markup};
    },
    propTypes: {
        previewText: React.PropTypes.string
    },
    render: function() {
        return (
            <div className="col-md-6">
            <div className = "textPreview">
            {
            <span dangerouslySetInnerHTML={this.markup(this.props.previewText)} />
    }
        </div>
        </div>
        )
    }
})

var MarkdownBoard = React.createClass({
    getInitialState : function(){
        return {
            currentText : '# Heading\n\n## Sub-heading\n\n### Another deeper heading\n\nText attributes _italic_, *italic*, __bold__, **bold**, `monospace`.\n\nHorizontal rule:\n\n---\n\nBullet list:\n* apples\n* oranges\n* pears\n\nNumbered list:\n1. apples\n2. oranges\n3. pears\n\nA [link](http://example.com).'
        }
    },
    handleChildInput: function(e){
        this.setState({currentText: e.target.value})
        console.log("Updating text"+ this.state.currentText)
        //this.handleChildOutput()
        {/*TO DO*/}
    },
    handleKeyDown: function(e) {
        //Attempting to create a newline character in the string passed to preview area
        //Enter key does not create a newline automatically in this scenario
        //But keycode can tell us if the enter key is pressed when using onKeyDown event
        console.log("Key Code: " + e.keyCode)
        if (e.keyCode == 13 ) {
            console.log("Enter Key pressed")

            //Attempt to update the state of the text area that gets passed to preview
            //var oldState = this.state.currentText
            var newState = oldState + "added this!"

            //this logs correctly, but preview does not respect the line break

            this.setState({currentText: newState })
        }
    },


    render: function () {
        return (
            <div className="row text-center">
            <InputArea  currentText={this.state.currentText}  updateInput={this.handleChildInput.bind(this)} checkKey={this.handleKeyDown.bind(this) } />
        <PreviewArea previewText={this.state.currentText}  />
        </div>
        )
    }
})

ReactDOM.render(
<div className="container-fluid">
    <MarkdownBoard />
    </div>,
    document.getElementById('app')
)