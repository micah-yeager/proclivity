import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import '@src/pages/components/styles'
import './index.scss'

console.log('popup script')

const root = document.querySelector('#root')

ReactDOM.render(<App />, root)
