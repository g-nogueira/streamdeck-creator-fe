export const empty = '00000000-0000-0000-0000-000000000000';

export function isEmpty(uuid: string): boolean {
    return uuid === empty;
}