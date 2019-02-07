const port = 3000;
const host = 'localhost';
const url = "http://" + host + ":" + port;

var myIngredients = [];
var recipes = [];
var inputErrorStyle = "border: solid #EE5452 2px";
var defaultInputStyle = "border: solid #CCC 1px";
var maxMissingIngredients = 0;
var xmlHttpReq = new XMLHttpRequest();

jsonServerRequest("recipes");

function jsonServerRequest(resource) {
    
   xmlHttpReq.onreadystatechange = function() {
      if(xmlHttpReq.readyState === XMLHttpRequest.DONE && xmlHttpReq.status === 200) {
         var data = JSON.parse(xmlHttpReq.responseText);
         recipes = data;
         console.log("Dados recebidos com sucesso");
         refreshList();
     }
   }
   
   xmlHttpReq.open('GET', url + "/" + resource);
   xmlHttpReq.send();
}

/**
 * Funcao de callback chamada pela função refreshList. 
 * Esta função afiltra receitas que possuem os o maximo de ingredientes faltantes.
 * @param {Object} recipe
 */
function recipeFilter(recipe) {
   var has = 0;

   recipe.ingredients.forEach(function(ri){

      ri.name = ri.name.toLowerCase();
      ri.amount = ri.amount.toLowerCase();
      ri.unit = ri.unit.toLowerCase();

      var found = myIngredients.find(function(mi){
         return mi.name == ri.name && mi.amount >= ri.amount && mi.unit == ri.unit;
      });

      if (found){
         has += 1;
      }

   });

   var missingIngredients = recipe.ingredients.length - has;
   if(missingIngredients > maxMissingIngredients){
      return false;
   }

   return true;
}

/**
 * Remove todos os filhos de um elemento DOM.
 * 
 * @param {String} id identificador do elemento pai
 */
function removeAllChildren(id){
   var parent = document.getElementById(id);
   var rangeObj = new Range();
   rangeObj.selectNodeContents(parent);
   rangeObj.deleteContents();
}

/**
 * Adiciona um novo item na lista na lista de 'meus ingredientes'
 */
var add = function(){
   var ingredNode = document.getElementById('ingredient-name');
   var amountNode = document.getElementById('ingredient-amount');
   var unitNode = document.getElementById('ingredients-units');
   var name = ingredNode.value.toLowerCase();
   var amount = amountNode.value.toLowerCase();
   var unit = unitNode.value.toLowerCase();

   var ingredient = {
      'name': name,
      'amount': amount,
      'unit': unit
   };

   // validação de campos
   if (ingredient.name == "")
      ingredNode.style = inputErrorStyle;
   else
      ingredNode.style = defaultInputStyle;

   if (ingredient.amount <= 0)
      amountNode.style = inputErrorStyle;
   else
      amountNode.style = defaultInputStyle;
   
   if (ingredient.amount <= 0 || ingredient.name == "") 
      return;

   var index = myIngredients.push(ingredient) - 1;

   var unit = ingredient.amount > 1 ? ingredient.unit + "s" : ingredient.unit; // ajuste para palavra no plural
   var text = ingredient.amount + " " 
            + unit + " de " 
            + ingredient.name;

   addToList('my-ingredients-list', text, "item-" + index, "list-item"); 
   refreshList();

}

/**
 * Função asincrona que atualiza uma lista de itens usando um filtro.
 * 
 * @param {String} id ID da lista a ser atualizada.
 * @returns um array de receitas atualizado.
 */
async function refreshList(id = 'recipes-list') {

   removeAllChildren(id); // remove todos os itens da lista
   
   // Filtra todas as receitas que podem ser realizadas com o conjunto de ingredientes
   // e adiciona na lista de receitas que podem ser feitas
   if (!recipes){
      console.error("Receitas nao carregadas");
      return;
   }

   let r = recipes.filter(recipeFilter);
   r.forEach(function(element, index) {
      addToList(id, element.name, "item-" + index ,"list-item", onClickItem);
   });

   // Caso nenhum item seja adicionado a lista.
   if (r.length <= 0){
      document.getElementById('recipe-details').style.display = "none";
      addToList(id, "Nenhuma receita . . .", "", "");
   }

   return r;
}

/**
 * Adiciona um item em um HTMLElement do tipo lista.
 * 
 * @param {String} listId ID do nó pai
 * @param {String} text elemento textual do novo item
 * @param {String} id ID do novo item da lista
 * @param {String} classes classes do novo item da lista
 * 
 * @returns referencia para o item adicionado na lista.
 */
var addToList = function(listId = "", text = "", id = "", classes = "", onclick){
  
   var list = document.getElementById(listId);
   var li = document.createElement("li");

   li.appendChild(document.createTextNode(text));
   li.setAttribute("id", id);
   li.setAttribute("class", classes);

   // Adiciona evento: ao clicar mostra todos os detalhes da receita selecionada
   li.addEventListener("click", onclick, false);
   
   list.appendChild(li);
   return li;

}

/**
 * Esta funcao é chamada somente quando acontece um event 'onkeyup' no input 
 * de id = 'max-missing-ingredients', atualizando uma lista de itens.
 * @param {HTMLINPUTElement} element elemento que disparou o evento
 */
var onInputChange = function(element) {
   if (element.value != ""){
      maxMissingIngredients = element.value;
      refreshList();
   }
}

var validadeName = function(element) {
   if (element.value == ""){
      element.style = inputErrorStyle;
   }else{
      element.style = defaultInputStyle;
   }
}

var validateAmount = function(element) {
   if (element.value <= 0){
      element.value = 1;
      element.style = inputErrorStyle;
   }else{
      element.style = defaultInputStyle;
   }
}

/**
 * Esta funcao é chamada quando um item da lista 'recipes-list' é clicado, exibindo
 * todos os detalhes do item clicado.
 */
var onClickItem = function() {
   var element = event.path[0]; // elemento que acionou o evento

   var recipe = recipes.find(function(value){
      if ( value.name == element.innerHTML)
         return true;
      else 
         return false;
   });
   
   document.getElementById('recipe-details').style.display = "inline";
   document.getElementById('recipe-name').innerHTML = recipe.name;

   removeAllChildren('recipe-ingredients');
   var ul = document.getElementById('recipe-ingredients');

   // adiciona os ingredientes na lista de detalhes da receita
   for(var i in recipe.ingredients){
      
      var li = document.createElement("li");
      var text = recipe.ingredients[i].amount + " " + recipe.ingredients[i].unit + " " + recipe.ingredients[i].name;
      li.appendChild(document.createTextNode(text));
      ul.appendChild(li);
   }

   // adiciona o 'modo de preparo' nos detalhes da receita
   if (recipe.hasOwnProperty("description")){
      document.getElementById('details').innerHTML = recipe.description;
   }  

}