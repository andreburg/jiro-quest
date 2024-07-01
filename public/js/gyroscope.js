let dataDiv = null;

function onLoad() {

    dataDiv = document.getElementById("data")
    dataDiv.innerHTML = "no data";


}

function permission() {
    confirm("Grant permissions");
    if (typeof (DeviceOrientationEvent) !== "undefined" && typeof (DeviceOrientationEvent.requestPermission) === "function") {
        DeviceOrientationEvent.requestPermission()
            .then(response => {
                if (response == "granted") {
                    window.addEventListener("deviceorientation", handleOrientation, true);
                }
            })
            .catch(console.error)
    } else {
        alert("DeviceOrientationEvent is not defined");
    }
}

function handleOrientation(event) {
    const absolute = event.absolute;
    const alpha = event.alpha;
    const beta = event.beta;
    const gamma = event.gamma;

    dataDiv.innerHTML = alpha;
    alert(alpha)
}

