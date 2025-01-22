import tf from "@tensorflow/tfjs";
import path from "path";
import { fileURLToPath } from "url";

// Get the current directory of the module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the model using an absolute path
const modelPath = path.join(__dirname, "../AI-models/ventilator_lstm_model.h5"); // Use .json for the model
let model;

const m = tf.variable(tf.tensor(4.0));
console.log(m);

(async () => {
  model = await tf.loadLayersModel(modelPath);
  console.log("Model loaded successfully");
})();
