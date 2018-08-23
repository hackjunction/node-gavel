import React, { Component } from 'react';
import _ from 'lodash';
import './style.css';
import ReactTable from 'react-table';
import 'react-table/react-table.css'

class ProjectList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: false,
            loading: false,
            items: []
        };
    }

    componentDidMount() {
        this.getProjects();
    }

    getProjects() {
        this.setState(
            {
                loading: true,
                error: false
            },
            async () => {
                const response = await fetch('/api/items');
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

    // renderProjects() {
    //     return _.map(this.state.items, project => {
    //         return (
    //             <div key={project._id}>
    //                 <p>{project.name + '  /  id: ' + project._id}</p>
    //             </div>
    //         );
    //     });
    // }

    

    render() {
        const columns = [{
            Header: "Name",
            accessor: "name",
            className: "mid",
            filterable: true,
            filterMethod: (filter, row) => row[filter.id].toLowerCase().includes(filter.value)
        }, {
            Header: "Description",
            accessor: "description",
            className: "mid"
        }, {
            Header: "Location",
            accessor: "location",
            className: "mid"
        }, {
            Header: "Average",
            accessor: "mu",
            className: "mid"
        }, {
            Header: "Std. deviation",
            accessor: "sigma_sq",
            className: "mid"
        }]

        return (
            <div className="ProjectList--wrapper">
                <h1 className="ProjectList--title">Projects</h1>
                <ReactTable data = {this.state.items} columns = {columns} />
            </div>
        );
    }
}

export default ProjectList;
