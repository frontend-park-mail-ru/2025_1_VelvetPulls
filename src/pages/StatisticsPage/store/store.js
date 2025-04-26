import { eventBus } from "../../../shared/modules/EventBus/EventBus.js";
// import { getReviews } from "../lib/getReviews.js";
// import { getStatistics } from "../lib/getStatistics.js";

class StatisticsStore {
    constructor() {
        // this.questions = null;
        // this.comments = null;
        // this.ratings = null;

        this.data = null;
        this.currentQuestionId = 1;

        eventBus.on("question: change", this.onQuestionChange.bind(this));
    }

    onQuestionChange(questionId) {
        this.currentQuestionId = questionId;
        eventBus.emit("statistics: render");
    }

    async getData() {
        const data = [
            {
                questionID: 1,
                questionText: "Как Вам Keftegram?",
                averageRating: 4.5,
                answerCount: 2,
                distribution: [
                    {
                        rating: 4,
                        count: 1,
                    },
                    {
                        rating: 5,
                        count: 1,
                    },
                ],
                comments: [
                    {
                        // questionID: 1,
                        username: "ruslantus228",
                        rating: 5,
                        feedback: "Очень нравится",
                    },
                    {
                        // questionID: 1,
                        username: "testuser",
                        rating: 4,
                        feedback: "Чётко",
                    },
                ],
            },
            {
                questionID: 2,
                questionText: "Насколько удобно пользоваться контактами?",
                averageRating: 3.5,
                answerCount: 2,
                distribution: [
                    {
                        rating: 3,
                        count: 1,
                    },
                    {
                        rating: 4,
                        count: 1,
                    },
                ],
                comments: [
                    {
                        // questionID: 1,
                        username: "ruslantus228",
                        rating: 4,
                        feedback: "Норм",
                    },
                    {
                        // questionID: 1,
                        username: "testuser",
                        rating: 3,
                        feedback: "Удовлетворительно",
                    },
                ],
            },
        ];

        this.data = data;

        const questions = [];
        for (const item of data) {
            let selected = false;
            if (item["questionID"] === this.currentQuestionId) {
                selected = true;
            }

            questions.push({
                id: item["questionID"],
                text: item["questionText"],
                selected: selected,
            });
        }

        this.questions = questions;

        // const reviews = await getReviews();
        // const statistics = await getStatistics();
        // this.ratings = statistics;

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
    }
}

export const statisticsStore = new StatisticsStore();
