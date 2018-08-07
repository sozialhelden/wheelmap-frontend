import React from 'react';
import { t } from 'c-3p';

class PluralDemo extends React.Component {
    constructor(props) {
        super(props);
        this.state = { count: 0 };
        this.countInc = this.countInc.bind(this);
    }
    countInc() {
        this.setState({ count: this.state.count + 1 });
    }
    render() {
        const categoryName = "wooo";
        const count = this.state.count;
        return (
            <div>
                <h3>{t`${categoryName} on Wheelmap`}</h3>
                <div>{t`${count} broken escalator`}</div>
                <div>{t`${ count } broken escalator`}</div>
                <div>{t`${count} diesen string gibt es nicht`}</div>
            </div>
        )
    }
}

export default PluralDemo;