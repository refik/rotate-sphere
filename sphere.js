$(function() {
    var d_canvas = document.getElementById('canvas');
    window.ctx = d_canvas.getContext('2d');
    
    // Attaching slider event
    $( ".slider" ).slider({
        range: "min",
        value: 20,
        min: -90,
        max: 90,
        slide: function( event, ui ) {
            var index = Number($(this).data('index'))
            rotate_a[index] = ui.value;
            drawAxisCircles();
        }
    });

    drawAxisCircles();
});

// Settings
increase_by = 0.4
r = 200; // radius
rotate_a = [20, 20, 20] // rotation angles

function drawPoint(coor) {
    // If the points z coordinate is less than
    // zero, it is out of view thus, grey.
    if(coor[2] >= 0)
        color = "rgb(0,0,0)";
    else
        color = "rgb(200,200,200)";
    ctx.fillStyle = color
    ctx.fillRect (210 + coor[0], 210 - coor[1], 1, 1);
}

// Degree to radians
function radians(angle) {
    return angle * (Math.PI/180);
}

// Contour of sphere, it is always the same circle
function drawContour() {
    // Draw contour
    for(var i=0; i<360; i+=increase_by) {
        // Drawing circle
        drawPoint([
            Math.sin(radians(i)) * r, 
            Math.cos(radians(i)) * r,
            0 // Anything 0 or above is fine for black point
        ]);
    }
}

// Convert spherical coordinate to x y z coordinate
function sphericalToPoint(ascension, declination) {
    ascension = radians(ascension);
    declination = radians(declination);
    return [
        Math.sin(ascension) * Math.sin(declination) * r,
        Math.cos(declination) * r,
        Math.cos(ascension) * Math.sin(declination) * r
    ];
}

// Turn for x (0), y (1) or z (2) axis
function rotateForAxis(axis, coor, angle) {
    angle = radians(angle);
    static = coor.pop(axis);
    c1 = coor[0];
    c2 = coor[1];

    coor = [
        Math.sin(angle) * c2 + Math.cos(angle) * c1,
        Math.cos(angle) * c2 - Math.sin(angle) * c1
    ];

    coor.splice(axis, 0, static);
    
    return coor;
}

// Turn for all axis rotations
function rotate(coor) {
    return rotateForAxis(
        2, rotateForAxis(
            1, rotateForAxis(
                0, coor, rotate_a[0]), rotate_a[1]), rotate_a[2]);
}

// Draw three axis circles
function drawAxisCircles() {
    // Clear canvas
    ctx.clearRect(0, 0, 420, 420);

    for(var i=0; i<360; i+=increase_by) {
        drawPoint(rotate(sphericalToPoint(0, i)));
    }
    
    for(var i=0; i<360; i+=increase_by) {
        drawPoint(rotate(sphericalToPoint(i, 90)));
    }
    
    for(var i=0; i<360; i+=increase_by) {
        drawPoint(rotate(sphericalToPoint(90, i)));
    }
    
    drawContour()
}


