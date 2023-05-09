export class InMemoryUsersRepository {
    constructor() {
        this.users = [];
    }
    find(username) {
        return this.users.find(user => user.username === username);
    }
    push(user) {
        return this.users.push(user);
    }
}
;
