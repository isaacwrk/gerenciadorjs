class UserController{

    constructor(formId, tableId){
        this.formEl = document.getElementById(formId)
        this.tableEl = document.getElementById(tableId)

        this.onSubmit();
    }

    onSubmit(){
        
        this.formEl.addEventListener("submit",event=>{
            //cancelar o comportamento padrão deste evento.
            event.preventDefault();
            let values = this.getValues()

            this.getPhoto().then((content)=>{
                values.photo = content
                this.addLine(values)
            },(e)=>{
                console.error(e)
            })
        })

    }

    getPhoto(){
        //Utilizando API Javascript para leitura de arquivos
        //Inserindo nova Promise
        return new Promise((resolve, reject)=>{
            let fileReader = new FileReader();
        
        let elements = [...this.formEl.elements].filter(item =>{
            if (item.name === 'photo'){
                return item
            }
        })
        let file = elements[0].files[0]
        fileReader.onload = ()=>{
            //trocando callback por resolve da promise
            resolve(fileReader.result)
        }
        fileReader.onerror = (e)=>{
            reject(e)
        }

        if(file){
            fileReader.readAsDataURL(file)
        } else{
            //Se não tiver nenhuma imagem coloca a imagem cinza como default
            resolve('dist/img/boxed-bg.jpg')
        }
        
        })
    }

    getValues(){
        //Inserindo Spread para corrigir erro
        let user = {};
        [...this.formEl.elements].forEach(function(field, index){
            if(field.name == "gender" && field.checked == true){
                user[field.name] = field.value
            }else if(field.name === "admin"){
                user[field.name] = field.checked
            }else{
                user[field.name] = field.value
            }
        })
    
        return new User(
            user.name,
            user.gender,
            user.birth,
            user.country,
            user.email,
            user.password,
            user.photo,
            user.admin
            )
            
    }
     addLine(dataUser){
        let tr = document.createElement('tr')
        tr.innerHTML =
        `
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin)?'Sim' : 'Não'}</td>
            <td>${dataUser.birth}</td>
            <td>
        <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
        <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        
        `;
        this.tableEl.appendChild(tr)
    }

}