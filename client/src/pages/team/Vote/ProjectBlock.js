import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ProjectBlock extends Component {
    static propTypes = {
        project: PropTypes.object.isRequired,
        isCurrent: PropTypes.bool.isRequired,
        onSkip: PropTypes.func,
        parentLoading: PropTypes.bool
    };

    render() {
        const { isCurrent, project, parentLoading } = this.props;

        return (
            <div className={isCurrent ? 'Vote--Project current' : 'Vote--Project'}>
                <div className="Vote--Project_header">
                    <p className="Vote--Project_header-label">{isCurrent ? 'Current:' : 'Previous:'}</p>
                    <p className="Vote--Project_header-name">{project.name}</p>
                    <p className="Vote--Project_location">{project.location}</p>
                </div>
                <p className="Vote--Project_description">{project.punchline}</p>
                {isCurrent ? (
                    <span className="Vote--Project_skip" onClick={!parentLoading ? this.props.onSkip : null}>
                        I can't find this project
                    </span>
                ) : null}
            </div>
        );
    }
}

export default ProjectBlock;
