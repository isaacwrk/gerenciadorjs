class User{
    constructor(name, gender, birth, country, email, password,photo, admin){
        this._name = name
        this._gender = gender
        this._birth = birth
        this._country = country
        this._email = email
        this._password = password
        this._photo = photo
        this._admin = admin
        this._register = new Date()
    }

    get register(){
        return this._register
    }

    get name(){
        return this._name
    }

    get gender(){
        return this._gender
    }

    get birth(){
        return this._birth
    }

    get country(){
        return this._country
    }

    get email(){
        return this._email
    }

    get password(){
        return this._password
    }

    get photo(){
        return this._photo
    }

    get admin(){
        return this._admin
    }

    set photo(value){
        this._photo = value
    }

    loadFromJSON(json){
        for (let name in json){

            switch(name){
                case '_register':
                    this[name] = new Date(json[name])
                break;
                default:
                    this[name] = json[name]
            }
            
        }
    }
}

    