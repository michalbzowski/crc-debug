export class InMemoryTrainingsRepository {
    constructor() {
        this.trainings = [];
    }
    findAll() {
        return this.trainings;
    }
    find(id) {
        return this.trainings.find(training => training.id === id);
    }
    push(training) {
        hasTrainingDateHasRRRRMMDD(training.date);
        hasTrainingLevel(training.level);
        hasTrainerOnlyOneTrainingPerDay(training.date, training.instructor, this.trainings);
        hasAdvancedTrainingBasicPrecedesor(training.name, training.level, this.trainings);
        this.trainings.push(training);
    }
    update(id, name, date, instructor, level) {
        const updatedTraining = this.trainings.find(training => training.id === id);
        if (!updatedTraining) {
            return updatedTraining;
        }
        else {
            updatedTraining.name = name;
            updatedTraining.date = date;
            updatedTraining.instructor = instructor;
            updatedTraining.level = level;
            return updatedTraining;
        }
    }
    delete(id) {
        const index = this.trainings.findIndex(training => training.id === id);
        this.trainings.splice(index, 1);
        return index;
    }
}
;
function hasTrainingDateHasRRRRMMDD(date) {
    return date === "rrrr-mm-dd";
}
function hasTrainingLevel(level) {
    if (level === "BASIC" || level === "ADVAMCED") {
        return true;
    }
    else {
        return false;
    }
}
function hasTrainerOnlyOneTrainingPerDay(date, instructor, trainings) {
    return trainings.find(t => {
        return t.date === date && t.instructor === instructor;
    });
}
function hasAdvancedTrainingBasicPrecedesor(name, level, trainings) {
    if (level === "ADVANCED") {
        let found = trainings.findIndex(t => {
            return t.name === name && t.level === "BASIC";
        });
        if(found) {
            throw new Error("Kot")
        }
    }
}
