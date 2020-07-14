const Base_Url = "http://localhost:3000"

class API_services {
    static update_notes(id) {
        return new Promise( async (resolve, reject) => {
            axios.put(`${Base_Url}/prof/notes`, { id })
                .then(() => resolve(location.href=`/prof/notes/${id}`))
                .catch((err) => reject(console.log(err)));
        });
    }

    static delete_notes(id) {
        console.log('api');
        return new Promise(async (resolve, reject) => {
            axios.delete(`${Base_Url}/prof/notes/${id}`)
                .then((res) => {
                    console.log(res);
                    resolve(location.href='/prof/notes/');
                })
                .catch((err) => reject(console.log(err)));
        });
    }
}