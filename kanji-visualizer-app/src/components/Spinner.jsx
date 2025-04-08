import React from 'react';
import PropTypes from 'prop-types';
import Lottie from "lottie-react";
// Make sure this path is correct relative to this file
import loadingAnimation from '../assets/animations/loading_spinner.json';

function Spinner({ size = 'md' }) {
    const sizeMap = { sm: '50px', md: '80px', lg: '120px' };
    const style = {
        width: sizeMap[size] || sizeMap['md'],
        height: sizeMap[size] || sizeMap['md'],
        margin: 'auto',
    };

    return (
        <div role="status" aria-live="polite">
            <Lottie animationData={loadingAnimation} loop={true} style={style} />
            <span className="sr-only">Loading...</span>
        </div>
    );
}
Spinner.propTypes = { size: PropTypes.oneOf(['sm', 'md', 'lg']) };

export default Spinner;