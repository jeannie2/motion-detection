import * as handTrack from "handtrackjs";
import "hammer-simulator";
import { moveCircles } from "./movement.js";

const start = async (
  element,
  video,
  canvas,
  // object being destructured is 4th argument passed to start function
  {
    model = null,
    modelParams = {},
    transform = (prediction, video, target) => ({
      // position element based on center of hand.
      x:
        ((prediction.bbox[0] + 0.5 * prediction.bbox[2]) / 100) *
          target.offsetWidth +
        target.offsetLeft,
      y:
        ((prediction.bbox[1] + 0.5 * prediction.bbox[3]) / 100) *
          target.offsetHeight +
        target.offsetTop,

      target: target
    })
  } = {}
  // modelParams parameter assigned default value of empty object {}. If no modelParams object provided when calling start function, it will default to empty object
) => {
  // modelParams object is defined and initialized with some default values. These values control the behavior of the hand detection mode
  modelParams = {
    flipHorizontal: true, // flip e.g for video
    maxNumBoxes: 2, // maximum number of boxes to detect
    iouThreshold: 0.5, // ioU threshold for non-max suppression
    scoreThreshold: 0.6, // confidence threshold for predictions.
    ...modelParams
  };

  const videoStatus = await handTrack.startVideo(video);
  if (!videoStatus) throw "Start video failed";
  if (!model) model = await handTrack.load(modelParams);

  const context = canvas.getContext("2d");
  let lastPredictions = [];
  let touches = [];

  function runDetection() {
    model.detect(video).then((predictions) => {
      model.renderPredictions(predictions, canvas, context, video);

      // if no previous predictions and current predictions are not empty
      if (lastPredictions.length === 0 && predictions.length > 0) {
        // console.log("FIRST CLAUSE"); // 18 logs
        // console.log("lastPredictions: " + lastPreditions); // 18 logs
        // creates new array (touches) by mapping over predictions array. For each prediction in predictions array, the transform function is called with the prediction, video, and element as arguments. The result of each transform call is stored in touches array
        touches = predictions.map((prediction) =>
          transform(prediction, video, element)
        );
        Simulator.events.touch.trigger(touches, touches[0].target, "start");
      }
      // if no current predictions but there were previous predictions, it means that the hand movement has stopped, so it maps the last predictions to touch coordinates and triggers an "end" touch event.
      else if (predictions.length === 0 && lastPredictions.length > 0) {
        // console.log("SECOND CLAUSE"); // when stop moving
        touches = lastPredictions.map((prediction) =>
          transform(prediction, video, element)
        );
        Simulator.events.touch.trigger(touches, touches[0].target, "end"); // should be more -touches[1] too?
      }
      // if current predictions, it means that the hand movement is ongoing
      else if (predictions.length > 0) {
        // console.log("THIRD CLAUSE"); // 800 logs
        touches = predictions.map((prediction) =>
          transform(prediction, video, element)
        );
        Simulator.events.touch.trigger(touches, touches[0].target, "move");
      }
      lastPredictions = predictions;

      requestAnimationFrame(runDetection);

      // console.log("touches inside: " + JSON.stringify(touches));

      document.getElementById("valuesText").textContent = JSON.stringify(
        touches
      );

      requestAnimationFrame(() =>
        moveCircles(touches, predictions, lastPredictions)
      );
    });
  }

  // console.log("touches outside: " + touches);

  runDetection();
};

const options = {
  transform: function (prediction, target) {
    return {
      x: (prediction.bbox[0] + 0.5 * prediction.bbox[2]) * 100,
      y: (prediction.bbox[1] + 0.5 * prediction.bbox[3]) * 100,
      target: target
    };
  }
};

const video = document
  .getElementById("handtrackjs")
  .getElementsByTagName("video")[0];
video.width = 320;
video.height = 240;
const canvas = document
  .getElementById("handtrackjs")
  .getElementsByTagName("canvas")[0];
// const context = canvas.getContext("2d");

const element = document.getElementById("hit1");

start(element, video, canvas, options);

// export { start };
/* X: 246 to 1600 
Y: 290 to 970 ish */
