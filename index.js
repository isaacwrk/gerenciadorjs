let fields = document.querySelectorAll("#form-user-create [name]")
//Criando o JSON
let user = {}

document.getElementById("form-user-create").addEventListener("submit", function(event){
    //cancelar o comportamento padrão deste evento.
    event.preventDefault();

    fields.forEach(function(field, index){
        if(field.name == "gender" && field.checked == true){
            user[field.name] = field.value
        }else{
            user[field.name] = field.value
        }
    })
    console.log(user)
    
})