import React from 'react'
import { Link } from 'react-router'

export const GameList = () => {
    return (
        <div>
            <h1 className="pmd-display3" style={style.title}>
                LoopED
                <p className="lead">Applications for a strip led</p>
            </h1>
            <div className="list-group pmd-z-depth pmd-card-list">
                <Link to="/jump" className="list-group-item ">
                    <h3 className="list-group-item-heading">Jump or Die</h3>
                    <p className="list-group-item-text">Press once to jump, twice to block. Do not die.</p>
                </Link>
            </div>
            <footer style={style.footer}>
                <div className="container-fluid">
                    <ul className="list-unstyled list-inline">
                        <li>
                            <span className="pmd-card-subtitle-text">
                                Made by <a href="https://twitter.com/vied12">Edouard</a>
                            </span>
                            <h3 className="pmd-card-subtitle-text">
                                Licensed under
                                <a href="https://opensource.org/licenses/MIT" target="_blank">MIT license.</a>
                            </h3>
                        </li>
                    </ul>
                </div>
            </footer>
        </div>
    )
}
const style = {
    title: { textAlign: 'center' },
    footer: { marginTop: 20 },
}
