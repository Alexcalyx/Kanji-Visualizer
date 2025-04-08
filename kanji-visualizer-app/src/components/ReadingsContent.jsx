import React from 'react';
import PropTypes from 'prop-types';

function ReadingsContent({ readingsOn, readingsKun }) {
    const hasOn = readingsOn && readingsOn.length > 0;
    const hasKun = readingsKun && readingsKun.length > 0;

    return (
        <div className="space-y-3 text-sm sm:text-base">
            <div>
                <span className="font-medium text-neon-magenta dark:text-neon-magenta mr-3 w-[70px] inline-block flex-shrink-0">
                    On'yomi:
                </span>
                <span className="font-mono break-words"> {/* Allow long readings to wrap */}
                    {hasOn ? readingsOn.join(', ') : <span className="text-subtle-light dark:text-subtle-dark">N/A</span>}
                </span>
            </div>
            <div>
                <span className="font-medium text-neon-cyan dark:text-neon-cyan mr-3 w-[70px] inline-block flex-shrink-0">
                    Kun'yomi:
                </span>
                 <span className="font-mono break-words">
                    {hasKun ? readingsKun.join(', ') : <span className="text-subtle-light dark:text-subtle-dark">N/A</span>}
                </span>
            </div>
        </div>
    );
}

ReadingsContent.propTypes = {
    readingsOn: PropTypes.arrayOf(PropTypes.string),
    readingsKun: PropTypes.arrayOf(PropTypes.string)
};

export default ReadingsContent;