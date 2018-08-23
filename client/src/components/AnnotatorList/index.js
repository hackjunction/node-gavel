import React, { Component } from 'react';
import _ from 'lodash';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import './style.css';


class AnnotatorLink extends Component {
    render()
    {
        return (
            <a href = '/id/{this.props.name}'>Show more...</a>
        )
    }
}

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

    // renderAnnotators() {
    //     return _.map(this.state.items, annotator => {
    //         return (
    //             <div key={annotator._id}>
    //                 <p>{annotator.name + '  /  secret: ' + annotator.secret}</p>
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
            Header: "Secret",
            accessor: "secret",
            className: "mid"
        }, {
            Header: "Email",
            accessor: "email",
            className: "mid"
        }, {
            Header: "Next project",
            accessor: "next",
            className: "mid"
        }, {
            Header: "Team ID",
            accessor: "teamId",
            className: "mid"
        }, {
            Header: "Alpha",
            accessor: "alpha",
            className: "mid"
        }, {
            Header: "Beta",
            accessor: "beta",
            className: "mid"
        }]
        return (
            <div className="AnnotatorList--wrapper">
                <h1 className="AnnotatorList--title">Annotators</h1>
                <ReactTable 
                    data = {this.state.items} 
                    columns = {columns}
                />
            </div>
        );
    }
}

export default AnnotatorList;
