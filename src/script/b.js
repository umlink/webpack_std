import Layer from './layer'

let UpHtml = ()=> {
    let dom = document.getElementById('app');
    let layer = new Layer();
    dom.innerHTML = layer.tpl;
    console.log(">>>>>>>>>>>>")
    $(function(){
   	console.log(2222)
});
};

new UpHtml();
