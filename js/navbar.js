loadNavbar();

function loadNavbar() {
	const request = new XMLHttpRequest();
	request.onreadystatechange = () => {
		if (request.readyState == 4 && request.status == 200) {
			document.querySelector(".navbar__container").innerHTML =
				parseNavbarAsHtml(request.responseText);
		}
	};
	request.open("GET", `../json/navbar.json`);
	request.send(null);
}

function parseNavbarAsHtml(json) {
	const navbarObj = JSON.parse(json);
	let navbarHtml = "";

	let dropdownId = 0;
	navbarObj["navbar items"].forEach(
		({ value, type, dropdownOptions, href }) => {
			// Build each top-level navbar item
			if (type === "link") {
				navbarHtml += `
					<div class="navbar__header link">
						<a class="link" href="${href}">${value}</a>
					</div>`;
			} else if (type === "dropdown") {
				// Build a dropdown menu
				let dropdownHtml = "";

				// Build dropdown options
				dropdownOptions.forEach(({ value, href }) => {
					dropdownHtml += `
					<a href="${href}" class="link navbar__dropdown-option">
					${value}
					</a>`;
				});

				// Wrap dropdown options in a dropdown div
				dropdownHtml = `
					<div id="dropdown menu ${dropdownId}" class="navbar__dropdown">
						${dropdownHtml}
					</div>`;

				// Add the header
				dropdownHtml = `
					<div
						onclick="showDropdownMenu('dropdown menu ${dropdownId++}')"
						class="navbar__header">
						${value}
					</div>
				${dropdownHtml}`;

				// Wrap the header and the dropdown in a dropdown container
				dropdownHtml = `
					<div class="navbar__dropdown-container">
						${dropdownHtml}
					</div>`;
				// Add the dropdown to the navbar
				navbarHtml += dropdownHtml;
			}
		}
	);

	return `<nav class="navbar">${navbarHtml}</nav>`;
}

/*
	sticky navbar
*/
const nav = document.querySelector(".navbar__container");
const stickyOffset = nav.offsetTop;
function makeNavSticky() {
	if (window.pageYOffset >= stickyOffset) {
		nav.classList.add("navbar--sticky");
	} else {
		nav.classList.remove("navbar--sticky");
	}
}

window.addEventListener("scroll", makeNavSticky);

/*
	dropdown menus
*/
function showDropdownMenu(dropdownId) {
	document
		.getElementById(dropdownId)
		.classList.toggle("navbar__dropdown--show");
	const dropdowns = document.querySelectorAll(".navbar__dropdown");
	for (let i = 0; i < dropdowns.length; i++) {
		if (dropdowns[i].id !== dropdownId) {
			dropdowns[i].classList.remove("navbar__dropdown--show");
		}
	}
}

document.addEventListener("click", (event) => {
	// handle clicking off dropdown menu
	if (!event.target.matches(".navbar__header")) {
		try {
			document
				.querySelector(".navbar__dropdown--show")
				.classList.remove("navbar__dropdown--show");
		} catch (TypeError) {}
	}
});
