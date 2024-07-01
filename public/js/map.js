console.log("map.js loaded")

document.addEventListener('DOMContentLoaded', (event) => {
    createMapGrid();
});

cols = 10;
rows = 10;

function createMapGrid() {
    const canvas = document.createElement('canvas');
    canvas.id = 'gameCanvas';
    canvas.width = window.innerWidth*0.9;
    canvas.height = window.innerHeight*0.9;
    canvas.style.border = '1px solid black';
    document.body.append(canvas);

    const context = canvas.getContext('2d');
    colsWidth = (canvas.width / cols);
    rowsHeight = (canvas.height / rows);

    for (let x = 0; x <= cols; x++) {
        context.beginPath();
        context.moveTo(x*colsWidth , 0);
        context.lineTo(x*colsWidth, rows*rowsHeight );
        context.lineWidth = 5;
        context.stroke();
    }

    for (let y = 0; y <= rows; y++) {
        context.beginPath();
        context.moveTo(0, y*rowsHeight );
        context.lineTo(cols*colsWidth , y*rowsHeight );
        context.lineWidth = 5;
        context.stroke();
    }
    
    
}

function drawGrid(context) {
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before drawing


}




