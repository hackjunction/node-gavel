import React, { Component } from 'react';
import PropTypes from 'prop-types';

import API from '../../../services/api';

class ProjectBlock extends Component {
    static propTypes = {
        projectId: PropTypes.string.isRequired,
        isCurrent: PropTypes.bool.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            error: false,
            project: null,
            expanded: this.props.isCurrent
        };

        this.toggleExpand = this.toggleExpand.bind(this);
    }

    componentDidMount() {
        this.updateProject();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.projectId !== this.props.projectId) {
            this.updateProject();
        }
    }

    toggleExpand() {
        this.setState({
            expanded: !this.state.expanded
        });
    }

    updateProject() {
        this.setState(
            {
                loading: true,
                error: false
            },
            () => {
                API.getProjectById(this.props.projectId)
                    .then(project => {
                        console.log('PROJECT', project);
                        this.setState({
                            project,
                            loading: false,
                            error: false
                        });
                    })
                    .catch(err => {
                        console.log('ERROR', err);
                        this.setState({
                            loading: false,
                            error: true
                        });
                    });
            }
        );
    }

    renderDescription() {
        const { expanded, project } = this.state;
        if (expanded) {
            return (
                <p className="Vote--Project_description">
                    {project.description}
                    <span className="Vote--Project_description-expand" onClick={this.toggleExpand}>
                        Collapse
                    </span>
                </p>
            );
        } else {
            return (
                <p className="Vote--Project_description">
                    {project.description.slice(0, 60)}
                    {'...'}
                    <span className="Vote--Project_description-expand" onClick={this.toggleExpand}>
                        Expand
                    </span>
                </p>
            );
        }
    }

    render() {
        const { loading, error, project } = this.state;
        const { isCurrent } = this.props;

        if (loading) {
            return (
                <div className="Vote--Project">
                    <h4>Loading</h4>
                </div>
            );
        }

        if (error) {
            return (
                <div className="Vote--Project">
                    <h4>Error, please reload the page</h4>
                </div>
            );
        }

        return (
            <div className={isCurrent ? 'Vote--Project current' : 'Vote--Project'}>
                <div className="Vote--Project_header">
                    <p className="Vote--Project_header-label">{isCurrent ? 'Current:' : 'Previous:'}</p>
                    <p className="Vote--Project_header-name">{project.name}</p>
                    <p className="Vote--Project_location">
                        {'('}
                        {project.location}
                        {')'}
                    </p>
                </div>
                {this.renderDescription()}
            </div>
        );
    }
}

export default ProjectBlock;
