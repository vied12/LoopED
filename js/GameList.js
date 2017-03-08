import React from 'react'
import { Link } from 'react-router'

export const GameList = () => {
    return (
        <div>
            <h1 className="pmd-display4" style={{ textAlign: 'center' }}>LoopED</h1>
            <div className="list-group pmd-z-depth pmd-card-list">
                <Link to="/jump" className="list-group-item ">
                    <h3 className="list-group-item-heading">Jump or Die</h3>
                    <p className="list-group-item-text">Press once to jump, twice to block. Do not die.</p>
                </Link>
                <div to="/about" className="list-group-item disabled">
                    <h3 className="list-group-item-heading">About this project</h3>
                    <p className="list-group-item-text">Made by <a href="https://twitter.com/vied12">Edouard</a></p>
                </div>
            </div>
        </div>
    )
}
