import { StrictMode } from "react";
import { render } from "react-dom";
import App from "./App";
import { worker } from "./mocks/browser";
import { Provider } from "react-redux";
import store from "./store";

const rootElement = document.getElementById("root");
//const root = render.createRoot(rootElement);

// Disregard - we're just setting up a mock service for you to interact with :)
worker.start({ quiet: true }).then(() =>
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    rootElement
  )
);
