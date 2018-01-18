import fetch from 'isomorphic-fetch';

var pizzaList;
document.addEventListener("DOMContentLoaded", function() {
    var text = '';
    var parent = document.getElementById('parent');
   var createLoadingText = function(bool){
       if(bool){
           var para = document.createElement('p');
           para.innerHTML = 'loading...';
           parent.appendChild(para);
       } else {
           while (parent.hasChildNodes()) {
               parent.removeChild(parent.lastChild);
           }
       }
   }
    createLoadingText(true);
    fetch('/pizza.json')
        .then(function(response) {
            createLoadingText(false);
            if (response.status >= 400) {
                throw new Error("Bad response from server");
            }
            return response.json();
        })
        .then(function(data) {
            pizzaList = data.pizzas;

            var input= document.createElement('input');
            var parent = document.getElementById('parent');
            var main = document.getElementById('main');


            var button = document.createElement('button');
            button.innerHTML = 'Sort';
            main.appendChild(button);
            main.appendChild(input);
            button.onclick = function(){
                sortList();
            }
            var sortList = function(){
                removeList();
                pizzaList.filter(function(item){
                    if(text.length > 0){
                        return item.toLowerCase().includes(text.toLowerCase());
                     }else{
                        return item;
                    }
                }).sort((a,b)=>{
                    var nameA = a.toLowerCase();
                    var nameB = b.toLowerCase();
                    if (nameB < nameA) {
                        return -1;
                    }
                    if (nameB > nameA) {
                        return 1;
                    }
                    return 0;
                    }).map(function(item){
                        var node = document.createElement("LI");
                        var textnode = document.createTextNode(item);
                        node.appendChild(textnode);
                        parent.appendChild(node);
                    })
            }

            input.addEventListener('input', function(e) {createDom(e), text = e.target.value});
            for(var i=0;i<pizzaList.length;i++){
                var node = document.createElement("LI");
                var textnode = document.createTextNode(pizzaList[i]);
                node.appendChild(textnode);
                parent.appendChild(node);
            }
            function removeList(){
                while (parent.hasChildNodes()) {
                    parent.removeChild(parent.lastChild);
                }
            }
            function createDom(event){
                removeList();
                pizzaList.filter(function(item){
                    return item.toLowerCase().includes(event.target.value.toLowerCase());
                })
                    .forEach(function(item){
                        var node = document.createElement("LI");
                        var textnode = document.createTextNode(item);
                        node.appendChild(textnode);
                        parent.appendChild(node);
                    })
                }
        });
});
