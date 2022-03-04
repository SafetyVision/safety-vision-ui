export const TrainingStates = {
    'init': 'Not Trained',
    'committing_1': 'Commiting Infraction (Round 1)',
    'done_committing_1': 'Completed Commiting Infraction (Round 1)',
    'not_committing_1': 'Not Committing Infraction (Round 1)',
    'done_not_committing_1': 'Completed Not Commiting Infraction (Round 1)',
    'committing_2': 'Commiting Infraction (Round 2)',
    'done_committing_2': 'Completed Commiting Infraction (Round 2)',
    'not_committing_2': 'Not Committing Infraction (Round 2)',
    'done_not_committing_2': 'Completed Not Commiting Infraction (Round 2)',
    'trained': 'Trained',
};

export const TrainingStatesVerbose = {
    'init': 'Training State: Not Trained - Demonstrate the infraction being committed when you click Start Training',
    'committing_1': 'Training State: Commiting Infraction (Round 1)',
    'done_committing_1': `Training State: Completed Commiting Infraction (Round 1) -
        Demonstrate the infraction not being committed when you click Continue Training`,
    'not_committing_1': 'Training State: Not Committing Infraction (Round 1)',
    'done_not_committing_1': `Training State: Completed Not Commiting Infraction (Round 1) -
        Demonstrate the infraction being committed when you click Continue Training`,
    'committing_2': 'Training State: Commiting Infraction (Round 2)',
    'done_committing_2': `Training State: Completed Commiting Infraction (Round 2) -
        Demonstrate the infraction not being committed when you click Continue Training`,
    'not_committing_2': 'Training State: Not Committing Infraction (Round 2)',
    'done_not_committing_2': `Training State: Completed Not Commiting Infraction (Round 2) - You are finished
        providing training data. Check back here when we have finished training your device.`,
    'trained': 'Trained',
};

export const removeAssignedInfractions= (trainingModels, infractions) => {
    trainingModels.forEach(model => {
        infractions = infractions.filter(infraction => {return infraction.id !== model.infraction_type});
    });
    return infractions
};
