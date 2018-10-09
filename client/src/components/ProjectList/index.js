import React, { Component } from 'react';
import _ from 'lodash';
import './style.css';
import ReactTable from 'react-table';
import 'react-table/react-table.css'

const testItem = {
    "name": "testItem1",
    "location": "A1",
    "description": "This is a nice little test item for testing purposes, do feel free to ignore it",
    "mu": 1.952325,
    "sigma_sq": 0.72564,
    "active": true,
    "prioritized": false,
}

class ProjectList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: false,
            loading: false,
            items: [testItem]
        };
    }

    // componentDidMount() {
    //     this.getProjects();
    // }

    // getProjects() {
    //     this.setState(
    //         {
    //             loading: true,
    //             error: false
    //         },
    //         async () => {
    //             const response = await fetch('/api/items');
    //             const body = await response.json();

    //             if (response.status !== 200) {
    //                 this.setState({
    //                     error: true,
    //                     loading: false,
    //                     items: []
    //                 });
    //             } else {
    //                 this.setState({
    //                     error: false,
    //                     loading: false,
    //                     items: body.data
    //                 });
    //             }
    //         }
    //     );
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
            className: "center"
        }, {
            Header: "Location",
            accessor: "location",
            className: "center"
        }, {
            Header: "Average",
            accessor: "mu",
            className: "center"
        }, {
            Header: "Std. deviation",
            accessor: "sigma_sq",
            className: "center"
        }, {
            Header: "Prioritize",
            accessor: "prioritized",
            className: "center",
            Cell: row => (
                <button /*TODO: LISÄÄ TOIMINNALLISUUS */> {row.value  ? 'Stop prioritizing' : 'Prioritize'} </button>
            )
        }, {
            Header:"Enable/Disable",
            accessor:"active",
            Cell: row => (
                <button /*TODO: LISÄÄ CHANGESTATUS*/>{row.value ? 'Disable project': 'Enable project'}</button>
            )
        }]

        return (
            <div className="ProjectList--wrapper">
                <h1 className="ProjectList--title">Projects</h1>
                <p>Total  projects: {this.state.items.length}</p>
                <ReactTable className="ProjectList" data = {this.state.items} columns = {columns} />
            </div>
        );
    }
}

export default ProjectList;
