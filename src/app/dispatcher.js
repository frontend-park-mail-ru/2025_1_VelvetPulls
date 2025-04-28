import { eventBus } from "../shared/modules/EventBus/EventBus.js";

import { auth } from "../shared/api/auth.js";
import { goToPage } from "../shared/helpers/goToPage.js";
import { store } from "./store/index.js";
import { chatWebSocket } from "../shared/api/websocket.js";

export const initDispatcher = () => {
    const onLogout = async () => {
        chatWebSocket.disconnect();
        store.clear();
        await auth.logout();
        goToPage("login");
    };
    eventBus.on("logout", onLogout);

    const onAuthorized = async () => {
        chatWebSocket.connect();
        await store.init();
        eventBus.emit("store: ready");
    };
    eventBus.on("authorized", onAuthorized);
};
