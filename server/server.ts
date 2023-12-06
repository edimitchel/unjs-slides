import {
  appendHeader,
  createApp,
  createRouter,
  eventHandler,
  handleCors,
  send,
  sendError,
  sendNoContent,
} from "h3";
import { startTunnel } from "untun";
import { renderSVG } from "uqr";

const app = createApp();
const router = createRouter();
let vote = 0;

startTunnel({ port: 3000 }).then((tunnel) => {
  router.get(
    "/upvote",
    eventHandler((event) => {
      vote++;

      return sendNoContent(event);
    })
  );

  router.get(
    "/downvote",
    eventHandler((event) => {
      vote--;
      return sendNoContent(event);
    })
  );

  router.get(
    "/votes",
    eventHandler((event) => {
      handleCors(event, { origin: "*" });
      return vote;
    })
  );

  router.get(
    "/qrcode/:type",
    eventHandler(async (event) => {
      const type = event.context.params?.type as "up.svg" | "down.svg";
      if (!["up.svg", "down.svg"].includes(type))
        return sendError(event, new Error("only up and down"));

      appendHeader(event, "Content-Type", "image/svg+xml");
      appendHeader(event, "Content-Disposition", "inline");

      if (type === "up.svg") {
        return send(event, renderSVG((await tunnel?.getURL()) + "/upvote"));
      } else if (type === "down.svg") {
        return send(event, renderSVG((await tunnel?.getURL()) + "/downvote"));
      }
    })
  );
});

app.use(router);

export default app;
