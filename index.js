

let fields = document.querySelectorAll("#form-user-create [name]")
//Criando o JSON
let user = {}

function addLine(dataUser){
    console.log(dataUser)
    let tr = document.createElement("tr")
    tr.innerHTML = `
    <tr>
        <td><img src="dist/img/user1-128x128.jpg" alt="User Image" class="img-circle img-sm"></td>
        <td>${dataUser.name}</td>
        <td>${dataUser.email}</td>
        <td>${dataUser.admin}</td>
        <td>${dataUser.birth}</td>
        <td>
    <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
    <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
        </td>
    </tr>
    `
    document.getElementById('table-users').appendChild(tr)

}

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

    let objectUser = new User(
        user.name,
        user.gender,
        user.birth,
        user.country,
        user.email,
        user.password,
        user.photo,
        user.admin
        )
        
    addLine(objectUser)
    
})