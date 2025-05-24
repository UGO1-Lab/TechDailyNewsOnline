document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");
    const menuIcon = menuToggle.querySelector("i");
    const searchInput = document.getElementById("search");
    const searchBtn = document.getElementById("search-btn");
    const darkModeToggle = document.getElementById("dark-mode-toggle");
    const newsContainer = document.getElementById("news-container");
    const body = document.body;
    const categoryFilter = document.getElementById("category-filter");
    let allNewsArticles = [];

    // ✅ Hamburger Menu Toggle
    menuToggle.addEventListener("click", function () {
        navMenu.classList.toggle("active");
        menuIcon.classList.toggle("fa-bars");
        menuIcon.classList.toggle("fa-times");
    });
    
    // ✅ Close Menu When Clicking Outside
    document.addEventListener("click", function (event) {
        if (!menuToggle.contains(event.target) && !navMenu.contains(event.target)) {
            navMenu.classList.remove("active");
            menuIcon.classList.add("fa-bars");
            menuIcon.classList.remove("fa-times");
        }
    });
    
    // ✅ Dark Mode Toggle (Saves State)
    if (localStorage.getItem("darkMode") === "enabled") {
        body.classList.add("dark-mode");
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    darkModeToggle.addEventListener("click", function () {
        body.classList.toggle("dark-mode");
        localStorage.setItem("darkMode", body.classList.contains("dark-mode") ? "enabled" : "disabled");
        darkModeToggle.innerHTML = body.classList.contains("dark-mode") ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });
    
    // ✅ Fetch News Data
    fetch("assets/data/news.json")
        .then(response => response.json())
        .then(data => {
            console.log("Fetched News Data:", data); // Debugging
            allNewsArticles = data.articles;
            displayNews(allNewsArticles);
            populateCategories();
        })
        .catch(error => {
            console.error("Error fetching news:", error);
            if (newsContainer) {
                newsContainer.innerHTML = "<p>⚠ Failed to load news. Please try again later.</p>";
            }
        });
    
    // ✅ Display News Articles
    function displayNews(newsList) {
        if (!newsContainer) return;
        if (newsList.length === 0) {
            newsContainer.innerHTML = "<p>No articles found.</p>";
            return;
        }
        newsContainer.innerHTML = ""; // Clear old news
        newsList.forEach(article => {
            const articleElement = document.createElement("article");
            const imageUrl = article.image ? article.image : "assets/images/default.jpg";
            articleElement.innerHTML = `
                <img src="${imageUrl}" alt="${article.title}">
                <h3>${article.title}</h3>
                <p>${article.description}</p>
                <a href="news.html?id=${article.id}">Read More</a>
            `;
            newsContainer.appendChild(articleElement);
        });
    }
    
    // ✅ Populate Category Filter
    function populateCategories() {
        if (!categoryFilter) return;
        const categories = [...new Set(allNewsArticles.map(news => news.category))];
        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }
    
    // ✅ Filter News by Category
    if (categoryFilter) {
        categoryFilter.addEventListener("change", function () {
            const selectedCategory = categoryFilter.value;
            const filteredNews =
                selectedCategory === "all"
                    ? allNewsArticles
                    : allNewsArticles.filter(news => news.category === selectedCategory);
            displayNews(filteredNews);
        });
    }
    
    // ✅ Search News
    function searchNews() {
        const query = searchInput.value.toLowerCase();
        const filteredNews = allNewsArticles.filter(news =>
            news.title.toLowerCase().includes(query) ||
            news.description.toLowerCase().includes(query)
        );
        displayNews(filteredNews);
    }
    
    // ✅ Listen for Search Events
    if (searchInput) {
        searchInput.addEventListener("input", function () {
            if (searchInput.value === "") {
                displayNews(allNewsArticles);
            }
        });
    
        searchInput.addEventListener("keyup", function (event) {
            if (event.key === "Enter") {
                searchNews();
            }
        });
    }
    
    if (searchBtn) {
        searchBtn.addEventListener("click", searchNews);
    }
    
});