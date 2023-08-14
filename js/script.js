import map from "./hyperlink-map.js";

loadArticle("eldoria");

/*
	loading articles
*/

function loadArticle(articleName) {
	const request = new XMLHttpRequest();
	request.onreadystatechange = () => {
		if (request.readyState == 4 && request.status == 200) {
			document.querySelector(".article-container").innerHTML =
				parseJsonAsHtml(request.responseText);
		}
	};
	request.open("GET", `../json/${articleName}.json`);
	request.send(null);
}

function parseJsonAsHtml(json) {
	const articleObj = JSON.parse(json);
	let articleHtml = "";

	// header
	articleHtml += `<h1 class="header-text">${articleObj.header}</h1>`;

	// subheaders & paragraphs
	articleObj.sections.forEach(({ type, content }) => {
		if (type === "subheader") {
			articleHtml += `<h2 class="subheader-text">${content}</h2>`;
		} else if (type === "paragraph") {
			content = replaceKeywordsWithHyperlinks(content);
			articleHtml += `<p class="body-text">${content}</p>`;
		}
	});

	// article tag
	articleHtml = `<article class="article">${articleHtml}</article>`;

	return articleHtml;
}

function replaceKeywordsWithHyperlinks(bodyText) {
	Object.keys(map).forEach((keyword) => {
		bodyText = bodyText.replaceAll(
			keyword,
			`<a href="${map[keyword]}" class="link--styled">${keyword}</a>`
		);
	});
	return bodyText;
}

/*
	event listeners
*/

document.addEventListener("click", (event) => {
	// handle anchor tags
	if (
		event.target.matches(".link") ||
		event.target.matches(".link--styled")
	) {
		event.preventDefault();
		let href = event.target.href.substring(
			event.target.href.lastIndexOf("/")
		);
		loadArticle(href);
		scrollTo(0, 0);
	}
});
