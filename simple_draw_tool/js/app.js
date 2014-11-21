var svgDoc;
var mode;
var isDrawing;
var draw;

var offsetX,
    offsetY;

window.onload = onLoad;

function onLoad(){
    createSvgDoc();
    createListeners();
}

function createSvgDoc(){
    svgDoc = document.createElementNS('http://www.w3.org/2000/svg', "svg");
    svgDoc.setAttribute('width', "600");
    svgDoc.setAttribute('height', "400");
    svgDoc.setAttribute('fill', "none");
    svgDoc.setAttribute('stroke', "#ff6666");
    svgDoc.setAttribute('stroke-width', "3");
    document.getElementById("svgWrapper").appendChild(svgDoc);

    var rect = document.getElementById("svgWrapper").getBoundingClientRect();
    offsetX = rect.left;
    offsetY = rect.top;
}

function createListeners(){
    var drawModes = ["pencilTool", "lineTool", "rectTool", "ellipseTool"];
    for(var i = 0; i < drawModes.length; i++){
        document.getElementById(drawModes[i]).addEventListener("click", function(){
            mode = this.getAttribute("id");
        })
    }
    svgDoc.addEventListener("mousedown", onMouseDown);
    svgDoc.addEventListener("mousemove", onMouseMove);
    svgDoc.addEventListener("mouseup", onMouseUp);
}

function onMouseDown(event){
    isDrawing = true;
    var xpos = event.clientX - offsetX;
    var ypos = event.clientY - offsetY;

    switch (mode){
        case "pencilTool":
            draw = createNode("polyline", {
                points: [xpos, ypos].join(",")
            });
            svgDoc.appendChild(draw);
            break;
        case "lineTool":
            draw = createNode("line",{
                x1:xpos,
                y1:ypos,
                x2:xpos,
                y2:ypos
            });
            svgDoc.appendChild(draw);
            break;
        case "rectTool":
            draw = createNode("rect",{
                x:xpos,
                y:ypos,
                width:0,
                height:0
            });
            svgDoc.appendChild(draw);
            break;
        case "ellipseTool":
            draw = createNode("ellipse",{
                cx:xpos,
                cy:ypos,
                rx:0,
                ry:0
            });
            svgDoc.appendChild(draw);
            break;

    }
}

function onMouseMove(event){
    if(!isDrawing){
        return;
    }
    var xpos = event.clientX - offsetX;
    var ypos = event.clientY - offsetY;
    switch (mode){
        case "pencilTool":
            var points = draw.getAttribute("points").split(",");
            points.push(xpos, ypos);
            draw.setAttribute("points", points.join(","));
            break;
        case "lineTool":
            draw.setAttribute("x2", xpos);
            draw.setAttribute("y2", ypos);
            break;
        case "rectTool":
            var width = xpos - Number(draw.getAttribute("x"));
            var height = ypos - Number(draw.getAttribute("y"));
            draw.setAttribute("width", width);
            draw.setAttribute("height", height);
            break;
        case "ellipseTool":
            var rx = xpos - Number(draw.getAttribute("cx"));
            var ry = ypos - Number(draw.getAttribute("cy"));
            draw.setAttribute("rx", rx);
            draw.setAttribute("ry", ry);
            break;
    }
    console.log("move :" + (event.clientX - offsetX) + ":" + (event.clientY - offsetY));
}

function onMouseUp(event){
    isDrawing = false;
}

function createNode(name, obj){
    var svgNode = document.createElementNS('http://www.w3.org/2000/svg', name);
    for(var i in obj){
        svgNode.setAttribute(i, obj[i]);
    }
    return svgNode;
}