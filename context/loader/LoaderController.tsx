type LoaderHandler = {
  show: () => void;
  hide: () => void;
};

class LoaderControllerClass {
  private handler: LoaderHandler | null = null;

  register(handler: LoaderHandler) {
    this.handler = handler;
  }

  show() {
    this.handler?.show();
  }

  hide() {
    this.handler?.hide();
  }
}

export const LoaderController = new LoaderControllerClass();
