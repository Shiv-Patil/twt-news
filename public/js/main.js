var mobile = window.matchMedia("screen and (max-width: 900px)");
function collapseNewsItem() {
	console.log("here 2");
	let items =
		document.getElementsByClassName("news-items-container")[0] || false;
	let news_container =
		document.getElementsByClassName("news-content-container")[0] || false;
	if (items.classList.contains("collapsed")) {
		items.classList.remove("collapsed");
		news_container.classList.remove("items-collapsed");
	} else {
		items.classList.add("collapsed");
		news_container.classList.add("items-collapsed");
	}
	if (!mobile.matches) {
		let news = document.getElementsByClassName("news-content")[0] || false;
		news.style.opacity = 0;
		setTimeout(() => {
			news.style.transition = "opacity .4s ease";
			news.style.opacity = 1;
			setTimeout(() => (news.style.transition = "none"), 400);
		}, 300);
	}
}

function newsItemClicked(title, subtitle, body, html) {
	newsContentContainer = document.getElementsByClassName(
		"news-content-container"
	)[0];
	newsContentContainer.innerHTML =
		html ||
		`
	<div class="news-content">
          <img class="news-content-image" src="yoquack.jpg" alt="yoquack" />
          <div class="news-content-title">${title}</div>
          <div class="news-content-subtitle">${subtitle}</div>
          <div class="news-content-description">
            ${body}
          </div>
        </div>
	`;
	console.log("here");
	if (mobile.matches) {
		collapseNewsItem();
	}
}
