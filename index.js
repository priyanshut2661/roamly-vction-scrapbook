const tripForm = document.getElementById("tripForm");
const tripMessage = document.getElementById("tripMessage");
const journalMessage = document.getElementById("journalMessage");
const dayEntries = document.getElementById("dayEntries");
const savedMemories = document.getElementById("savedMemories");

let dayCount = 2;

// 1. Create vacation album and update summary
tripForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = document.getElementById("tripTitle").value.trim();
    const destination = document.getElementById("destination").value.trim();
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    if (endDate < startDate) {
        tripMessage.textContent = "End date cannot be before the start date!";
        tripMessage.style.color = "#d83248";
        return;
    }

    document.getElementById("summaryTitle").textContent = title;
    document.getElementById("summaryDestination").textContent = destination;
    document.getElementById("summaryDates").textContent =
        startDate + " to " + endDate;

    document.getElementById("summaryMood").textContent =
        document.getElementById("mood").value;

    document.getElementById("summaryWeather").textContent =
        document.getElementById("weather").value;

    tripMessage.textContent = "Your vacation album is ready! ✈";
    tripMessage.style.color = "#167b59";
});

// Update mood and weather in the summary
document.getElementById("mood").addEventListener("change", function () {
    document.getElementById("summaryMood").textContent = this.value;
});

document.getElementById("weather").addEventListener("change", function () {
    document.getElementById("summaryWeather").textContent = this.value;
});

// 2. Add another travel day
document.getElementById("addDay").addEventListener("click", function () {
    dayCount++;

    const card = document.createElement("article");
    card.className = "day-card";

    card.innerHTML = `
        <h3>✈️ Day ${dayCount} — New Adventure</h3>

        <label class="upload-box">
            <span>📷 Choose Travel Photos</span>
            <small>You can select multiple photos</small>
            <input class="day-photos" type="file" accept="image/*" multiple>
        </label>

        <div class="photo-preview"></div>

        <label class="field">
            <span>Today's Story</span>
            <textarea class="day-note" maxlength="500"
                placeholder="What did you explore today?"></textarea>
        </label>

        <p class="counter">0/500</p>
    `;

    dayEntries.appendChild(card);
    card.scrollIntoView({ behavior: "smooth", block: "center" });
});

// 3. Display photo previews for each day
dayEntries.addEventListener("change", function (event) {
    if (!event.target.classList.contains("day-photos")) return;

    const input = event.target;
    const preview = input.closest(".day-card").querySelector(".photo-preview");

    preview.replaceChildren();

    Array.from(input.files).forEach(function (file) {
        if (!file.type.startsWith("image/")) return;

        const image = document.createElement("img");
        image.src = URL.createObjectURL(file);
        image.alt = "Travel photo";
        image.title = file.name;

        preview.appendChild(image);
    });
});

// 4. Character counters for journal and daily notes
document.addEventListener("input", function (event) {
    if (!event.target.matches("textarea")) return;

    const field = event.target.closest(".field");
    const counter = field
        ? field.parentElement.querySelector(".counter")
        : null;

    // Find the counter belonging to this textarea's card or journal field
    const ownCounter = event.target.parentElement.querySelector(".counter")
        || event.target.closest(".day-card")?.querySelector(".counter");

    if (ownCounter) {
        ownCounter.textContent =
            event.target.value.length + "/" + event.target.maxLength;
    }
});

// 5. Save travel journal entries to the Saved Memories section
document.getElementById("saveJournal").addEventListener("click", function () {
    const memories = document.getElementById("memories").value.trim();
    const stories = document.getElementById("stories").value.trim();
    const meals = document.getElementById("meals").value.trim();

    if (!memories && !stories && !meals) {
        journalMessage.textContent = "Write at least one memory before saving!";
        journalMessage.style.color = "#d83248";
        return;
    }

    const emptyState = savedMemories.querySelector(".empty-state");
    if (emptyState) emptyState.remove();

    const card = document.createElement("article");
    card.className = "saved-card";

    const heading = document.createElement("h3");
    heading.textContent =
        document.getElementById("tripTitle").value.trim() || "My Travel Memories";
    card.appendChild(heading);

    const entries = [
        ["💖 Favourite Memories", memories],
        ["😂 Funny Travel Stories", stories],
        ["🍜 Favourite Meal", meals]
    ];

    entries.forEach(function (entry) {
        if (!entry[1]) return;

        const label = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = entry[0];
        label.appendChild(strong);
        label.appendChild(document.createElement("br"));
        label.appendChild(document.createTextNode(entry[1]));
        card.appendChild(label);
    });

    savedMemories.prepend(card);

    journalMessage.textContent = "Memories saved to your scrapbook! 💙";
    journalMessage.style.color = "#167b59";
});