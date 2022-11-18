import Geolocation from "@react-native-community/geolocation";
import BackgroundService from "react-native-background-actions";
import { Colors } from "../styles";

export const sleep = (time) =>
  new Promise((resolve) => setTimeout(() => resolve(), time));

// You can do anything in your task such as network requests, timers and so on,
// as long as it doesn't touch UI. Once your task completes (i.e. the promise is resolved),
// React Native will go into "paused" mode (unless there are other tasks running,
// or there is a foreground app).
export const veryIntensiveTask = async (taskDataArguments) => {
  // Example of an infinite loop task
  console.log("sssssss");
  const { delay } = taskDataArguments;
  await new Promise(async (resolve) => {
    for (let i = 0; BackgroundService.isRunning(); i++) {
      console.log(i);
      try {
        await Geolocation.watchPosition(
          (lastPosition) => {
            console.log(lastPosition);
            // var { distanceTotal, record } = this.state;
            // this.setState({ lastPosition });
            // if (record) {
            //   var newLatLng = {
            //     latitude: lastPosition.coords.latitude,
            //     longitude: lastPosition.coords.longitude,
            //   };

            //   this.setState({ track: this.state.track.concat([newLatLng]) });
            //   this.setState({
            //     distanceTotal: distanceTotal + this.calcDistance(newLatLng),
            //   });
            //   this.setState({ prevLatLng: newLatLng });
            // }
          },
          (error) => alert(JSON.stringify(error)),
          { enableHighAccuracy: true, distanceFilter: 100 }
        );
        // Geolocation.watchPosition((data) => {
        //   console.log("LOACATION", data);
        // });
      } catch (error) {}

      //   await BackgroundService.updateNotification({
      //     taskTitle: "test"
      //   })
      await sleep(delay);
    }
  });
};

export const options = {
  taskName: "Cypro",
  taskTitle: "Cypro title",
  taskDesc: "Cypro description",
  taskIcon: {
    name: "ic_launcher",
    type: "mipmap",
  },
  color: Colors.PINK,
  linkingURI: "yourSchemeHere://chat/jane", // See Deep Linking for more info
  parameters: {
    delay: 10000,
  },
};

// await BackgroundService.start(veryIntensiveTask, options);
// await BackgroundService.updateNotification({
//   taskDesc: "New ExampleTask description",
// }); // Only Android, iOS will ignore this call
// // iOS will also run everything here in the background until .stop() is called
// await BackgroundService.stop();
