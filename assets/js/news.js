document.addEventListener("DOMContentLoaded", function () {
    const newsArticleContainer = document.getElementById("news-article");
    const relatedNewsContainer = document.getElementById("related-news-container");

    if (!newsArticleContainer || !relatedNewsContainer) {
        console.error("Required containers are missing in the HTML.");
        return;
    }

    // ✅ Get the article ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get("id");

    if (articleId) {
        const articles = JSON.parse(localStorage.getItem("newsArticles")) || [];
        const selectedArticle = articles.find(article => article.id == articleId);

        if (selectedArticle) {
            displayNewsArticle(selectedArticle);
            displayRelatedNews(articles, selectedArticle.category, articleId);
        } else {
            newsArticleContainer.innerHTML = "<p>Article not found.</p>";
        }
    } else {
        newsArticleContainer.innerHTML = "<p>Invalid article ID.</p>";
    }

    // ✅ Display the selected news article
    function displayNewsArticle(article) {
        const imageUrl = article.image ? article.image : "assets/images/default.jpg";

        newsArticleContainer
