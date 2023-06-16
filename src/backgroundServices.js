import ForegroundService from "@supersami/rn-foreground-service";

class BackgroundServices {
  static start = () => {
    ForegroundService.start({
      id: 1,
      title: "Location Service",
      message: "Running...",
      importance: "min",
    });
  };

  static stop = () => {
    ForegroundService.stop();
  };
}

export default BackgroundServices;
