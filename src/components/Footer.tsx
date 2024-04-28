import { FC } from 'react'

const Footer: FC = () => {

    return (
        <footer style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#1976d2',
            color: 'white'
        }} >
            <h4 style={{ fontFamily: 'Space Mono, monospace', color: '#fff', opacity: '1' }}>{"Copyright © "} {new Date().getFullYear() > 2024 ? '2024 - ' : ''}  {new Date().getFullYear()}  "Notes" by Angel Stoyanov.  All rights reserved.</h4>
        </footer>
    )
}

export default Footer;