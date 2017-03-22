import React from 'react'
import { Link } from 'react-router'

const games = [
    {
        link: '/jump',
        title: 'Jump or Die',
        description: 'Press once to jump, twice to block. Do not die.',
    },
    {
        link: '/tuner',
        title: 'Guitar Tuner',
        description: 'Analyse the pitch from a microphone and compare with the guitar strings',
    }
]
export const GameList = () => {
    return (
        <div>
            <h1 className="pmd-display3" style={style.title}>
                LoopED
                <p className="lead">Applications for a strip led</p>
            </h1>
            {games.map(({ link, title, description }, i) => (
                <div className="list-group pmd-z-depth pmd-card-list" key={i}>
                    <Link to={link} className="list-group-item">
                        <h3 className="list-group-item-heading">{title}</h3>
                        <p className="list-group-item-text">{description}</p>
                    </Link>
                </div>
            ))}
            <footer style={style.footer}>
                <div className="container-fluid">
                    <ul className="list-unstyled list-inline">
                        <li>
                            <span className="pmd-card-subtitle-text">
                                Made by <a href="https://twitter.com/vied12">Edouard</a>
                            </span>
                            <h3 className="pmd-card-subtitle-text">
                                Licensed under
                                <a href="https://opensource.org/licenses/MIT" target="_blank"> MIT license.</a>
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
