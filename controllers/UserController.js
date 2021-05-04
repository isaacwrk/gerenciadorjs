class UserController{

    constructor(formId, tableId){
        this.formEl = document.getElementById(formId)
        this.tableEl = document.getElementById(tableId)

        this.onSubmit();
        this.onEditCancel()
    }

    onEditCancel(){
        document.querySelector("#box-user-update .btn-cancel").addEventListener("click", e=>{
            this.showPanelCreate()
        })
    }

    onSubmit(){
        
        this.formEl.addEventListener("submit",event=>{
            //cancelar o comportamento padrão deste evento.
            event.preventDefault();

            let btn = this.formEl.querySelector("[type=submit]")
            //travando o botao de submit
            btn.disabled = true
            let values = this.getValues()

            if(!values) return false

            this.getPhoto().then((content)=>{
                values.photo = content
                this.addLine(values)
                //resetar os campos
                this.formEl.reset()
                //retornando o botao de submit
                btn.disabled = false
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
        let isValid = true;

        [...this.formEl.elements].forEach(function(field, index){
            if(['name','email','password'].indexOf(field.name) > -1 && !field.value){

                field.parentElement.classList.add('has-error')
                isValid = false;
            }
            if(field.name == "gender" && field.checked == true){
                user[field.name] = field.value
            }else if(field.name === "admin"){
                user[field.name] = field.checked
            }else{
                user[field.name] = field.value
            }
        })

        if(!isValid){
            return false
        }

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

        //convertendo objeto em string e guardando em JSON
        tr.dataset.user = JSON.stringify(dataUser)

        tr.innerHTML =
        `
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin)?'Sim' : 'Não'}</td>
            <td>${Utils.dateFormat(dataUser.register)}</td>
            <td>
        <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
        <button type="button" class="btn btn-danger  btn-xs btn-flat">Excluir</button>
            </td>
        
        `;

        tr.querySelector(".btn-edit").addEventListener("click", e=>{

            let json = JSON.parse(tr.dataset.user)
            let form = document.querySelector("#form-user-update")

            for (let name in json){
                let field = form.querySelector("[name="+ name.replace("_","")+"]")

                if(field){
                    if(field.type == 'file') continue;
                    field.value = json[name]
                }
                
            }

            this.showPanelUpdate()
        })

        this.tableEl.appendChild(tr)
        this.updateCount()
    }

    showPanelCreate(){
        document.querySelector("#box-user-create").style.display = "block"
        document.querySelector("#box-user-update").style.display = "none"
    }

    showPanelUpdate(){
        document.querySelector("#box-user-create").style.display = "none"
        document.querySelector("#box-user-update").style.display = "block"
    }

    updateCount(){

        let numberUsers = 0;
        let numberAdmin = 0;

        [...this.tableEl.children].forEach(tr=>{

            numberUsers++;

            //parse revertendo a objeto
            let user = JSON.parse(tr.dataset.user)
            if(user._admin) numberAdmin++;
        })

        document.querySelector("#number-users").innerHTML = numberUsers
        document.querySelector("#number-users-admin").innerHTML = numberAdmin
    }
}