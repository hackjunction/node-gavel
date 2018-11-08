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
            project: null
        };
    }

    componentDidMount() {
        this.updateProject();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.projectId !== this.props.projectId) {
            this.updateProject();
        }
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
            <div className={this.props.isCurrent ? 'Vote--Project' : 'Vote--Project current'}>
                <div className="Vote--Project_header">
                    <p className="Vote--Proejct_header-label">{isCurrent ? 'Current:' : 'Previous:'}</p>
                    <p className="Vote--Project_header-name">{project.name}</p>
                </div>
                <p className="Vote--Project_location">{project.location}</p>
                <p className="Vote--Project_description">{project.description}</p>
            </div>
        );
    }
}

export default ProjectBlock;
