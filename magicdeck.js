/*context 메뉴 끄기*/  //우클릭 시 나오는 메뉴 없애기
if (document.addEventListener) { // IE >= 9; other browsers
    document.addEventListener('contextmenu', preventRightClick, false);
} else { // IE < 9
    document.attachEvent('oncontextmenu', function() {
        window.event.returnValue = false;
    });
}
function preventRightClick(e) {
    e.preventDefault();
}


var svg = document.getElementById("svg");
var wrap = document.getElementById("wrap");


let painting = false;
let startX=0, startY=0;
var px = (svg.getBoundingClientRect().right-svg.getBoundingClientRect().left)/28.1;

function startPainting(e){

    var x = e.clientX-svg.getBoundingClientRect().left;
    var y = e.clientY-svg.getBoundingClientRect().top;
    console.log(svg.getBoundingClientRect().right-svg.getBoundingClientRect().left);

    x=Math.round((x)/px)*px+(0.05*px);
    y=Math.round((y)/px)*px;
    console.log("x는 " +x);
    console.log("y는 " +y);

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
    newLine.setAttribute("stroke", "#66230c");
    newLine.setAttribute("fill", "#66230c");
    newLine.setAttribute("stroke-width", "3px");
    //마우스가 선 위로 올라가면 파란색, 내려가면 검정색으로 설정
    newLine.addEventListener('mouseover', function(e){
        if(!painting)
            e.target.setAttribute("stroke", "#f9a400");
    });
    newLine.addEventListener('mouseleave', function(e){
        e.target.setAttribute("stroke", "#66230c");
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

    x=Math.round((x)/px)*px+(0.05*px);
    y=Math.round((y)/px)*px;

    if(painting){   //그리는 도중 마우스 움직임
        svg.children.item(svg.children.length-1).setAttribute('x2', x);
        svg.children.item(svg.children.length-1).setAttribute('y2', y);
    }

}

svg.addEventListener('mousemove', onMouseMove);
svg.addEventListener('mouseleave', stopPainting);
svg.addEventListener('contextmenu', stopPainting);
svg.addEventListener('click', startPainting);

//위에 사진 클릭해서 배경 변경
document.getElementById("back1").addEventListener("click", function(){
 wrap.style.backgroundImage='url("https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fbn3AUz%2Fbtq67SPwYQj%2Fb67tQgirkrnHuapb1xQ0S1%2Fimg.png")';
});
document.getElementById("back2").addEventListener("click", function(){
 wrap.style.backgroundImage='url("https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbbdSP7%2Fbtq67ShF89x%2FHOhH65zTuEa4zXy15dCL41%2Fimg.png")';
});
document.getElementById("back3").addEventListener("click", function(){
    wrap.style.backgroundImage='url("https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2F1iL2Y%2Fbtq7fbHhu9S%2FX4k7HHdfB4VTQZQQrBQvCK%2Fimg.png")';
});

//완성버튼 클릭
document.getElementById("btn_complete").addEventListener("click",function(){
    //이미 완성된 사진이 있는 경우
    if(document.querySelector('#wrap > img')){
        return;
    }
 domtoimage.toPng(document.getElementById("wrap")).then(function (dataUrl) {
        var img = new Image();
        img.src = dataUrl;
        img.style.margin="0 auto";
        img.crossOrigin = "anonymous";
        document.getElementById("wrap").appendChild(img); document.getElementById("wrap").removeChild(document.getElementById("svg"));
  });
    
   //우클릭 풀어주기
    document.removeEventListener('contextmenu',preventRightClick);
    

});

//리셋버튼 클릭
document.getElementById("btn_reset").addEventListener("click",function(){
    var lines = document.querySelectorAll('line');
    lines.forEach(function (line){
        document.getElementById("svg").removeChild(line);
    });
    
    //사진 있는 상태로 리셋 누름
    if(document.querySelector('#wrap > img')){
        document.getElementById("wrap").removeChild(document.querySelector('#wrap > img'));
        
        svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
        svg.setAttribute('id',"svg");
        svg.addEventListener('mousemove', onMouseMove);
        svg.addEventListener('mouseleave', stopPainting);
        svg.addEventListener('contextmenu', stopPainting);
        svg.addEventListener('click', startPainting);
        document.getElementById("wrap").append(svg);
        document.addEventListener('contextmenu',preventRightClick);
        
    }
});

//창 해상도 변경
window.addEventListener('resize', function(){
    console.log('px는'+px);
    for(var i=0;i<svg.children.length;i++){
        
        var x1 = (svg.children.item(i).getAttribute('x1')/px)*((svg.getBoundingClientRect().right-svg.getBoundingClientRect().left)/28.1);
        var x2 = (svg.children.item(i).getAttribute('x2')/px)*((svg.getBoundingClientRect().right-svg.getBoundingClientRect().left)/28.1);
        var y1 = (svg.children.item(i).getAttribute('y1')/px)*((svg.getBoundingClientRect().right-svg.getBoundingClientRect().left)/28.1);
        var y2 = (svg.children.item(i).getAttribute('y2')/px)*((svg.getBoundingClientRect().right-svg.getBoundingClientRect().left)/28.1);
        
        
        svg.children.item(i).setAttribute('x1', x1);
        svg.children.item(i).setAttribute('x2', x2);
        svg.children.item(i).setAttribute('y1', y1);
        svg.children.item(i).setAttribute('y2', y2);
    }
    px = (svg.getBoundingClientRect().right-svg.getBoundingClientRect().left)/28.1;
});