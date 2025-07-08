// Centralized style system for consistent theming and responsive design

// Color palette
export const colors = {
  primary: {
    neon: "text-primary-neon",
    dark: "text-primary-dark",
    purple: {
      50: "bg-purple-50",
      100: "bg-purple-100",
      200: "bg-purple-200",
      400: "bg-purple-400",
      500: "bg-purple-500",
      600: "bg-purple-600",
      700: "bg-purple-700",
    },
  },
  slate: {
    50: "bg-slate-50",
    100: "bg-slate-100",
    200: "bg-slate-200",
    300: "border-slate-300",
    400: "border-slate-400",
    500: "text-slate-500",
    600: "text-slate-600",
    700: "text-slate-700",
    800: "text-slate-800",
  },
  gray: {
    50: "bg-gray-50",
    100: "bg-gray-100",
    200: "border-gray-200",
    300: "border-gray-300",
    400: "text-gray-400",
    500: "text-gray-500",
    600: "text-gray-600",
    700: "text-gray-700",
  },
};

// Typography
export const typography = {
  heading: {
    base: "font-heading",
    bold: "font-heading font-bold",
    semibold: "font-heading font-semibold",
  },
  display: "font-display",
  sizes: {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl",
    "5xl": "text-5xl",
    "6xl": "text-6xl",
  },
  responsive: {
    sm: "text-sm sm:text-base",
    base: "text-base md:text-lg",
    lg: "text-lg sm:text-xl",
    xl: "text-xl sm:text-2xl",
    "2xl": "text-2xl sm:text-3xl",
    "3xl": "text-3xl sm:text-4xl",
    "4xl": "text-4xl sm:text-5xl",
    "5xl": "text-5xl sm:text-6xl",
  },
};

// Spacing
export const spacing = {
  padding: {
    xs: "p-1",
    sm: "p-2",
    base: "p-4",
    lg: "p-6",
    xl: "p-8",
    responsive: "p-4 sm:p-6 lg:p-8",
  },
  margin: {
    xs: "m-1",
    sm: "m-2",
    base: "m-4",
    lg: "m-6",
    xl: "m-8",
  },
  gap: {
    xs: "gap-1",
    sm: "gap-2",
    base: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  },
};

// Layout
export const layout = {
  container: "container mx-auto",
  flex: {
    center: "flex items-center justify-center",
    between: "flex items-center justify-between",
    start: "flex items-center justify-start",
    end: "flex items-center justify-end",
    col: "flex flex-col",
    row: "flex flex-row",
  },
  grid: {
    responsive: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    auto: "grid grid-cols-[repeat(auto-fill,minmax(3rem,1fr))]",
  },
};

// Interactive elements
export const interactive = {
  button: {
    base: "px-4 py-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
    primary:
      "bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-400",
    secondary:
      "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 focus:ring-gray-200",
    success: "bg-green-500 text-white hover:bg-green-600 focus:ring-green-400",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400",
  },
  link: {
    base: "transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-neon focus:ring-offset-2",
    nav: "text-sm sm:text-base font-heading px-2 py-1 rounded-md whitespace-nowrap",
    navDefault:
      "text-slate-600 hover:text-primary-neon hover:bg-purple-500/10 focus:ring-offset-white",
    navActive:
      "bg-purple-100 text-primary-dark font-semibold focus:ring-offset-purple-100",
  },
  card: {
    base: "rounded-xl border-2 transition-all duration-300 ease-in-out shadow-lg backdrop-blur-sm relative overflow-hidden",
    default:
      "bg-white/30 border-slate-300/50 hover:bg-sky-50/50 hover:border-sky-300",
    learned: "!bg-purple-100/50 !border-purple-400",
  },
};

// Responsive utilities
export const responsive = {
  text: {
    sm: "text-sm sm:text-base",
    base: "text-base md:text-lg",
    lg: "text-lg sm:text-xl",
    xl: "text-xl sm:text-2xl",
    "2xl": "text-2xl sm:text-3xl",
    "3xl": "text-3xl sm:text-4xl",
    "4xl": "text-4xl sm:text-5xl",
    "5xl": "text-5xl sm:text-6xl",
  },
  padding: {
    base: "p-4 sm:p-6 lg:p-8",
    vertical: "py-8 sm:py-12",
  },
  sizing: {
    kanji: "w-32 h-32 lg:w-52 lg:h-52",
    icon: "w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7",
  },
};

// Animation variants
export const animations = {
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay: 0.1 },
  },
  slideIn: {
    initial: { x: "100%" },
    animate: { x: 0 },
    exit: { x: "100%" },
    transition: { type: "tween", duration: 0.3, ease: "easeInOut" },
  },
  stagger: {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.02, delayChildren: 0.1 },
      },
    },
    item: {
      hidden: { y: 20, opacity: 0, scale: 0.95 },
      visible: {
        y: 0,
        opacity: 1,
        scale: 1,
        transition: { type: "spring", stiffness: 150, damping: 20 },
      },
    },
  },
};

// Utility function to combine classes
export const cn = (...classes) => classes.filter(Boolean).join(" ");

// Pre-composed style combinations
export const styles = {
  // Navigation
  nav: {
    container: cn(
      layout.container,
      "flex justify-between items-center px-4 sm:px-6"
    ),
    logo: cn(
      typography.heading.bold,
      colors.primary.neon,
      "transition-colors flex flex-col items-start sm:flex-row sm:items-center sm:gap-1 hover:brightness-125"
    ),
    link: cn(interactive.link.base, interactive.link.nav),
    linkDefault: cn(interactive.link.navDefault, interactive.link.nav),
    linkActive: cn(interactive.link.navActive, interactive.link.nav),
  },

  // Cards
  card: {
    base: cn(interactive.card.base, interactive.card.default),
    learned: cn(interactive.card.base, interactive.card.learned),
  },

  // Buttons
  button: {
    primary: cn(interactive.button.base, interactive.button.primary),
    secondary: cn(interactive.button.base, interactive.button.secondary),
    success: cn(interactive.button.base, interactive.button.success),
    danger: cn(interactive.button.base, interactive.button.danger),
  },

  // Layout
  page: cn(
    responsive.padding.base,
    "max-w-7xl mx-auto font-sans text-gray-800 bg-white"
  ),
  section: cn("bg-white/70 rounded-xl shadow p-6 mb-8"),

  // Loading
  loading: cn("flex flex-col items-center justify-center min-h-[40vh]"),
  spinner: cn(
    "animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mx-auto mb-4"
  ),
};
