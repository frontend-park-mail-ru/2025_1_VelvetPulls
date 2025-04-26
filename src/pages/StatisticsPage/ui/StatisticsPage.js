import { goToPage } from "../../../shared/helpers/goToPage.js";
import { RenderResult } from "../../../shared/helpers/RenderResponse.js";

import { getReviews } from "../lib/getReviews.js";
import { getStatistics } from "../lib/getStatistics.js";

class StatisticsPage {
    constructor() {}

    async render() {
        const reviews = await getReviews();
        const statistics = await getStatistics();

        console.log("statistics:", statistics);
        console.log("averageRate:", statistics["averageRate"]);

        const data = {
            reviews: reviews,
            statistics: statistics,
            averageRate: statistics["averageRate"],
        };

        console.log("data:", data);

        const template = Handlebars.templates["StatisticsPage.hbs"];
        const html = template({ ...data });

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const container = doc.body.firstChild;
        this.container = container;

        this.bindListeners();

        const root = document.getElementById("root");
        root.innerHTML = "";
        root.appendChild(container);

        return new RenderResult({});
    }

    bindListeners() {
        const container = this.container;

        const buttonBack = container.querySelector("#button-back");
        buttonBack.addEventListener("click", this.onButtonBackClick.bind(this));
    }

    onButtonBackClick() {
        goToPage("main");
    }
}

export const statisticsPage = new StatisticsPage();
