import React from 'react';
import { Link } from 'react-router-dom';

function DropdownItem({ img, text, onClick, path }) {
    return (
        <li className='dropdownItem' onClick={onClick}>
            {/* Render the image only if img is provided */}
            {img && (
                <img src={img} alt={text} className="icon-size" />
            )}
            <Link to={path} className="menu-link">{text}</Link>
        </li>
    );
}

export default DropdownItem;
