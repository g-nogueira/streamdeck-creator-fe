import type { UserIconGradient } from "../../models/UserIconGradient";

export interface UserIconGradientDto {
    stops: { position: number; color: string }[];
    type: 'linear' | 'radial';
    angle: number;
    cssStyle: string;
}

export function toDomain(userIconGradientDto: UserIconGradientDto): UserIconGradient {
    return {
        stops: userIconGradientDto.stops.map(stop => ({
            position: stop.position,
            color: stop.color
        })),
        type: userIconGradientDto.type,
        angle: userIconGradientDto.angle,
        cssStyle: userIconGradientDto.cssStyle
    };
}

export function fromDomain(userIconGradient: UserIconGradient): UserIconGradientDto {
    return {
        stops: userIconGradient.stops.map(stop => ({
            position: stop.position,
            color: stop.color
        })),
        type: userIconGradient.type,
        angle: userIconGradient.angle,
        cssStyle: userIconGradient.cssStyle
    };
}