import { createApp as createClientApp } from "vue";
import { useUserSession } from "./stores/userSession";
import { createHead } from "@unhead/vue";
import { InferSeoMetaPlugin } from "@unhead/addons";
import { createPinia } from "pinia";
import { createRouter } from "./router";
import VueroApp from "./VueroApp.vue";
import "./styles";
export type VueroAppContext = Awaited<ReturnType<typeof createApp>>;
export type VueroPlugin = (vuero: VueroAppContext) => void | Promise<void>;

const plugins = import.meta.glob<{ default: VueroPlugin }>("./plugins/*.ts");

// this is a helper function to define plugins with autocompletion
export function definePlugin(plugin: VueroPlugin) {
  return plugin;
}

export async function createApp() {
  const app = createClientApp(VueroApp);
  const router = createRouter();

  const head = createHead({
    plugins: [InferSeoMetaPlugin()],
  });
  app.use(head);

  const pinia = createPinia();
  app.use(pinia);

  const userSession = useUserSession();
  const token = userSession.token;
  const socket = new WebSocket(
    `ws://127.0.0.1:8000/ws/chat/notifications/?token=${token}`
  );
  socket.onopen = () => console.log("WebSocket connected!");
  socket.onmessage = (event) => console.log("Message received:", event.data);
  socket.onerror = (error) => console.error("WebSocket error:", error);
  socket.addEventListener("message", (event) => {
    console.log("Received message:", event.data);
  });

  const vuero = {
    app,
    router,
    head,
    pinia,
    WebSocket,
  };

  app.provide("vuero", vuero);
  for (const path in plugins) {
    try {
      const { default: plugin } = await plugins[path]();
      await plugin(vuero);
    } catch (error) {
      console.error(`Error while loading plugin "${path}".`);
      console.error(error);
    }
  }

  // use router after plugin registration, so we can register navigation guards
  app.use(vuero.router);

  return vuero;
}
