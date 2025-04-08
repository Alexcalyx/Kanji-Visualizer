import React, { useCallback, useMemo, useContext } from 'react';
import Particles from "@tsparticles/react";
import { loadFull } from "tsparticles"; // loads tsparticles instance (engine)
import { ThemeContext } from '../contexts/ThemeContext'; // Update path

function ParticlesBackground() {
    const { theme } = useContext(ThemeContext);

    const particlesInit = useCallback(async (engine) => {
        // console.log(engine);
        // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
        // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
        // starting from v2 you can add only the features you need reducing the bundle size
        await loadFull(engine);
    }, []);

    // const particlesLoaded = useCallback(async (container) => {
    //     await console.log(container);
    // }, []);

    const particleOptions = useMemo(() => ({
        // background: { // Let CSS handle the main background
        //     color: { value: 'transparent' },
        // },
        fullScreen: { enable: true, zIndex: -1 }, // Put particles behind everything
        fpsLimit: 60,
        interactivity: {
            events: {
                // onHover: { enable: true, mode: "repulse" }, // Optional: interaction on hover
                // onClick: { enable: true, mode: "push" }, // Optional: interaction on click
            },
            modes: {
                repulse: { distance: 100, duration: 0.4 },
                push: { particles_nb: 4 },
            },
        },
        particles: {
            color: {
                value: theme === 'light' ? ["#06b6d4", "#ec4899", "#84cc16"] : ["#00f0ff", "#ff00ff", "#39ff14"], // Use theme colors
                animation: {
                    enable: true,
                    speed: 20,
                    sync: true
                }
            },
            // links: { // Optional: links between particles
            //     color: theme === 'light' ? '#d1d5db' : '#4b5563',
            //     distance: 150,
            //     enable: true,
            //     opacity: 0.2,
            //     width: 1,
            // },
            collisions: { enable: false }, // Disable collisions for performance
            move: {
                direction: "none",
                enable: true,
                outModes: { default: "out" }, // Particles disappear when going out
                random: true, // Random directions
                speed: 0.5, // Very slow movement
                straight: false,
            },
            number: {
                density: { enable: true, area: 1000 }, // Adjust density
                value: 30, // Low number of particles
            },
            opacity: {
                value: { min: 0.1, max: 0.4 }, // Random opacity
                animation: {
                    enable: true,
                    speed: 0.5,
                    minimumValue: 0.1,
                    sync: false
                }
            },
            shape: { type: "circle" },
            size: {
                value: { min: 1, max: 3 }, // Small particles
                animation: {
                    enable: true,
                    speed: 2,
                    minimumValue: 1,
                    sync: false
                }
            },
        },
        detectRetina: true,
    }), [theme]); // Recreate options when theme changes

    return (
        <Particles
            id="tsparticles"
            init={particlesInit}
            // loaded={particlesLoaded} // Optional: callback after loaded
            options={particleOptions}
            // className="fixed top-0 left-0 w-full h-full z-[-1]" // Alternative styling if needed
        />
    );
}

export default ParticlesBackground;