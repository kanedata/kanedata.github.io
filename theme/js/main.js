const RSS_FEED_URL = "https://dkane.net/feeds/all.atom.xml";
const ITEM_TEMPLATE_FIRST = document.getElementById("feed-item-first");
const ITEM_TEMPLATE = document.getElementById("feed-item");
const ITEM_LIST = document.getElementById("blog-feed-posts");

const getFeed = async () => {
    const response = await fetch(RSS_FEED_URL);
    const text = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "text/xml");
    const items = xml.querySelectorAll("entry");
    const feed = [];
    for (const item of items) {
        feed.push({
            title: item.querySelector("title").textContent,
            link: item.querySelector("link").getAttribute("href"),
            date: new Date(item.querySelector("updated").textContent),
            category: item.querySelector("category").getAttribute("term"),
            author: item.querySelector("author").textContent,
        });
    }
    return feed;
};

const createItem = (item, template) => {
    let itemElement = template.content.cloneNode(true);
    let itemTitle = itemElement.querySelector(".blog-post-title");
    let itemDate = itemElement.querySelector(".blog-post-date");
    let itemLink = itemElement.querySelector(".blog-post-link");
    let itemAuthor = itemElement.querySelector(".blog-post-author");
    if (itemTitle) {
        itemTitle.textContent = item.title;
    }
    if (itemDate) {
        itemDate.textContent = item.date.toLocaleDateString();
        itemDate.datetime = item.date;
    }
    if (itemLink) {
        itemLink.href = item.link;
    }
    if (itemAuthor) {
        itemAuthor.textContent = item.author;
    }
    return itemElement;
};

getFeed().then((feed) => {
    // remove any existing content
    while (ITEM_LIST.firstChild) {
        ITEM_LIST.removeChild(ITEM_LIST.firstChild);
    }

    feed = feed.filter((item) => item.category === "Blog").slice(0, 7);

    const firstItem = feed.shift();
    ITEM_LIST.appendChild(createItem(
        firstItem,
        ITEM_TEMPLATE_FIRST
    ));

    feed.forEach((item) => {
        ITEM_LIST.appendChild(createItem(
            item,
            ITEM_TEMPLATE
        ));
    });
});
