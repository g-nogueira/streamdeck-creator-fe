import _ from "lodash";
import type { UIState } from "../models/UIState";
import { get, writable } from 'svelte/store';
import type { GradientStop, UserIconGradient } from "../models/UserIconGradient";

let emptyState: UIState = {
    styles: {
        glyphColor: '#38bdf8', // sky-400
        backgroundColor: '#0284c7', // sky-600
        labelColor: '#ffffff', // white
        label: 'Label Text',
        labelVisible: true,
        labelTypeface: 'VT323',
        iconScale: 1, // Scale factor for resizing the icon

        imgX: 0,
        imgY: 0,
        labelX: 0,
        labelY: 0,

        pngData: '',

        useGradient: false,
        gradient: null
    },

    /** The SVG string content of the icon */
    svgContent: '',
    /** The URL of the icon image */
    imageUrl: ''
};

/**
 * Injects the color into the SVG content
 * @param svgContent
 * @param color
 */
function injectColorIntoSvg(svgContent: string, color: string): string {
    if (typeof window === 'undefined') {
        console.error('Trying to use DomParser on the server side. Returning the SVG content as is.');
        return svgContent;
    }
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, 'image/svg+xml');
    const svgElement = doc.querySelector('svg');
    if (svgElement) {
        svgElement.setAttribute('fill', color);
    }
    return new XMLSerializer().serializeToString(doc);
}


/**
 * Process SVG content by removing fill attributes and injecting color
 * @param svgContent
 */
// function cleanSvgContent(svgContent: string): string {
//     // Remove fill attributes from SVG content
//     const removeFillAttributes = (svgContent: string): string => {
//         return svgContent.replace(/fill="(?!none")[^"]*"/g, '');
//     };

//     return injectColorIntoSvg(removeFillAttributes(svgContent), $uiState.styles.glyphColor);
// }

/**
 * Update the ourter SVG fill attribute with the given color
 * @param svgContent
 * @param color
 */
const updateSvgFill = (color: string) => (svgContent: string,): string => {
    if (typeof window === 'undefined') {
        console.error('Trying to use DomParser on the server side. Returning the SVG content as is.');
        return svgContent;
    }
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, 'image/svg+xml');
    const svgElement = doc.querySelectorAll('svg');

    _.forEach(svgElement, (element) => {
        element.setAttribute('fill', color);
    });

    return new XMLSerializer().serializeToString(doc);
}

const removeSvgSizeAttributes = (svgContent: string): string => {
    return svgContent.replace(/(width|height)="[^"]*"/g, '');
}

function mkDefaultGradinet(): UserIconGradient {
    return {
        stops: [
            { position: 0, color: '#fc466b' },
            { position: 100, color: '#3f5efb' }
        ],
        type: 'linear',
        angle: 90,
        cssStyle: 'linear-gradient(90deg, #fc466b 0%, #3f5efb 100%)'
    };
}

function mkCssStyle({ stops, type, angle }: UserIconGradient): string {
    if (!type) {
        return 'linear-gradient(90deg, #45fc8b 0%, #212a54 100%)';
    }

    return type === 'linear' ? `linear-gradient(${angle}deg, ${stops.map(s => `${s.color} ${s.position}%`).join(', ')})` : 'radial-gradient(circle, ' + stops.map(s => `${s.color} ${s.position}%`).join(', ') + ')';
}

function createUIState() {
    const { subscribe, set, update } = writable(emptyState);

    let stateObj = {
        subscribe,
        set: (value: UIState) => {
            set(value);
        },
        update: (fn: (value: UIState) => UIState) => {
            update(fn);
        },

        selectSvgIcon: (svg: string) => update(state => {
            const cleanedSvg = _.flow(updateSvgFill(state.styles.glyphColor), removeSvgSizeAttributes)(svg);

            state.svgContent = cleanedSvg;
            state.imageUrl = '';
            state.styles.pngData = '';

            return state;
        }),

        selectImageIcon: (url: string) => update(state => {
            state.imageUrl = url;
            state.svgContent = '';

            return state;
        }),

        setIconTitle: (title: string) => update(state => {
            state.styles.label = title;
            return state;
        }),

        upsertStyles: (styles: Partial<UIState['styles']>) => update(state => {
            state.styles = { ...state.styles, ...styles };
            return state;
        }),

        setSvgFillColor: (color: string) => update(state => {
            state.svgContent = updateSvgFill(color)(state.svgContent);
            return state;
        }),

        setUseGradient: (value: boolean) => update(state => {
            state.styles.useGradient = value;
            return state;
        }),

        upsertGradient: (gradient: Partial<UserIconGradient>) => {
            const uiState = get({subscribe});
            const oldGradient : any = _.cloneDeep(uiState.styles.gradient || {});

            const newUiState = ((state : UIState) => {
                state.styles.gradient ||= mkDefaultGradinet();
                state.styles.gradient = { ...state.styles.gradient, ...gradient };
                state.styles.gradient.cssStyle = mkCssStyle(state.styles.gradient);
                return state;
            })(uiState);

            // Checkes if any prop has changed
            if (_.isEqual(oldGradient, newUiState.styles.gradient)) return;

            update(_ => newUiState);
        },

        addGradientStop: (stop: GradientStop) => update(state => {
            state.styles.gradient ||= mkDefaultGradinet();
            state.styles.gradient.stops = [...state.styles.gradient.stops, stop].sort((a, b) => a.position - b.position);
            state.styles.gradient.cssStyle = mkCssStyle(state.styles.gradient);
            return state;
        }),

        updateGradientStopPosition: (index: number, position: GradientStop['position']) => update(state => {
            state.styles.gradient ||= mkDefaultGradinet();
            state.styles.gradient.stops[index].position = position;
            state.styles.gradient.stops = state.styles.gradient.stops.sort((a, b) => a.position - b.position);
            state.styles.gradient.cssStyle = mkCssStyle(state.styles.gradient);
            return state;
        }),

        updateGradientStopColor: (index: number, color: GradientStop['color']) => update(state => {
            state.styles.gradient ||= mkDefaultGradinet();
            state.styles.gradient.stops[index].color = color;
            state.styles.gradient.cssStyle = mkCssStyle(state.styles.gradient);
            return state;
        }),

        removeGradientStop: (index: number) => update(state => {
            state.styles.gradient ||= mkDefaultGradinet();
            state.styles.gradient.stops = state.styles.gradient.stops.filter((_, i) => i !== index);
            state.styles.gradient.cssStyle = mkCssStyle(state.styles.gradient);
            return state;
        }),

        setGradientType: (type: UserIconGradient['type']) => update(state => {
            state.styles.gradient ||= mkDefaultGradinet();
            state.styles.gradient.type = type;
            state.styles.gradient.cssStyle = mkCssStyle(state.styles.gradient);
            return state;
        }),

        recalculateGradientCss: () => update(state => {
            console.log('Recalculating gradient css');
            state.styles.gradient ||= mkDefaultGradinet();
            state.styles.gradient.cssStyle = mkCssStyle(state.styles.gradient);
            return state;
        }),

        reset: () => set(emptyState)
    };

    return stateObj;
}

export const uiState = createUIState();