import { createMiddleware } from "seyfert";

export const ownerOnlyMiddleware = createMiddleware<void>((middle) => {
    if (middle.context.author.id !== middle.context.guild("cache")?.ownerId) middle.stop("Only guild owner can use this command");
    middle.next();
});
