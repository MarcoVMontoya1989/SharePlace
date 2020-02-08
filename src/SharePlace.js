import {DOMElements} from "./DOMBase";
import {Modal} from "./UI/Modal";
import {Map} from './UI/Map';
import {getCordsFromAddress, getAddressFromCords} from './Utility/Location';

class PlaceFinder {
    //in this class we will handle the two buttons from find place and get current location
    constructor() {
        const addressForm = DOMElements.placeFindButton;
        const locateUserBtn = DOMElements.placeGetCurrentLocation;
        this.shareBtn = document.getElementById('share-btn');

        //the reason of bind(this) is to focus to the class instance and not in the DOM due to addEventListener
        locateUserBtn.addEventListener('click', this.locateUserHandler.bind(this));
        addressForm.addEventListener("submit", this.findAddressHandler.bind(this));
        this.shareBtn.addEventListener('click', this.sharePlaceHandler.bind(this));
    }

    selectPlace(coordinates, address) {
        if (this.map) {
            this.map.render(coordinates);
        } else {
            this.map = new Map(coordinates);
        }

        this.shareBtn.disabled = false;
        const shareLinkInputElement = document.getElementById('share-link');
        shareLinkInputElement.value = `${location.origin}/my-place?address=${encodeURI(address)}&lat=${coordinates.lat},&lng=${coordinates.lng}`

    }

    locateUserHandler() {
        if (!navigator.geolocation) {
            alert(`Location feature it's not available in your 
            current browser, please update or use a modern browser.`);
            return;
        }

        const modal = new Modal('loading-modal-content',
            'Loading location - Please wait a bit.');

        modal.show();
        navigator.geolocation.getCurrentPosition(async success => {
            const coordinates = {
                lat: success.coords.latitude,
                lng: success.coords.longitude,
            };
            // console.log(coordinates);
            modal.hide();
            const address = await getAddressFromCords(coordinates);

            this.selectPlace(coordinates, address);

        }, error => {
            modal.hide();
            alert(`Could not locate your current position. Please add the address manually`);
        });
    }

    async findAddressHandler(event) {
        event.preventDefault();

        const addressText = event.target.querySelector('input').value;

        if (!addressText || addressText.trim().length === 0) {
            alert('Invalid address - Please provide a valid address.');
            return;
        }

        const modal = new Modal('loading-modal-content',
            'Loading location - Please wait a bit.');

        modal.show();

        try {
            const result = await getCordsFromAddress(addressText);
            this.selectPlace(result, address);
        } catch (e) {
            throw new Error(e.message);
        }

        modal.hide();

    }

    sharePlaceHandler() {
        const shareLinkInputElement = document.getElementById('share-link');

        if (!navigator.clipboard) {
            shareLinkInputElement.select();
            return;
        }

        navigator.clipboard.writeText(shareLinkInputElement.value).then(value => {
            alert(`Copied to your clipboard`);
        }).catch(reason => {
            console.log(reason);
            shareLinkInputElement.select();
        });
    }
}

const placeFinder = new PlaceFinder();