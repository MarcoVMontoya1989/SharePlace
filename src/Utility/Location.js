import {DOMElements} from "../DOMBase";

export async function getCordsFromAddress(address) {
    const urlAddress = encodeURI(address);

    const response = await fetch(`
    ${DOMElements.GEOCODING_API}${urlAddress}${DOMElements.MAPS_KEY}`);

    if (!response.ok) {
        throw new Error('Failed to fetch coordinates. Please try again later.');
    }

    const data = await response.json();

    if (data.error_message) {
        throw new Error(data.error_message);
    }

    return data.results[0].geometry.location;
}

export async function getAddressFromCords(coordinates) {
    const response = await fetch(`
    ${DOMElements.GEOCOORDS_API}${coordinates.lat},${coordinates.lng}${DOMElements.MAPS_KEY}`);

    if (!response.ok) {
        throw new Error('Failed to fetch address. Please try again later.');
    }
    const data = await response.json();

    if (data.error_message) {
        throw new Error(data.error_message);
    }

    return data.results[0].formatted_address;

}