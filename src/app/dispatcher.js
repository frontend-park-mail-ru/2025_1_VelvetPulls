import { eventBus } from "../shared/modules/EventBus/EventBus.js";

import { auth } from "../shared/api/auth.js";
import { goToPage } from "../shared/helpers/goToPage.js";
import { store } from "./store/index.js";

export const initDispatcher = () => {
    const onLogout = async () => {
        await auth.logout();
        store.clear();
        goToPage("login");
    };
    eventBus.on("logout", onLogout);

    const onAuthorized = () => {
        store.init();
    };
    eventBus.on("authorized", onAuthorized);
};
