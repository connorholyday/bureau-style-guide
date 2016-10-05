class Styleguide {

	constructor(container) {

		this.container = container;

		// save the original html of the page
		this.base_html = this.container.innerHTML;

		// add a listener for the browser back button
		window.addEventListener('popstate', () => {

			// set the html to the stored markup from the event
			this.container.innerHTML = window.history.state;

			// reset the page
			this.initialisePage();

		});

	}

	clickHandler() {

		// this pushes a new state in window.history
		// allowing you to use the back button to return to the previous view
		// it passes in the original html in order to revert later
		window.history.pushState(null, null, window.location.href);

		// change the html to the markup of the target preview
		document.getElementById('styleguide-app').innerHTML = this.innerHTML;

	}

	initialisePage() {

		// get all preview sections
		const previews = document.querySelectorAll('.aigis-preview');
		const previewsArray = [].slice.call(previews);

		// !! forces a boolean value
		// this checks that there are preview elements before continuing
		if ( !! previewsArray.length ) {

			// add a click handler to each
			previewsArray.forEach(preview => preview.addEventListener('click', this.clickHandler.bind(preview), false));

		}

	}

}

// wrap this all in an IIFE
// doesn't pollute the global scope
(() => {

	// define the container
	const container = document.getElementById('styleguide-app');

	// create a new instance of the Styleguide class
	const app = new Styleguide(container);

	// this sets the base markup as that contained within the container
	// this stops things outside of the app being replaced
	// for example: the script tag referencing this script
	window.history.replaceState(container.innerHTML, null, null);

	// initialise the page
	app.initialisePage();

})();