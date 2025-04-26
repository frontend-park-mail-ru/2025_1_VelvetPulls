import { goToPage } from "../../../shared/helpers/goToPage.js";

class NoChat {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML() {
        const dialogTemplate = Handlebars.templates["NoChat.hbs"];
        const html = dialogTemplate();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const close=doc.querySelector("#closeModal")
        const block=doc.querySelector("#modal")
        const rate1=doc.querySelector("#rate1")
        const rate2=doc.querySelector("#rate2")
        const rate3=doc.querySelector("#rate3")
        const rate4=doc.querySelector("#rate4")
        const rate5=doc.querySelector("#rate5")
        const allsmiles=doc.querySelectorAll(".smile")
        const rateinput=doc.querySelector("#rate-form")
        const inval=doc.querySelector("#rating")
        //const rate1=doc.querySelector(".rate1")

        const toClose = (event) => {
            event.preventDefault();
            block.style.display="none"
        };
        let res="no rate"
        const rate1_eve = (event) => {
            event.preventDefault();
            res="very-hate"
            allsmiles.forEach(element => {
                element.style.height="50px"
                element.style.width="50px"
            });
            rate1.style.height="70px"
            rate1.style.width="70px"
        };
        const rate2_eve = (event) => {
            event.preventDefault();
            res="hate"
            allsmiles.forEach(element => {
                element.style.height="50px"
                element.style.width="50px"
            });
            rate2.style.height="70px"
            rate2.style.width="70px"    
            };
        const rate3_eve = (event) => {
            event.preventDefault();
            res="neutral"
            allsmiles.forEach(element => {
                element.style.height="50px"
                element.style.width="50px"
            });
            rate3.style.height="70px"
            rate3.style.width="70px"
                };
        const rate4_eve = (event) => {
            event.preventDefault();
            res="like"
            allsmiles.forEach(element => {
                element.style.height="50px"
                element.style.width="50px"
            });
            rate4.style.height="70px"
            rate4.style.width="70px"
                };
        const rate5_eve = (event) => {
            event.preventDefault();
            res="very-like"
            allsmiles.forEach(element => {
                element.style.height="50px"
                element.style.width="50px"
            });
            rate5.style.height="70px"
            rate5.style.width="70px"
                };
        const rate_input_eve = (event) => {
            event.preventDefault();
            console.log(inval.value,res)
                };
        // const rate4_eve = (event) => {
        //     event.preventDefault();
        //     console.log("rate4")
        // };
        close.addEventListener("click", toClose);
        rate1.addEventListener("click", rate1_eve);
        rate2.addEventListener("click", rate2_eve);
        rate3.addEventListener("click", rate3_eve);
        rate4.addEventListener("click", rate4_eve);
        rate5.addEventListener("click", rate5_eve);
        rateinput.addEventListener("submit", rate_input_eve);
        //rate4.addEventListener("click", rate4_eve);

        const container = doc.body.firstChild;
        this.container = container;

        this.bindListeners();

        return container;
    }

    bindListeners() {
        const container = this.container;

        const statisticsLink = container.querySelector(".statistics-link");

        statisticsLink.addEventListener(
            "click",
            this.onStatisticsLinkClick.bind(this),
        );
    }

    onStatisticsLinkClick() {
        // alert("Переход на страницу статистики");
        goToPage("statistics");
    }
}

export const noChat = new NoChat();
