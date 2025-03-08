export const config = {
    'signup': {
        href: '/signup',
        title: 'Регистрация',
        render: () => {
            const div = document.createElement("div");
            div.textContent = "Это страница регистрации!";
            return div;
        },
    },
    'login': {
        href: '/login',
        title: 'Авторизация',
        render: () => {
            const div = document.createElement("div");
            div.textContent = "Это страница авторизации!";
            return div;
        },
    },
}