export const TrainingStates = {
    'init': 'Not Trained',
    'committing_1': 'Commiting First Infraction',
    'done_committing_1': 'Completed Commiting First Infraction',
    'not_committing_1': 'Not Committing First Infraction',
    'done_not_committing_1': 'Completed Not Commiting First Infraction',
    'committing_2': 'Commiting Second Infraction',
    'done_committing_2': 'Completed Commiting Second Infraction',
    'not_committing_2': 'Not Committing Second Infraction',
    'done_not_committing_2': 'Completed Not Commiting Second Infraction',
    'trained': 'Trained',
};

export const removeAssignedInfractions= (trainingModels, infractions) => {
    trainingModels.forEach(model => {
        infractions = infractions.filter(infraction => {return infraction.id !== model.infraction_type});
    });
    return infractions
};
