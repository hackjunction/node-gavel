import React, { Component } from 'react';
import SubmitProjectTest from './SubmitProjectTest';
import AnnotatorNextTest from './AnnotatorNextTest';
import AnnotatorSkipTest from './AnnotatorSkipTest';
import './style.css';

class Test extends Component {
    render() {
        return (
            <div className="Test--wrapper">
                <SubmitProjectTest />
                <AnnotatorNextTest />
                <AnnotatorSkipTest />
            </div>
        );
    }
}

export default Test;
