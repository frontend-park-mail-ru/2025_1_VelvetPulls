import { eventBus } from "../shared/modules/EventBus/EventBus.js";

import { auth } from "../shared/api/auth.js";
import { goToPage } from "../shared/helpers/goToPage.js";
import { currentUser } from "../entities/User/model/User.js";

export const initDispatcher = () => {
    const logout = async () => {
        await auth.logout();
        goToPage("login");
    };
    eventBus.on("logout", logout);

    const afterAuthIsPassed = () => {
        currentUser.init(null);
    };
    eventBus.on("auth is passed", afterAuthIsPassed);
};
