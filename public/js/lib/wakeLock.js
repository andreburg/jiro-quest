window.addEventListener("load", (event) => {
    // Create a reference for the Wake Lock.
    let wakeLock = null;

    // create an async function to request a wake lock
    try {
        navigator.wakeLock.request("screen").then((wl) => {
            wakeLock = wl;
        });
    } catch (err) {
        // The Wake Lock request has failed - usually system related, such as battery.
        console.error("Wake Lock request has failed: " + err + ".");
    }
    document.addEventListener("visibilitychange", async () => {
        if (wakeLock !== null && document.visibilityState === "visible") {
            wakeLock = await navigator.wakeLock.request("screen");
        }
    });
});