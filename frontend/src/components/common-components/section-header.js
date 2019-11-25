import React from 'react';

export default class SectionHeader extends React.Component {
    render() {
        return (
            <div>
                <h2 className="mt-2">{this.props.children}</h2>
                <hr />
            </div>
        );
    }
}