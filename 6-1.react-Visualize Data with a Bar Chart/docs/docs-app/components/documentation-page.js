import React, {Component} from 'react';
import {injectExamplesIntoHtml, convertMarkdownToReact} from './utils';

class DocumentationPage extends Component {
  componentDidMount() {
    this.props.loadSinglePage(this.props.route.content);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.route.content.markdown !== this.props.route.content.markdown) {
      this.refs.documentionContainer.scrollTop = 0;
      nextProps.loadSinglePage(nextProps.route.content);
    }
  }

  render() {
    const {markdownPages, route} = this.props;
    const content = markdownPages.get(route.content.markdown, '');

    return (
      <div className="documentation-page f fg">
        <div className="markdown" ref="documentionContainer">
          {injectExamplesIntoHtml(convertMarkdownToReact(content))}
        </div>
      </div>
    );
  }
}

export default DocumentationPage;
