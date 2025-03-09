import { writable, get } from "svelte/store";
import type { CustomizableIcon } from "../models/CustomizableIcon";
import type { Icon } from "../models/Icon";
import { type UserIcon } from "../models/UserIcon";
import * as _iconPreview from '../models/CustomizableIcon';
import _ from "lodash";
import type { GradientStop, IconGradient } from "../models/IconGradient";

let fromIcon = (icon: Icon) => {
    let iconPreview = _iconPreview.mkEmpty();

    iconPreview.iconId = icon.id;
    iconPreview.iconOrigin = icon.origin;

    return iconPreview;
}

let fromUserIcon = (userIcon: UserIcon) => {
    let iconPreview = _iconPreview.fromUserIcon(userIcon, userIcon.collectionId);

    return iconPreview;
}

/**
 * Update the ourter SVG fill attribute with the given color
 * @param svgContent
 * @param color
 */
const updateSvgFill = (color: string) => (svgContent: string): string => {
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

function mkDefaultGradient(): IconGradient {
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

function mkCssStyle({ stops, type, angle }: IconGradient): string {
    if (!type) {
        return 'linear-gradient(90deg, #45fc8b 0%, #212a54 100%)';
    }

    return type === 'linear' ? `linear-gradient(${angle}deg, ${stops.map(s => `${s.color} ${s.position}%`).join(', ')})` : 'radial-gradient(circle, ' + stops.map(s => `${s.color} ${s.position}%`).join(', ') + ')';
}

function createIconCustomizationsStore() {
    const { subscribe, set, update } = writable<CustomizableIcon | null>(null);

    return {
        subscribe,
        selectIcon: (icon: Icon) => set(fromIcon(icon)),
        selectUserIcon: (userIcon: UserIcon) => set(fromUserIcon(userIcon)),
        clear: () => set(null),

        selectSvgIcon: (svg: string) => update((state) => {
            if (!state) return state;

            const cleanedSvg = _.flow(updateSvgFill(state.styles.glyphColor), removeSvgSizeAttributes)(svg);

            state.svgContent = cleanedSvg;
            state.imageUrl = '';
            state.styles.pngData = '';

            return state;
        }),

        selectImageIcon: (url: string) => update(state => {
            if (!state) return state;

            state.imageUrl = url;
            state.svgContent = '';

            return state;
        }),

        setIconTitle: (title: string) => update(state => {
            if (!state) return state;

            state.styles.label = title;
            return state;
        }),

        upsertStyles: (styles: Partial<CustomizableIcon['styles']>) => update(state => {
            if (!state) return state;

            state.styles = { ...state.styles, ...styles };
            return state;
        }),

        setSvgFillColor: (color: string) => update(state => {
            if (!state) return state;

            state.svgContent = updateSvgFill(color)(state.svgContent!);
            return state;
        }),

        setUseGradient: (value: boolean) => update(state => {
            if (!state) return state;

            state.styles.useGradient = value;
            return state;
        }),

        upsertGradient: (gradient: Partial<IconGradient>) => {
            const uiState = get({ subscribe });

            if (!uiState || !uiState.styles) throw new Error('IconPreview state is not initialized yet.');

            const oldGradient: any = _.cloneDeep(uiState.styles.gradient || {});

            const newUiState = ((state: CustomizableIcon) => {
                state.styles.gradient ||= mkDefaultGradient();
                state.styles.gradient = { ...state.styles.gradient, ...gradient };
                state.styles.gradient.cssStyle = mkCssStyle(state.styles.gradient);
                return state;
            })(uiState);

            // Checkes if any prop has changed
            if (_.isEqual(oldGradient, newUiState.styles.gradient)) return;

            update(_ => newUiState);
        },

        addGradientStop: (stop: GradientStop) => update(state => {
            if (!state) return state;

            state.styles.gradient ||= mkDefaultGradient();
            state.styles.gradient.stops = [...state.styles.gradient.stops, stop].sort((a, b) => a.position - b.position);
            state.styles.gradient.cssStyle = mkCssStyle(state.styles.gradient);
            return state;
        }),

        updateGradientStopPosition: (index: number, position: GradientStop['position']) => update(state => {
            if (!state) return state;

            state.styles.gradient ||= mkDefaultGradient();
            state.styles.gradient.stops[index].position = position;
            state.styles.gradient.stops = state.styles.gradient.stops.sort((a, b) => a.position - b.position);
            state.styles.gradient.cssStyle = mkCssStyle(state.styles.gradient);
            return state;
        }),

        updateGradientStopColor: (index: number, color: GradientStop['color']) => update(state => {
            if (!state) return state;

            state.styles.gradient ||= mkDefaultGradient();
            state.styles.gradient.stops[index].color = color;
            state.styles.gradient.cssStyle = mkCssStyle(state.styles.gradient);
            return state;
        }),

        removeGradientStop: (index: number) => update(state => {
            if (!state) return state;

            state.styles.gradient ||= mkDefaultGradient();
            state.styles.gradient.stops = state.styles.gradient.stops.filter((_, i) => i !== index);
            state.styles.gradient.cssStyle = mkCssStyle(state.styles.gradient);
            return state;
        }),

        setGradientType: (type: IconGradient['type']) => update(state => {
            if (!state) return state;

            state.styles.gradient ||= mkDefaultGradient();
            state.styles.gradient.type = type;
            state.styles.gradient.cssStyle = mkCssStyle(state.styles.gradient);
            return state;
        }),

        recalculateGradientCss: () => update(state => {
            if (!state) return state;

            console.log('Recalculating gradient css');
            state.styles.gradient ||= mkDefaultGradient();
            state.styles.gradient.cssStyle = mkCssStyle(state.styles.gradient);
            return state;
        }),

        updatePngData: (data: string) => update(state => {
            if (!state) return state;

            state.styles.pngData = data;
            return state;
        }),

        reset: () => set(_iconPreview.mkEmpty())
    };
}

export const customizedIcon = createIconCustomizationsStore();