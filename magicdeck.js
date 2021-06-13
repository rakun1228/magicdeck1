    /*context 메뉴 끄기*/  //우클릭 시 나오는 메뉴 없애기
if (document.addEventListener) { // IE >= 9; other browsers
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    }, false);
} else { // IE < 9
    document.attachEvent('oncontextmenu', function() {
        window.event.returnValue = false;
    });
}


var svg = document.getElementById("svg");

let painting = false;
let startX=0, startY=0;

function startPainting(e){

    var x = e.clientX-svg.getBoundingClientRect().left;
    var y = e.clientY-svg.getBoundingClientRect().top;

    x=Math.round((x-23)/14)*14+23;
    y=Math.round((y-21.33)/14)*14+21.33;
    startX = x;
    startY = y;
    painting = true;

    /*새로운 svg 라인*/
    var newLine = document.createElementNS('http://www.w3.org/2000/svg','line');
    newLine.setAttribute('class','line');
    newLine.setAttribute('x1',x);
    newLine.setAttribute('y1',y);
    newLine.setAttribute('x2',x);
    newLine.setAttribute('y2',y);
    newLine.setAttribute("stroke", "black");
    newLine.setAttribute("fill", "black");
    newLine.setAttribute("stroke-width", "3px");
    //마우스가 선 위로 올라가면 파란색, 내려가면 검정색으로 설정
    newLine.addEventListener('mouseover', function(e){
        if(!painting)
            e.target.setAttribute("stroke", "green");
    });
    newLine.addEventListener('mouseleave', function(e){
        e.target.setAttribute("stroke", "black");
    });
    newLine.addEventListener('contextmenu', function(e){
        if(!painting)
            svg.removeChild(e.target);
    });
    svg.append(newLine);


}
function stopPainting(e){
    if(painting){   //선 그리던 도중 우클릭 취소
        painting = false;
        var i = svg.children.length;
        svg.removeChild(svg.children.item(i-1));
        console.log(i+"번째 선 취소");
    }
}
function onMouseMove(e){

    var x = e.clientX-svg.getBoundingClientRect().left;
    var y = e.clientY-svg.getBoundingClientRect().top;

    x=Math.round((x-23)/14)*14+23;
    y=Math.round((y-21.33)/14)*14+21.33;

    if(painting){   //그리는 도중 마우스 움직임
        svg.children.item(svg.children.length-1).setAttribute('x2', x);
        svg.children.item(svg.children.length-1).setAttribute('y2', y);
    }

}

function slicePolygon(poly, line){
    var list = svg.getIntersectionList(poly,line);
    if(list.length>1){

    }
}


svg.addEventListener('mousemove', onMouseMove);
svg.addEventListener('mouseleave', stopPainting);
svg.addEventListener('contextmenu', stopPainting);
svg.addEventListener('click', startPainting);