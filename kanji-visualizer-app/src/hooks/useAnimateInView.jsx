import { useInView } from 'react-intersection-observer';

function useAnimateInView(threshold = 0.1, triggerOnce = true) {
    const { ref, inView } = useInView({
        triggerOnce: triggerOnce,
        threshold: threshold,
    });

    const animation = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    };

    return [ref, animation, inView];
}

export default useAnimateInView;