import map from "./hyperlink-map.js";

loadArticle("eldoria");

/*
	loading articles
*/

function loadArticle(articleName) {
  const request = new XMLHttpRequest();
  request.onreadystatechange = () => {
    if (request.readyState == 4 && request.status == 200) {
      document.querySelector(".article-container").innerHTML = parseJsonAsHtml(
        request.responseText
      );
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
    switch (type) {
      case "subheader":
        articleHtml += `<h2 class="subheader-text">${content}</h2>`;
        break;
      case "paragraph":
        content = replaceKeywordsWithHyperlinks(content);
        articleHtml += `<p class="body-text">${content}</p>`;
        break;
      case "table":
        articleHtml += parseCsvAsHtmlTable(content);
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

function parseCsvAsHtmlTable(csv) {
  let html = "";

  const rows = csv.split("\n");

  for (let i = 0; i < rows.length; i++) {
    html += `<tr>`;
    rows[i].split(",").forEach((cell) => {
      const cellTags =
        i === 0
          ? [`<th class="table__cell">`, "</th>"]
          : [`<td class="table__cell">`, "</td>"];
      html += `${cellTags[0]}${cell}${cellTags[1]}`;
    });
    html += `</tr>`;
  }

  return `<table class="table">${html}</table>`;
}

/*
	event listeners
*/

document.addEventListener("click", (event) => {
  // handle anchor tags
  if (event.target.matches(".link") || event.target.matches(".link--styled")) {
    event.preventDefault();
    let href = event.target.href.substring(event.target.href.lastIndexOf("/"));
    loadArticle(href);
    scrollTo(0, 0);
  }
});
