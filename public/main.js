const input = document.getElementById("input");
const button = document.getElementById("button");
const right = document.querySelector(".right");
const middle = document.querySelector(".middle");
const middleinput = document.getElementById("middleinput");
const middlebutton = document.getElementById("middlebutton");
const defcity = ["Mumbai","Chennai","Bangalore"];
var locarray = [];
var fromloc = [];
var initdata = "";
var counter = 1;

if(localStorage.getItem("locarr") == null || localStorage.getItem("locarr") == ""){
    locarray = [];
    for(var i=0;i<defcity.length;i++){
        const main = document.createElement("div");
        main.setAttribute("class","invalid");
        main.innerText = "Loading....";
        right.appendChild(main);
        axios.post("/weather",{
            data: defcity[i]
        })
        .then((result) => {
            right.removeChild(main);
            elementfunc(result);
        })
        .catch(err => console.log("error"));
    }    
}
else{
    fromloc = localStorage.getItem("locarr");
    var newarr = fromloc.split(",");
    locarray = newarr;
    for(var i=0;i<newarr.length;i++){
        const main = document.createElement("div");
        main.setAttribute("class","invalid");
        main.innerText = "Loading....";
        right.appendChild(main);
        axios.post("/weather",{
            data: newarr[i]
        })
        .then((result) => {
            right.removeChild(main);
            elementfunc(result);
        })
        .catch(err => console.log(err));
    }
}

button.addEventListener("click",() => {
    if(input.value == ""){
        return;
    }
    const main = document.createElement("div");
    main.setAttribute("class","invalid");
    main.innerText = "Loading....";
    right.appendChild(main);
    axios.post("/weather",{
        data: input.value
    })
    .then((result) => {
        input.value = "";
        if(result.data.success == false){
            right.removeChild(main);
            const div = document.createElement("div");
            div.setAttribute("class","invalid");
            div.innerText = "Invaild city";
            right.appendChild(div);
            setTimeout(() => {
                right.removeChild(div);
            },2000);
            return;
        }
        if(result.data.request.query != undefined){
            right.removeChild(main);
            if(locarray.indexOf(result.data.location.name.toLowerCase()) == -1){
                locarray.push(result.data.location.name);
                localStorage.setItem("locarr",locarray);
            }
            elementfunc(result);
        }
    })
    .catch(err => console.log(err));
});

var elementfunc = (result) => {
    const main = document.createElement("div");
    const temp = document.createElement("div");
    const imgdiv = document.createElement("div");
    const city = document.createElement("div");
    const remove = document.createElement("div");
    const x = document.createElement("div");
    const div1 = document.createElement("div");
    const div2 = document.createElement("div");
    const p1 = document.createElement("p");
    const p2 = document.createElement("p");
    const img = document.createElement("img");

    main.setAttribute("class","weather");
    main.setAttribute("city-data",result.data.location.name);
    temp.setAttribute("class","temp");
    imgdiv.setAttribute("class","img");
    city.setAttribute("class","city");
    city.innerText = `${result.data.location.name}`;
    remove.setAttribute("class","remove");
    x.setAttribute("class","x");
    img.setAttribute("class","weatherimg");
    img.setAttribute("src",result.data.current.weather_icons);
    p1.textContent = `${result.data.current.temperature}`;
    p2.textContent = `${result.data.current.weather_descriptions[0]}`;

    x.appendChild(div1);
    x.appendChild(div2);
    remove.appendChild(x);
    imgdiv.appendChild(img);
    temp.appendChild(p1);
    temp.appendChild(p2);
    main.appendChild(temp);
    main.appendChild(imgdiv);
    main.appendChild(city);
    main.appendChild(remove);
    right.appendChild(main);

    x.addEventListener("click",(e) => {
        console.log(e.target.parentElement.parentElement.parentElement);
        var name = e.target.parentElement.parentElement.parentElement.getAttribute("city-data");
        console.log(name);
        var rdiv = document.querySelector("[city-data='" + name + "']");
        right.removeChild(rdiv);
        if(localStorage.getItem("locarr") != null){
            var arr = localStorage.getItem("locarr");
            var againarr = arr.toLowerCase().split(",");
            var index = againarr.indexOf(name.toLowerCase());
            if(index != -1){
                againarr.splice(index,1);
                localStorage.setItem("locarr",againarr);
            }
        }
    });
}

var runinitial = (val) => {
    const outerdiv = document.createElement("div");
    const pa = document.createElement("p");
    outerdiv.setAttribute("class","elsediv");
    pa.innerText = "Loading....";
    outerdiv.appendChild(pa);
    middle.appendChild(outerdiv);
    axios.get("/v2/top-headlines",{
        params:{
            category: val
        }
    })
    .then(result => {
        if(result.data.articles.length != 0){
            middle.removeChild(outerdiv);
            for(var i=0;i<result.data.articles.length;i++){
                addnew(result,i);
            }
        }
        else{
            middle.removeChild(outerdiv);
            const innerdiv = document.createElement("div");
            const p = document.createElement("p");
            innerdiv.setAttribute("class","elsediv");
            p.innerText = "No posts available";
            innerdiv.appendChild(p);
            middle.appendChild(innerdiv);
            setTimeout(() => {
                middle.removeChild(innerdiv);
            },2000);
        }
    }).catch(err => console.log(err));
}

runinitial(initdata);

var addnew = (result,ind) => {
    const innerdiv = document.createElement("div");
    const p = document.createElement("p");
    const a = document.createElement("a");

    innerdiv.setAttribute("class","card");
    innerdiv.style.background = `url(${result.data.articles[ind].urlToImage})`;
    a.setAttribute("href",result.data.articles[ind].url);
    a.setAttribute("target","_blank");
    a.innerText = `${result.data.articles[ind].title}`;

    p.appendChild(a);
    innerdiv.appendChild(p);
    middle.appendChild(innerdiv);
}

var removetoadd = () => {
    const ele = document.querySelectorAll(".card");
    const ele1 = document.querySelectorAll(".elsediv");
    const ele2 = document.querySelectorAll(".loaddiv");
    for(var i=0;i<ele.length;i++){
        middle.removeChild(ele[i]);
    }
    for(var i=0;i<ele1.length;i++){
        middle.removeChild(ele1[i]);
    }
    for(var i=0;i<ele2.length;i++){
        middle.removeChild(ele2[i]);
    }
}

var categoryfunc = (obj) => {
    removetoadd();
    if(obj.innerText != "Top Headlines"){
        runinitial(obj.innerText.toLowerCase());
    }
    else{
        runinitial(initdata);
    }
}

var queryfunc = (theval,counter) => {
    const outerdiv = document.createElement("div");
    const pa = document.createElement("p");
    outerdiv.setAttribute("class","elsediv");
    pa.innerText = "Loading....";
    outerdiv.appendChild(pa);
    middle.appendChild(outerdiv);
    axios.get("/v2/everything",{
        params:{
            q: theval,
            page: counter
        }
    })
    .then(result => {
        if(result.data.articles.length != 0){
            middle.removeChild(outerdiv);
            for(var i=0;i<result.data.articles.length;i++){
                addnew(result,i);
            }
            if(counter < 5){
                const loaddiv = document.createElement("div");
                const loadp = document.createElement("p");
                loaddiv.setAttribute("class","loaddiv");
                loadp.innerText = "Load more";
                loaddiv.appendChild(loadp);
                middle.appendChild(loaddiv);
                loadp.addEventListener("click",() => {
                    counter = counter + 1;
                    queryfunc(theval,counter);
                    middle.removeChild(loaddiv);
                });
            }
        }
        else{
            middle.removeChild(outerdiv);
            const innerdiv = document.createElement("div");
            const p = document.createElement("p");
            innerdiv.setAttribute("class","elsediv");
            p.innerText = "No posts available";
            innerdiv.appendChild(p);
            middle.appendChild(innerdiv);
            setTimeout(() => {
                middle.removeChild(innerdiv);
                runinitial(initdata);
            },2000);
        }
    }).catch(err => console.log(err));
}

middlebutton.addEventListener("click",() => {
    var indata = middleinput.value;
    middleinput.value = "";
    counter = 1;
    if(indata == ""){
        return;
    }
    removetoadd();
    queryfunc(indata,counter);
});