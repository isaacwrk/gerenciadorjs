class UserController{

    constructor(formIdCreate,formIdUpdate, tableId){
        this.formEl = document.getElementById(formIdCreate)
        this.formUpdateEl = document.getElementById(formIdUpdate)
        this.tableEl = document.getElementById(tableId)

        this.onSubmit()
        this.onEdit()
        this.selectAll()
    }

    onEdit(){
        document.querySelector("#box-user-update .btn-cancel").addEventListener("click", e=>{
            this.showPanelCreate()
        })

        this.formUpdateEl.addEventListener("submit", event =>{
            event.preventDefault();
            let btn = this.formUpdateEl.querySelector("[type=submit]")
            //travando o botao de submit
            btn.disabled = true

            let values = this.getValues(this.formUpdateEl)

            let index = this.formUpdateEl.dataset.trIndex

            let tr = this.tableEl.rows[index]

            let userOld = JSON.parse(tr.dataset.user)

            let result = Object.assign({}, userOld,values)

        this.getPhoto(this.formUpdateEl).then((content)=>{
            if(!values.photo) {
                result._photo = userOld._photo
            }else{
                result._photo = content
            }

            tr.dataset.user = JSON.stringify(result)

            tr.innerHTML = `
            <td><img src="${result._photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${result._name}</td>
            <td>${result._email}</td>
            <td>${(result._admin)?'Sim' : 'Não'}</td>
            <td>${Utils.dateFormat(result._register)}</td>
            <td>
        <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
        <button type="button" class="btn btn-danger  btn-xs btn-flat">Excluir</button>
            </td>
        `;

        this.addEventsTr(tr)
        this.updateCount()
        this.formUpdateEl.reset()
        btn.disabled = false
        this.showPanelCreate()

        },(e)=>{
            console.error(e)
        })
        })
    }

    onSubmit(){
        
        this.formEl.addEventListener("submit",event=>{
            //cancelar o comportamento padrão deste evento.
            event.preventDefault();

            let btn = this.formEl.querySelector("[type=submit]")
            //travando o botao de submit
            btn.disabled = true
            let values = this.getValues(this.formEl)

            if(!values) return false

            this.getPhoto(this.formEl).then((content)=>{
                values.photo = content
                //Inserindo sessionStorage
                this.insert(values)

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
    getPhoto(formEl){
        //Utilizando API Javascript para leitura de arquivos
        //Inserindo nova Promise
        return new Promise((resolve, reject)=>{
            let fileReader = new FileReader();
        
        let elements = [...formEl.elements].filter(item =>{
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

    getValues(formEl){
        //Inserindo Spread para corrigir erro
        let user = {};
        let isValid = true;

        [...formEl.elements].forEach(function(field, index){
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

    getUsersStorage(){
        let users = []

        if(localStorage.getItem("users")){
            users = JSON.parse(localStorage.getItem("users"))
        }
        return users
    }

    selectAll(){

        let users = this.getUsersStorage()

        users.forEach(dataUser=>{

            let user = new User()
            user.loadFromJSON(dataUser)
            this.addLine(user)
        })

    }

    insert(data){
        let users = this.getUsersStorage()

        users.push(data)
        //alterando de sessionStorage para localStorage
        localStorage.setItem("users",JSON.stringify(users))
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
        <button type="button" class="btn btn-danger  btn-delete btn-xs btn-flat">Excluir</button>
            </td>
        
        `;

        this.addEventsTr(tr)

        this.tableEl.appendChild(tr)
        this.updateCount()
    }

    addEventsTr(tr){

        tr.querySelector(".btn-delete").addEventListener("click", e=>{

            if(confirm("Deseja realmente Excluir?")){
                tr.remove()
                this.updateCount()
            }
        });


        tr.querySelector(".btn-edit").addEventListener("click", e=>{

            let json = JSON.parse(tr.dataset.user)
            

            this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex

            for (let name in json){
                let field = this.formUpdateEl.querySelector("[name="+ name.replace("_","")+"]")

                if(field){
                    
                    switch(field.type){
                        case 'file':
                            continue;
                        break;

                        case 'radio':
                            field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") + "][value=" + json[name] + "]");
                            console.log(field);
                            field.checked = true; 
                            break;

                        case 'checkbox':
                            field.checked = json[name]
                        break;

                        default:
                            field.value = json[name]
                    }
                }
                
            }

            this.formUpdateEl.querySelector(".photo").src = json._photo;
            this.showPanelUpdate()
        })
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