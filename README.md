This is a wiki-style repository of reference articles. It relies on injecting
html content via the scripts in `/js`. The content is stored in `/json`, and
hyperlinks are dynamically added into the html by search-and-replace, using
`/js/hyperlink-map.js` as reference.

## Conventions

-   BEM for all CSS selectors

-   Although BEM uses classes exclusively for styling, elements may be given an
    `id` for the purposes of selecting them in JavaScript

-   `<a>` tags must be given a valid filename from `/json` as an `href`
    property, and this should exclude the filetype, e.g.
    `<a href="introduction">`, not `<a href="introduction.json">`.

-   `<a>` tags which appear in body text must also be given proper styling,
    using the class `"link--styled"`

-   All hyperlinks are described in `hyperlink-map.js`, and automatically
    implemented into each article as it's loaded.

-   All articles are stored as JSONs in the following format;
    ```
    {
        "header": "header text",
        "sections": [
            {
                "type": "subheader",
                "content": "subheader text"
            },
            {
                "type": "paragraph",
                "content": "body text"
            },
            ...
        ]
    }
    ```
