import { goToPage } from "../../../shared/helpers/goToPage.js";
import { RenderResult } from "../../../shared/helpers/RenderResponse.js";
import { eventBus } from "../../../shared/modules/EventBus/EventBus.js";
import { api } from "../../../shared/api/api.js";
// import { getReviews } from "../lib/getReviews.js";
// import { getStatistics } from "../lib/getStatistics.js";

import { statisticsStore } from "../store/store.js";

class StatisticsPage {
    constructor() {
        eventBus.on("statistics: render", this.render.bind(this));
    }

    // async rerender() {
    //     const container = this.container;
    // }

    async render() {
        // statisticsStore.getData();
        const response1 = await api.get("/csat/statistics");
        console.log("response:", response1.data);
        statisticsStore.getData(response1.data);

        // const reviews = await getReviews();
        // const statistics = await getStatistics();

        // let averageRate = 0;
        // let ratesCount = 0;
        // for (const item of statistics) {
        //     averageRate += item["rate"] * item["count"];
        //     ratesCount += item["count"];
        // }
        // averageRate /= ratesCount;
        // averageRate = Math.round(averageRate * 100) / 100;

        // const questions = [
        //     {
        //         id: 1,
        //         text: "Оцените Keftegram?",
        //     },
        //     {
        //         id: 2,
        //         text: "Как вам отправка сообщений?",
        //     },
        //     {
        //         id: 3,
        //         text: "Насколько удобно добавление контактов?",
        //     },
        // ];

        // const data = {
        //     reviews: reviews,
        //     // rates: statistics,
        //     averageRate: averageRate,
        //     questions: questions,
        // };

        console.log("statisticsStore:", statisticsStore);

        const statisticsData = statisticsStore["data"];
        const currentQuestionId = statisticsStore["currentQuestionId"];

        console.log("currentQuestionId:", currentQuestionId);

        let currentData = null;
        for (const item of statisticsData) {
            console.log("item:", item);
            console.log("currentQuestionId:", currentQuestionId);
            console.log("item questionId:", item["questionID"]);

            if (item["question_id"] === currentQuestionId) {
                console.log("here");
                currentData = item;
                break;
            }
        }
        if (currentData === null) {
            console.error("Вопрос не найден");
        }

        console.log("currentData:", currentData);

        const comments = currentData["comments"];
        console.log("comments:", comments);
        if (comments !== undefined) {
            for (const comment of comments) {
                let hasFeedback = false;
                if (comment["feedback"] !== "") {
                    hasFeedback = true;
                }
    
                comment["hasFeedback"] = hasFeedback;
            }   
        }

        const data = {
            // averageRating: currentData["averageRating"],
            // questions: statisticsStore["questions"],
            // reviews: comments,
            averageRating: response1.data["average_rating"],
        };

        console.log("template data:", data);

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

        this.drawHistogram(currentData["distribution"]);

        return new RenderResult({});
    }

    bindListeners() {
        const container = this.container;

        const buttonBack = container.querySelector("#button-back");
        buttonBack.addEventListener("click", this.onButtonBackClick.bind(this));

        const selectQuestion = container.querySelector("#selectQuestion");
        selectQuestion.addEventListener(
            "change",
            this.onQuestionSelectChange.bind(this),
        );
    }

    onButtonBackClick() {
        goToPage("main");
    }

    onQuestionSelectChange(event) {
        const questionId = Number(event.target.value);
        const selectedIndex = event.target.selectedIndex;
        const selectedText = event.target.options[selectedIndex].text;

        console.log("Выбрано:", selectedText, "questionID:", questionId);

        eventBus.emit("question: change", questionId);
    }

    // Функция для рисования гистограммы
    drawHistogram(distribution) {
        // Стили гистограммы
        const rootStyles = getComputedStyle(document.documentElement);
        const mainColor = rootStyles.getPropertyValue("--main").trim();
        const blackColor = "#000";
        const fontSize = "20px";
        const fontFamily = "Inter";

        const canvas = document.getElementById("histogram");
        const ctx = canvas.getContext("2d");

        const labels = [1, 2, 3, 4, 5];
        const data = [];

        for (const label of labels) {
            let targetData = 0;

            for (const item of distribution) {
                if (item["rating"] === label) {
                    targetData = item["count"];
                }
            }

            data.push(targetData);
        }

        console.log("distribution:", distribution);
        // for (const item of distribution) {
        //     data.push(item["count"]);
        //     labels.push(item["rate"]);
        // }

        // Настройки отступов
        const padding = 40;
        const chartHeight = canvas.height - 2 * padding;
        const chartWidth = canvas.width - 2 * padding;

        const elemWidth = chartWidth / (5 * 3 + 4);
        const barWidth = 3 * elemWidth;
        const gap = elemWidth;
        const maxValue = Math.max(...data);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.strokeStyle = blackColor;
        ctx.lineWidth = 2;

        // Горизонтальная ось
        ctx.moveTo(padding, canvas.height - padding);
        ctx.lineTo(canvas.width - padding, canvas.height - padding);
        ctx.stroke();

        // Рисуем столбцы и подписи
        data.forEach((value, index) => {
            const x = padding + index * (barWidth + gap);
            const barHeight = (value / maxValue) * chartHeight;
            const y = canvas.height - padding - barHeight;

            ctx.fillStyle = mainColor;

            // Закрашиваем столбец
            ctx.fillRect(x, y, barWidth, barHeight);

            ctx.fillStyle = blackColor;
            ctx.font = `${fontSize} ${fontFamily}`;
            ctx.textAlign = "center";

            // Рисуем значение над столбцом
            ctx.fillText(value, x + barWidth / 2, y - 20);

            // Рисуем подпись под столбцом
            ctx.fillText(
                labels[index],
                x + barWidth / 2,
                canvas.height - padding + 20 + 5, // fontSize = 20
            );
        });
    }
}

export const statisticsPage = new StatisticsPage();
