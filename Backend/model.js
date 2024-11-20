const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const tf = require('@tensorflow/tfjs-node');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Load the model
const modelPath = '/kaggle/working/translated_model.json';
let model;
(async () => {
  model = await tf.loadLayersModel(`file://${modelPath}`);
})();

// Helper function to simulate processing delay
function simulateProcessingDelay() {
  return new Promise((resolve) => {
    const delay = Math.random() * (1.4) + 0.1; // Random delay between 0.1 and 1.5 seconds
    setTimeout(resolve, delay * 1000);
  });
}

// Endpoint to handle prediction requests
app.post('/predict', async (req, res) => {
  await simulateProcessingDelay();

  // Get input data from the request
  const data = req.body.input || [];
  if (!Array.isArray(data) || data.length === 0) {
    return res.status(400).json({ "error": "Input data is required and should be an array." });
  }

  try {
    const inputTensor = tf.tensor(data, [1, data.length], 'float32');
    const prediction = model.predict(inputTensor);
    const predictionArray = prediction.arraySync();
    res.json({ "prediction": predictionArray });
  } catch (error) {
    res.status(500).json({ "error": "Error during model prediction", "details": error.message });
  }
});

// Endpoint to get server status
app.get('/status', (req, res) => {
  res.json({ "status": "Server is running", "device": tf.getBackend() });
});

// Endpoint to clear server logs
app.post('/clear_logs', (req, res) => {
  const logPath = 'server_logs.txt';
  if (fs.existsSync(logPath)) {
    fs.unlinkSync(logPath);
  }
  res.json({ "status": "Logs cleared" });
});

// Endpoint to log incoming requests
app.post('/log', (req, res) => {
  const logData = req.body.log || "No log data provided.";
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${logData}\n`;
  fs.appendFileSync('server_logs.txt', logEntry);
  res.json({ "status": "Log entry added" });
});

// Endpoint to get model details
app.get('/model_details', (req, res) => {
  if (model) {
    res.json({ "model_loaded": true, "model_summary": model.summary().toString() });
  } else {
    res.json({ "model_loaded": false, "message": "Model is not loaded yet." });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
