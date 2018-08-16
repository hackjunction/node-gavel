import React, { Component } from 'react';
import _ from 'lodash';
import './style.css';

class AnnotatorList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: false,
            loading: false,
            items: []
        };
    }

    componentDidMount() {
        this.getAnnotators();
    }

    getAnnotators() {
        this.setState(
            {
                loading: true,
                error: false
            },
            async () => {
                const response = await fetch('/api/annotators');
                const body = await response.json();

                if (response.status !== 200) {
                    this.setState({
                        error: true,
                        loading: false,
                        items: []
                    });
                } else {
                    this.setState({
                        error: false,
                        loading: false,
                        items: body.data
                    });
                }
            }
        );
    }

    renderAnnotators() {
        return _.map(this.state.items, annotator => {
            return (
                <div key={annotator._id}>
                    <p>{annotator.name + '  /  secret: ' + annotator.secret}</p>
                </div>
            );
        });
    }

    render() {
        return (
            <div className="AnnotatorList--wrapper">
                <h1 className="AnnotatorList--title">Annotators</h1>
                {this.renderAnnotators()}
            </div>
        );
    }
}

export default AnnotatorList;
