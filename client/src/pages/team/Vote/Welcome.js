import React, { Component } from 'react';
import PropTypes from 'prop-types';
import loremIpsum from 'lorem-ipsum';
import './style.scss';
import SubmitButton from '../../../components/forms/SubmitButton';

class VoteWelcome extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        event: PropTypes.object.isRequired,
        onContinue: PropTypes.func.isRequired,
        loading: PropTypes.bool
    };

    render() {
        return (
            <div className="Vote">
                <h1 className="Vote--title">Welcome to voting for {this.props.event.name}</h1>
                <p className="Vote--subtitle">
                    <strong>Please read these instructions carefully before continuing. </strong>
                    {loremIpsum({
                        count: 10,
                        units: 'sentences',
                        sentenceLowerBound: 5,
                        sentenceUpperBound: 15,
                        paragraphLowerBound: 2,
                        paragraphUpperBound: 6,
                        format: 'plain'
                    })}
                </p>
                <SubmitButton text="I understand" onClick={this.props.onContinue} loading={this.props.loading} />
            </div>
        );
    }
}

export default VoteWelcome;
