import { goToPage } from "../../../shared/helpers/goToPage.js";
import { api } from "../../../shared/api/api.js";
import { currentUser } from "../../../entities/User/model/User.js";

class NoChat {
    constructor(parent) {
        this.parent = parent;
    }

    async getHTML() {
        const responseBody = await api.get("/csat/questions");
        console.log(responseBody.data[0]);
        const data = {
            question: responseBody.data[0].text,

        }
        const dialogTemplate = Handlebars.templates["NoChat.hbs"];
        const html = dialogTemplate({ ...data });

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
        const no_rate=doc.querySelector("#no-rate")
        //const rate1=doc.querySelector(".rate1")

        const toClose = (event) => {
            event.preventDefault();
            block.classList.add('fade-out')
            //block.style.display="none"
        };
        let res=0
        const rate1_eve = (event) => {
            event.preventDefault();
            res=1
            
            allsmiles.forEach(element => {
                element.style.height="50px"
                element.style.width="50px"
            });
            rate1.style.height="70px"
            rate1.style.width="70px"
        };
        const rate2_eve = (event) => {
            event.preventDefault();
            res=2
            allsmiles.forEach(element => {
                element.style.height="50px"
                element.style.width="50px"
            });
            rate2.style.height="70px"
            rate2.style.width="70px"    
            };
        const rate3_eve = (event) => {
            event.preventDefault();
            res=3
            allsmiles.forEach(element => {
                element.style.height="50px"
                element.style.width="50px"
            });
            rate3.style.height="70px"
            rate3.style.width="70px"
                };
        const rate4_eve = (event) => {
            event.preventDefault();
            res=4
            allsmiles.forEach(element => {
                element.style.height="50px"
                element.style.width="50px"
            });
            rate4.style.height="70px"
            rate4.style.width="70px"
                };
        const rate5_eve = (event) => {
            event.preventDefault();
            res=5
            allsmiles.forEach(element => {
                element.style.height="50px"
                element.style.width="50px"
            });
            rate5.style.height="70px"
            rate5.style.width="70px"
                };
        const rate_input_eve = async (event) => {
            event.preventDefault();
            if (res===0){
                no_rate.textContent="поставьте оценку"
            } else {
                const response = await api.post(
                    "/csat/answers",
                    { question_id: responseBody.data[0].id,
                        username:currentUser.getUsername(),
                        rating: res,
                        feedback:inval.value
                     },
                    // message.toApiFormat(),
                );
                console.log(response)
                console.log(currentUser.getUsername(),inval.value,res,responseBody.data[0].id)
                block.classList.add('fade-out')
            }
            //console.log(inval.value,res,)
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
