import { getAvatar } from "../../../shared/helpers/getAvatar.js";

export const getReviews = async () => {
    const reviews = [
        {
            avatarSrc: await getAvatar(null),
            username: "ruslantus228",
            rate: 5,
            comment:
                "Супер гуд жфдлывоа ффжыдлвао фыжвдла фывждлао фыждао фыжа жавождвлоа фджывлао фыждлваофы да",
        },
        {
            avatarSrc: await getAvatar(null),
            username: "ruslantus228",
            rate: 5,
            comment: "",
        },
        {
            avatarSrc: await getAvatar(null),
            username: "ruslantus228",
            rate: 5,
            comment: "",
        },
        {
            avatarSrc: await getAvatar(null),
            username: "ruslantus228",
            rate: 5,
            comment: "Супер гуд",
        },
        {
            avatarSrc: await getAvatar(null),
            username: "ruslantus228",
            rate: 5,
            comment: "Супер гуд",
        },
        {
            avatarSrc: await getAvatar(null),
            username: "ruslantus228",
            rate: 5,
            comment: "Супер гуд",
        },
        {
            avatarSrc: await getAvatar(null),
            username: "ruslantus228",
            rate: 5,
            comment: "Супер гуд",
        },
        {
            avatarSrc: await getAvatar(null),
            username: "ruslantus228",
            rate: 5,
            comment: "Супер гуд",
        },
        {
            avatarSrc: await getAvatar(null),
            username: "ruslantus228",
            rate: 5,
            comment: "Супер гуд",
        },
        {
            avatarSrc: await getAvatar(null),
            username: "ruslantus228",
            rate: 5,
            comment: "Супер гуд",
        },
        {
            avatarSrc: await getAvatar(null),
            username: "ruslantus228",
            rate: 5,
            comment: "Супер гуд",
        },
        {
            avatarSrc: await getAvatar(null),
            username: "ruslantus228",
            rate: 5,
            comment: "Супер гуд",
        },
        {
            avatarSrc: await getAvatar(null),
            username: "ruslantus228",
            rate: 5,
            comment: "Супер гуд",
        },
    ];

    for (const review of reviews) {
        let hasComment = false;
        if (review["comment"] !== "") {
            hasComment = true;
        }
        review["hasComment"] = hasComment;
    }

    return reviews;
};
