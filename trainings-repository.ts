interface ITrainingsRepository {
    findAll(): Training[]
    find(id: number): Training;
    push(training: Training);
    update(id: number, name: string, date: string, instructor:string, level: string)
    delete(id: number): number;
}

type Training = {
  id: number;
  name: string;
  date: string;
  instructor: string;
  level: string;
};

export class InMemoryTrainingsRepository implements ITrainingsRepository {

  trainings : Training[] = [];

  findAll(): Training[] {
      return this.trainings;
  }

  find(id: number) {
    return this.trainings.find(training => training.id === id);
  }

  push(training: Training) {
      hasUniqueNameAndLevel(training.name, training.level, this.trainings)
      hasTrainingDateHasRRRRMMDD(training.date)
      hasTrainingLevel(training.level)
      hasTrainerOnlyOneTrainingPerDay(training.date, training.instructor, this.trainings)
      hasAdvancedTrainingBasicPrecedesor(training.name, training.level, this.trainings)
      this.trainings.push(training);
  }

  update(id: number, name: string, date: string, instructor: string, level: string) {
    const updatedTraining = this.trainings.find(training => training.id === id);

    if (!updatedTraining) {
      return updatedTraining
    } else {
      updatedTraining.name = name;
      updatedTraining.date = date;
      updatedTraining.instructor = instructor;
      updatedTraining.level = level;
  
      return updatedTraining;
    }
  }

  delete(id: number): number {
    const index = this.trainings.findIndex(training => training.id === id);
    this.trainings.splice(index, 1);
    return index;
  }
};

function hasTrainingDateHasRRRRMMDD(date: string) {
  return date === "rrrr-mm-dd"
}

function hasTrainingLevel(level: string) {
  if(level === "BASIC" || level === "ADVAMCED") {
    return true
  } else {
    return false;
  }
}

function hasTrainerOnlyOneTrainingPerDay(date: string, instructor: string, trainings: Training[]) {
  return trainings.find(t => {
    return t.date === date && t.instructor === instructor
  });
}

function hasAdvancedTrainingBasicPrecedesor(name: string, level: string, trainings: Training[]) {
  if (level === "ADVANCED") {
    let found = trainings.findIndex(t => {
        return t.name === name && t.level === "BASIC";
    });
    if(found) {
      throw new Error("Nie znaleziono szkolenia na poziomie BASIC. Dodaj najpierws szkolenie na poziomie BASIC");
    }
  }
}

function hasUniqueNameAndLevel(name: string, level: string, trainings: Training[]) {
  let found = trainings.findIndex(t => {
    return t.name === name && t.level === level;
  });
  if (found >= 0) {
    throw new Error("Nie moze istniec szkolenie, ktore ma ta sama nazwe i poziom");
  }
}

