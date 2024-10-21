const video = document.getElementById('video');
const description = document.getElementById('description');
const captureButton = document.getElementById('captureButton');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Load the MobileNet model
let net;
async function loadModel() {
    net = await mobilenet.load();
    console.log("Model loaded.");
}

// Access the device camera
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(error => {
        console.error("Error accessing camera: ", error);
    });

// Capture image and recognize the object
captureButton.addEventListener('click', async () => {
    // Draw the current video frame to the canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Classify the image
    const img = tf.browser.fromPixels(canvas);
    const predictions = await net.classify(img);
    
    // Get the most likely prediction
    const result = predictions[0]; // get the top result
    const label = result.className;
    const confidence = result.probability;

    // Display the description
    description.innerText = `I see: ${label} with ${Math.round(confidence * 100)}% confidence.`;

    // Convert text to speech
    const utterance = new SpeechSynthesisUtterance(`I see: ${label}`);
    window.speechSynthesis.speak(utterance);
});

// Load the model when the window loads
window.onload = () => {
    loadModel();
};
